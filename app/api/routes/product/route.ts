import { NextResponse } from "next/server";
import { UploadImage } from "../../controller/imageController";
import PackageService from "../../services/productServices";
import consoleManager from "../../utils/consoleManager";

// Get all packages (GET)
export async function GET(req: Request) {
    try {

        // Fetch products based on status filter
        const products = await PackageService.getAllProducts();
        consoleManager.log("Fetched all products:", products.length);


        return NextResponse.json({
            statusCode: 200,
            message: "Products fetched successfully",
            data: products,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/product:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Add a new product (POST)
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const title = formData.get("title");
        const file = formData.get("image");

        if (!title || !file) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "Title, and image are required",
            }, { status: 400 });
        }

        // Upload image to Firebase Storage (800x600 for packages)
        const imageUrl = await UploadImage(file, 600, 400);
        consoleManager.log("✅ Package image uploaded:", imageUrl);

        // Save product data in Firestore
        const newProduct = await PackageService.addProduct({
            title,
            image: imageUrl,
        });

        consoleManager.log("✅ Product created successfully:", newProduct);

        return NextResponse.json({
            statusCode: 201,
            message: "Product added successfully",
            data: newProduct,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });

    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/product:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { UploadImage } from "../../controller/imageController";
import PackageService from "../../services/productServices";
import consoleManager from "../../utils/consoleManager";

// GET: Fetch all products
export async function GET(req: Request) {
    try {
        const products = await PackageService.getAllProducts();
        consoleManager.log("Fetched all products:", products.length);

        return NextResponse.json(
            {
                statusCode: 200,
                message: "Products fetched successfully",
                data: products,
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 200 }
        );
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/routes/products:", error);
        return NextResponse.json(
            {
                statusCode: 500,
                errorCode: "INTERNAL_ERROR",
                errorMessage: error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

// POST: Add a new product
export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = formData.get("name")?.toString();
        const description = formData.get("description")?.toString();
        const priceStr = formData.get("price")?.toString();
        const file = formData.get("image");

        const price = parseFloat(priceStr || "");
        if (!name || !description || isNaN(price) || !file) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "Name, description, price, and image are required.",
            }, { status: 400 });
        }

        const imageUrl = await UploadImage(file, 600, 400);

        const newProduct = await PackageService.addProduct({
            name,
            description,
            price,
            image: imageUrl,
        });

        return NextResponse.json({
            statusCode: 201,
            message: "Product added successfully",
            data: newProduct,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });

    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/routes/products:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

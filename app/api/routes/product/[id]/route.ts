import { NextResponse } from "next/server";
import ProductService from "../../../services/productServices";
import consoleManager from "../../../utils/consoleManager";
import { ReplaceImage } from "../../../controller/imageController";

// Get a single product by ID (GET)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const products = await ProductService.getProductById(id);

        if (!products) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Product not found",
            }, { status: 404 });
        }

        consoleManager.log("Fetched product:", id);
        return NextResponse.json({
            statusCode: 200,
            message: "Product fetched successfully",
            data: products,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in GET /api/product/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Update a product by ID (PUT) - Handles image replacement
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const formData = await req.formData(); // Get form data
        if (!id) throw new Error("Product ID is required");

        let updateData: any = {};
        const title = formData.get("title");
        const image = formData.get("image"); // File input

        if (title) updateData.title = title;

        // Fetch existing product to get old image URL
        const existingProduct = await ProductService.getProductById(id);
        if (!existingProduct) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Product not found",
            }, { status: 404 });
        }

        // If a new image is provided, replace the old one; otherwise, keep the existing one
        if (image) {
            if (!existingProduct.image) {
                consoleManager.warn("No old image URL found for replacement.");
            }
            const imageUrl = await ReplaceImage(image, existingProduct.image, 600, 400);
            updateData.image = imageUrl;
        } else {
            updateData.image = existingProduct.image; // Keep the existing image
        }

        // Update product in database
        const updatedProduct = await ProductService.updateProduct(id, updateData);
        consoleManager.log("Product updated successfully:", id);

        return NextResponse.json({
            statusCode: 200,
            message: "Product updated successfully",
            data: updatedProduct,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in PUT /api/product/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Delete a product by ID (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) throw new Error("Product ID is required");

        // Fetch existing product to get old image URL
        const existingProduct = await ProductService.getProductById(id);
        if (!existingProduct) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Product not found",
            }, { status: 404 });
        }

        // Delete product image using ReplaceImage function (null prevents re-upload)
        if (existingProduct.image) {
            await ReplaceImage(null, existingProduct.image, 0, 0);
        }

        // Delete product from DB
        await ProductService.deleteProduct(id);
        consoleManager.log("Product deleted successfully:", id);

        return NextResponse.json({
            statusCode: 200,
            message: "Product deleted successfully",
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in DELETE /api/product/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

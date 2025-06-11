import { NextResponse } from "next/server";
import BlogService from "../../../services/blogServices";
import consoleManager from "../../../utils/consoleManager";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const blog = await BlogService.getBlogById(id);
        return NextResponse.json({
            statusCode: 200,
            message: "Blog fetched successfully",
            data: blog,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in GET /api/blogs/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { name, description, price, image, locationId, features } = await req.json();
        const updatedBlog = await BlogService.updateBlog(id, { name, description, price, image, locationId, features });

        return NextResponse.json({
            statusCode: 200,
            message: "Blog updated successfully",
            data: updatedBlog,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in PUT /api/blogs/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const deletedBlog = await BlogService.deleteBlog(id);
        return NextResponse.json({
            statusCode: 200,
            message: "Blog deleted successfully",
            data: deletedBlog,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in DELETE /api/blogs/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

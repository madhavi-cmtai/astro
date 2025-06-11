import { NextResponse } from "next/server";
import BlogService from "../../services/blogServices";
import { UploadImage } from "../../controller/imageController";
import consoleManager from "../../utils/consoleManager";
import formidable from "formidable";


export const config = {
    api: {
        bodyParser: false, // Disable Next.js's default body parser for formidable
    },
};

export async function GET(req: Request) {
    try {
        const blogs = await BlogService.getAllBlogs();
        return NextResponse.json(
            {
                statusCode: 200,
                message: "Blogs fetched successfully",
                data: blogs,
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 200 }
        );
    } catch (error: any) {
        consoleManager.error("Error in GET /api/blogs:", error);
        // It's generally good practice to log error details for debugging
        // but avoid exposing too much detail in the client response.
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

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get("content-type") || "";

        // Ensure the content-type is multipart/form-data
        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                {
                    statusCode: 400,
                    errorCode: "BAD_REQUEST",
                    errorMessage: "Content-Type must be multipart/form-data",
                },
                { status: 400 }
            );
        }

        // Dynamically import formidable to parse multipart form-data
        // 'import().default' is used because formidable is a default export
        const formidable = (await import("formidable")).default;
        const form = new formidable.IncomingForm();

       
        const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
            (resolve, reject) => {
               
                form.parse(req as any, (err, fields, files) => {
                    if (err) {
                        consoleManager.error("Formidable parse error:", err);
                        return reject(err);
                    }
                    resolve({ fields, files });
                });
            }
        );

       
        const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
        const summary = Array.isArray(fields.summary) ? fields.summary[0] : fields.summary;

       
        const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

      
        if (!title || !summary) {
            return NextResponse.json(
                {
                    statusCode: 400,
                    errorCode: "BAD_REQUEST",
                    errorMessage: "Title and summary are required",
                },
                { status: 400 }
            );
        }

        if (!imageFile) {
            return NextResponse.json(
                {
                    statusCode: 400,
                    errorCode: "BAD_REQUEST",
                    errorMessage: "Image file is required",
                },
                { status: 400 }
            );
        }

     
        const width = 1200; 
        const height = 800; 

        const uploadedImageUrl = await UploadImage(imageFile.filepath, width, height);

       
        // Save new blog with uploaded image URL
        const newBlog = await BlogService.addBlog({
            title: String(title),
            summary: String(summary),
            image: uploadedImageUrl,
            createdAt: new Date().toISOString(), 
        });

        consoleManager.log("Blog added successfully:", newBlog.id);

        return NextResponse.json(
            {
                statusCode: 201,
                message: "Blog added successfully",
                data: newBlog,
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 201 }
        );
    } catch (error: any) {
        consoleManager.error("Error in POST /api/blogs:", error);
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

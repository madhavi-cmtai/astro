import { NextRequest, NextResponse } from "next/server";
import BlogService from "../../services/blogServices";
import { UploadImage } from "../../controller/imageController";
import consoleManager from "../../utils/consoleManager";
import formidable, { IncomingForm } from "formidable";
import { Readable } from "stream";
import fs from "fs";



export const config = {
    api: {
        bodyParser: false, // Disable Next.js body parser to use formidable
    },
};

export async function GET() {
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

export async function POST(req: NextRequest) {
    try {
        console.log("Received POST request");

        const form = new IncomingForm({ keepExtensions: true, multiples: false });

        const nodeReq = Readable.fromWeb(req.body as any) as any;
        nodeReq.headers = Object.fromEntries(req.headers.entries());
        nodeReq.method = req.method;

        console.log("Parsing form data...");
        const data = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
            form.parse(nodeReq, (err, fields, files) => {
                if (err) {
                    console.log("Error parsing form:", err);
                    reject(err);
                } else {
                    console.log("Parsed form data:", fields, files);
                    resolve({ fields, files });
                }
            });
        });

        const { title, summary } = data.fields;
        const image = Array.isArray(data.files.image) ? data.files.image[0] : data.files.image;

        if (!title || !summary || !image) {
            console.log("Validation failed:", { title, summary, image });
            return NextResponse.json(
                { statusCode: 400, errorMessage: "Title, summary, and image are required" },
                { status: 400 }
            );
        }

        console.log("Uploading image...");
        const imageStream = fs.createReadStream(image.filepath);
        const imageUrl = await UploadImage(imageStream, 800, 600);

        if (!imageUrl) {
            console.log("Image upload failed");
            throw new Error("Image upload returned no URL");
        }

        console.log("Image uploaded:", imageUrl);

        const newBlog = {
            title,
            summary,
            image: imageUrl,
        };

        console.log("Saving to Firestore:", newBlog);
        const created = await BlogService.addBlog(newBlog);
        console.log("Blog saved:", created);

        return NextResponse.json(
            {
                statusCode: 201,
                message: "Blog created successfully",
                data: created,
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST /api/routes/blogs:", error);
        return NextResponse.json(
            {
                statusCode: 500,
                errorCode: "INTERNAL_ERROR",
                errorMessage: "Something went wrong",
            },
            { status: 500 }
        );
    }
}
  
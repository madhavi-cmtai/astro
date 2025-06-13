import { NextResponse } from "next/server";
import { uploadMedia } from "@/app/api/controller/mediaController";
import TestimonialService from "@/app/api/services/testimonialServices";
import { IncomingForm } from "formidable";
import { Readable } from "stream";

// Turn off body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

// Utility to convert Web Request to Node.js Readable stream
const toNodeReadable = async (req: Request): Promise<Readable> => {
    const buffer = Buffer.from(await req.arrayBuffer());
    return Readable.from(buffer);
};

// Formidable parser
const parseForm = async (req: Request) => {
    const form = new IncomingForm({ keepExtensions: true });

    const contentType = req.headers.get("content-type") || "";
    const contentLength = req.headers.get("content-length") || "";

    const bodyBuffer = Buffer.from(await req.arrayBuffer());

    // Mock a Node.js IncomingMessage
    const mockReq = Object.assign(Readable.from(bodyBuffer), {
        headers: {
            "content-type": contentType,
            "content-length": contentLength,
        },
        method: "POST",
        url: "",
    });

    return new Promise<{ fields: any; files: any }>((resolve, reject) => {
        form.parse(mockReq as any, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
};
  

// GET handler
export async function GET() {
    try {
        const data = await TestimonialService.getAllTestimonials();
        return NextResponse.json({
            statusCode: 200,
            message: "Testimonials fetched successfully",
            data,
            errorCode: "NO",
            errorMessage: "",
        });
    } catch (error: any) {
        console.error("GET error:", error);
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

// POST handler
export async function POST(req: Request) {
    try {
        const { fields, files } = await parseForm(req);

        const name = fields.name?.[0] || "";
        const description = fields.description?.[0] || "";
        const spread = fields.spread?.[0] || "";
        const rating = parseInt(fields.rating?.[0] || "0");
        const status = fields.status?.[0] === "inactive" ? "inactive" : "active";
        const createdOn = new Date().toISOString();
        const updatedOn = createdOn;

        const file = Array.isArray(files.media) ? files.media[0] : files.media;

        let media = "";
        let mediaType: "image" | "video" | null = null;

        if (file) {
            const uploaded = await uploadMedia(file);
            media = uploaded.url;
            mediaType = uploaded.type;
        }

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        if (mediaType === "image" && !description) {
            return NextResponse.json(
                { error: "Description required for image" },
                { status: 400 }
            );
        }

        const testimonial = {

            name,
            description,
            media,
            mediaType,
            spread,
            rating,
            status,
            createdOn,
            updatedOn,
        };

        await TestimonialService.addTestimonial(testimonial);

        return NextResponse.json({
            statusCode: 201,
            message: "Testimonial created successfully",
            data: testimonial,
            errorCode: "NO",
            errorMessage: "",
        });
    } catch (err: any) {
        console.error("POST error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to add testimonial" },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import { replaceMedia, deleteMedia } from "@/app/api/controller/mediaController";
import TestimonialService from "@/app/api/services/testimonialServices";

// Turn off body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

// Parse FormData with formidable
const parseForm = async (req: Request) => {
    const form = new IncomingForm({ keepExtensions: true });

    const contentType = req.headers.get("content-type") || "";
    const contentLength = req.headers.get("content-length") || "";

    const bodyBuffer = Buffer.from(await req.arrayBuffer());

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

// PUT /api/routes/testimonials/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const existing = await TestimonialService.getTestimonialById(id);        if (!existing) {
            return NextResponse.json({
                statusCode: 404,
                message: "Testimonial not found",
                data: null,
                errorCode: "NOT_FOUND",
                errorMessage: "Testimonial not found"
            }, { status: 404 });
        }

        const { fields, files } = await parseForm(req);

        const name = fields.name?.[0] || existing.name;
        const description = fields.description?.[0] || existing.description;
        const spread = fields.spread?.[0] || existing.spread;
        const rating = parseInt(fields.rating?.[0] || existing.rating);
        const status = fields.status?.[0] === "inactive" ? "inactive" : "active";
        const updatedOn = new Date().toISOString();

        let media = existing.media;
        let mediaType = existing.mediaType;

        const file = Array.isArray(files.media) ? files.media[0] : files.media;
        if (file) {
            const uploaded = await replaceMedia(existing.media, file);
            media = uploaded.url;
            mediaType = uploaded.type;
        }

        const updated = {
            ...existing,
            name,
            description,
            media,
            mediaType,
            spread,
            rating,
            status,
            updatedOn,
        };

        await TestimonialService.updateTestimonial(id, updated);

        return NextResponse.json({
            statusCode: 200,
            message: "Testimonial updated successfully",
            data: updated,
            errorCode: "NO",
            errorMessage: "",
        });
    } catch (err: any) {
        console.error("PUT error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to update testimonial" },
            { status: 500 }
        );
    }
}


// DELETE /api/routes/testimonials/[id]
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    try {
        const { id } = await params;

        const testimonial = await TestimonialService.getTestimonialById(id);
        if (!testimonial) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        }

        // If the testimonial has an associated media file, delete it
        if (testimonial.media) {
            await deleteMedia(testimonial.media);
        }

        // Delete the testimonial record from the database
        await TestimonialService.deleteTestimonial(id);

        return NextResponse.json({
            data: id,
            message: "Testimonial deleted successfully",
            statusCode: 200,
            errorCode: "NO",
            errorMessage: "",
        });
    } catch (err: any) {
        console.error("DELETE error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to delete testimonial" },
            { status: 500 }
        );
    }
}

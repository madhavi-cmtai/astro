// app/api/routes/testimonial/route.ts
import { NextRequest, NextResponse } from "next/server";
import { admin, db } from "@/app/api/config/firebase";
import { uploadMedia } from "@/app/api/controller/mediaController"; // adjust import path
import { parseFormData } from "@/lib/parseFormData"; // helper to extract form fields and files


export const config = {
    api: {
        bodyParser: false, // Required for FormData
    },
  };

export async function GET() {
    try {
        const snapshot = await db.collection("testimonials").get();
        const testimonials = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return NextResponse.json(testimonials);
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { fields, file } = await parseFormData(req);
        const mediaUrl = await uploadMedia(file);

        const docRef = await db.collection("testimonials").add({
            title: fields.title,
            media: mediaUrl,
            createdOn: admin.firestore.FieldValue.serverTimestamp(),
            updatedOn: admin.firestore.FieldValue.serverTimestamp(),
        });

        return NextResponse.json({
            id: docRef.id,
            title: fields.title,
            media: mediaUrl,
        });
    } catch (err) {
        return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
    }
}
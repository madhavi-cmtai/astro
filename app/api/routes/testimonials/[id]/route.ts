// app/api/testimonials/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, admin } from "@/app/api/config/firebase";
import { parseFormData } from "@/lib/parseFormData";
import { replaceMedia, deleteMedia } from "@/app/api/utils/mediaUtils";

type Params = Promise<{ id: string }>;

// PATCH: Update a testimonial
export async function PATCH(req: NextRequest, context: { params: Params }) {
    const { id } = await context.params; // <-- using 'await params' as requested

    try {
        const { fields, file } = await parseFormData(req);
        const docRef = db.collection("testimonials").doc(id);
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        }

        const prevData = snapshot.data();
        let newMedia = prevData?.media;

        if (file) {
            newMedia = await replaceMedia(file, prevData?.media);
        }

        const updated = {
            title: fields.title || prevData?.title,
            media: newMedia,
            updatedOn: admin.firestore.FieldValue.serverTimestamp(),
        };

        await docRef.update(updated);

        return NextResponse.json({ id, ...updated });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
    }
}

// DELETE: Remove a testimonial
export async function DELETE(_: NextRequest, context: { params: Params }) {
    const { id } = await context.params; // <-- using 'await params' as requested

    try {
        const docRef = db.collection("testimonials").doc(id);
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const data = snapshot.data();
        await deleteMedia(data?.media);
        await docRef.delete();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
    }
}

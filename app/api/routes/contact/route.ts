import { db } from "@/app/api/config/firebase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, message, phone } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await db.collection("contactMessages").add({
            name,
            email,
            message,
            phone: phone || "",
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json({ message: "Message submitted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error saving message:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

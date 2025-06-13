import { adminStorage } from "../config/firebase";
import { File } from "formidable";
import fs from "fs/promises";
const MAX_MEDIA_SIZE = 50 * 1024 * 1024; // 50MB

// Upload new media
const uploadMedia = async (file: any): Promise<{ url: string; type: "image" | "video" }> => {
    try {
        if (!file || !file.filepath) throw new Error("No media file provided.");

        const buffer = await fs.readFile(file.filepath); 

        // Check file size
        if (buffer.length > MAX_MEDIA_SIZE) {
            throw new Error("File size exceeds the 50MB limit.");
        }


        const bucket = adminStorage.bucket();
        const filePath = `stall-craft/media/${Date.now()}_${file.name}`;
        const firebaseFile = bucket.file(filePath);

        const blobStream = firebaseFile.createWriteStream({
            metadata: { contentType: file.type },
        });

        return new Promise((resolve, reject) => {
            blobStream.on("error", reject);
            blobStream.on("finish", async () => {
                const [url] = await firebaseFile.getSignedUrl({
                    action: "read",
                    expires: "03-09-2491",
                });

                const type: "image" | "video" = file.type?.startsWith("video/")
                    ? "video"
                    : "image";

                resolve({ url, type }); // ✅ return object, not just string
            });
            blobStream.end(buffer);
        });
    } catch (error: any) {
        throw new Error("Error uploading media: " + error.message);
    }
};

// Replace media: delete old and upload new
const replaceMedia = async (
    file: File,
    oldUrl: string
): Promise<{ url: string; type: "image" | "video" }> => {
    try {
        const bucket = adminStorage.bucket();

        // Delete old file if exists
        if (oldUrl) {
            try {
                let oldFilePath;
                if (oldUrl.includes("/o/")) {
                    oldFilePath = oldUrl.split("/o/")[1].split("?")[0];
                } else if (oldUrl.includes("storage.googleapis.com")) {
                    const urlParts = oldUrl.split("storage.googleapis.com/")[1].split("?")[0];
                    oldFilePath = urlParts.split("/").slice(1).join("/");
                } else {
                    throw new Error("Invalid old media URL format");
                }

                const decodedOldFilePath = decodeURIComponent(oldFilePath);
                await bucket.file(decodedOldFilePath).delete();
                console.log("Old media deleted:", decodedOldFilePath);
            } catch (deleteErr: any) {
                console.warn("Failed to delete old media:", deleteErr.message);
            }
        }

        // ✅ Correct: Upload new media and return url + type
        const uploaded = await uploadMedia(file); // <--- This returns { url, type }
        return uploaded;

    } catch (error: any) {
        throw new Error("Error replacing media: " + error.message);
    }
};
  
// Delete media from Firebase Storage
const deleteMedia = async (mediaUrl: string) => {
    try {
        if (!mediaUrl) throw new Error("No media URL provided");

        const bucket = adminStorage.bucket();
        let filePath: string;

        if (mediaUrl.includes("/o/")) {
            
            const encodedPath = mediaUrl.split("/o/")[1].split("?")[0];
            filePath = decodeURIComponent(encodedPath); 
        } else if (mediaUrl.includes("storage.googleapis.com")) {
            
            const urlParts = mediaUrl.split("storage.googleapis.com/")[1].split("?")[0];
            filePath = urlParts.split("/").slice(1).join("/");
        } else {
            throw new Error("Invalid media URL format");
        }

        await bucket.file(filePath).delete();
        console.log("✅ Deleted media from Firebase Storage:", filePath);
    } catch (error: any) {
        console.warn("⚠️ Failed to delete media:", error.message);
        throw new Error("Media deletion error: " + error.message);
    }
};


export { uploadMedia, replaceMedia, deleteMedia };

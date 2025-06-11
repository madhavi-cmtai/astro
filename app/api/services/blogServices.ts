import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class BlogService {
    static blogs: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initBlogs() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for blogs...");
        const blogsCollection = db.collection("blogs");

        blogsCollection.onSnapshot((snapshot: any) => {
            this.blogs = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log("🔥 Firestore Read: Blogs updated, count:", this.blogs.length);
        });

        this.isInitialized = true;
    }

    // Get all blogs (Uses cache unless forceRefresh is true)
    static async getAllBlogs(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log("Force refreshing blogs from Firestore...");
            const snapshot = await db.collection("blogs").orderBy("createdOn", "desc").get();
            this.blogs = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached blogs. No Firestore read.");
        }
        return this.blogs;
    }

    // Add a new blog with createdOn timestamp
    static async addBlog(blogData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newBlogRef = await db.collection("blogs").add({
                ...blogData,
                createdOn: timestamp,
            });

            consoleManager.log("✅ New blog added with ID:", newBlogRef.id);

            // Force refresh the cache after adding a new blog
            await this.getAllBlogs(true);

            return { id: newBlogRef.id, ...blogData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding blog:", error);
            throw new Error("Failed to add blog");
        }
    }

    // Get blog by ID (fetches from cache first)
    static async getBlogById(blogId: string) {
        try {
            const cachedBlog = this.blogs.find((b: any) => b.id === blogId);
            if (cachedBlog) {
                consoleManager.log("✅ Blog fetched from cache:", blogId);
                return cachedBlog;
            }

            const blogRef = db.collection("blogs").doc(blogId);
            const doc = await blogRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ Blog not found:", blogId);
                return null;
            }

            consoleManager.log("✅ Blog fetched from Firestore:", blogId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching blog by ID:", error);
            throw new Error("Failed to fetch blog");
        }
    }

    // Update blog with updatedOn timestamp
    static async updateBlog(blogId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const blogRef = db.collection("blogs").doc(blogId);
            await blogRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ Blog updated:", blogId);

            // Force refresh the cache after updating a blog
            await this.getAllBlogs(true);

            return { id: blogId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating blog:", error);
            throw new Error("Failed to update blog");
        }
    }

    // Delete blog
    static async deleteBlog(blogId: string) {
        try {
            await db.collection("blogs").doc(blogId).delete();
            consoleManager.log("✅ Blog deleted:", blogId);

            // Force refresh the cache after deleting a blog
            await this.getAllBlogs(true);

            return { success: true, message: "Blog deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting blog:", error);
            throw new Error("Failed to delete blog");
        }
    }
}

export default BlogService;

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `event-${Date.now()}.${ext}`;

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), "public", "events");
        await mkdir(uploadDir, { recursive: true });

        // Write file
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        return NextResponse.json({ url: `/events/${filename}` });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

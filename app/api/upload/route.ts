import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["events", "profiles", "certificates"] as const;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Determine upload category
        const type = (formData.get("type") as string) || "events";
        if (!ALLOWED_TYPES.includes(type as typeof ALLOWED_TYPES[number])) {
            return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const prefix = type === "profiles" ? "profile" : type === "certificates" ? "cert" : "event";
        const filename = `${prefix}-${Date.now()}.${ext}`;

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), "public", type);
        await mkdir(uploadDir, { recursive: true });

        // Write file
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        return NextResponse.json({ url: `/${type}/${filename}` });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/data";

// GET: Fetch courses (all or filtered by pageKey)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get("pageKey");

    const courses = await prisma.course.findMany({
      where: pageKey ? { pageKey } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("[COURSES_GET_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

// POST: Create a new course or Update an existing one
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      id, 
      pageKey, 
      title, 
      category, 
      age, 
      description, 
      features, 
      themeKey, 
      popular 
    } = body;

    // Validation
    if (!pageKey || !title || !category || !age) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let course;

    if (id) {
      // UPDATE existing course
      course = await prisma.course.update({
        where: { id: Number(id) },
        data: {
          pageKey,
          title,
          category,
          age,
          description,
          features,
          themeKey,
          popular: Boolean(popular),
        },
      });
    } else {
      // CREATE new course
      course = await prisma.course.create({
        data: {
          pageKey,
          title,
          category,
          age,
          description,
          features,
          themeKey,
          popular: Boolean(popular),
        },
      });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("[COURSES_POST_ERROR]", error);
    return NextResponse.json({ error: "Failed to save course" }, { status: 500 });
  }
}

// DELETE: Remove a course by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    await prisma.course.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("[COURSES_DELETE_ERROR]", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
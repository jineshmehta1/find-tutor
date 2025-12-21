
import { NextResponse } from "next/server";
import { prisma } from "@/lib/data";

// PUT: Update existing course
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updateData = { ...body };
  
  if (body.features) updateData.features = JSON.stringify(body.features);

  const updated = await prisma.course.update({
    where: { id: Number(params.id) },
    data: updateData
  });
  return NextResponse.json(updated);
}

// DELETE: (No changes needed, ID is unique globally)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.course.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}

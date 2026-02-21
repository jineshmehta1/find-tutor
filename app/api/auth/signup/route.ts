import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Validation schemas
const baseUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    dob: z.string().transform((str) => new Date(str)),
    address: z.string().min(5, "Address is required"),
    profilePhoto: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

const teacherSchema = baseUserSchema.extend({
    role: z.literal("TEACHER"),
    certifications: z.array(z.object({
        text: z.string().min(1, "Certification name is required"),
        image: z.string().optional(),
    })).min(1, "At least one certification required"),
    education: z.string().min(2, "Education is required"),
    experience: z.string().min(2, "Experience is required"),
    subjects: z.array(z.string()).min(1, "At least one subject required"),
});

const studentSchema = baseUserSchema.extend({
    role: z.literal("STUDENT"),
    subjects: z.array(z.string()).min(1, "At least one subject of interest required"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const role = body.role;

        // Validate based on role
        let validatedData;
        if (role === "TEACHER") {
            validatedData = teacherSchema.parse(body);
        } else if (role === "STUDENT") {
            validatedData = studentSchema.parse(body);
        } else {
            return NextResponse.json(
                { error: "Invalid role. Must be TEACHER or STUDENT" },
                { status: 400 }
            );
        }

        // Verify OTP
        const { otp } = body;
        if (!otp) {
            return NextResponse.json(
                { error: "OTP is required" },
                { status: 400 }
            );
        }

        const verificationRequest = await prisma.verificationRequest.findFirst({
            where: {
                identifier: validatedData.email,
                token: otp,
            },
        });

        if (!verificationRequest) {
            return NextResponse.json(
                { error: "Invalid OTP" },
                { status: 400 }
            );
        }

        if (verificationRequest.expires < new Date()) {
            return NextResponse.json(
                { error: "OTP has expired. Please request a new one." },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Delete used OTP
        await prisma.verificationRequest.delete({
            where: { id: verificationRequest.id },
        });

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 12);

        // Create user with role-specific data
        if (role === "TEACHER") {
            const teacherData = validatedData as z.infer<typeof teacherSchema>;
            const user = await prisma.user.create({
                data: {
                    name: teacherData.name,
                    email: teacherData.email,
                    phone: teacherData.phone,
                    password: hashedPassword,
                    dob: teacherData.dob,
                    address: teacherData.address,
                    profilePhoto: teacherData.profilePhoto,
                    latitude: teacherData.latitude,
                    longitude: teacherData.longitude,
                    role: "TEACHER",
                    teacher: {
                        create: {
                            certifications: JSON.stringify(teacherData.certifications),
                            education: teacherData.education,
                            experience: teacherData.experience,
                            subjects: JSON.stringify(teacherData.subjects),
                            isApproved: false,
                        },
                    },
                },
                include: {
                    teacher: true,
                },
            });

            return NextResponse.json({
                message: "Teacher registration successful. Awaiting admin approval.",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isApproved: false,
                },
            });
        } else {
            const studentData = validatedData as z.infer<typeof studentSchema>;
            const user = await prisma.user.create({
                data: {
                    name: studentData.name,
                    email: studentData.email,
                    phone: studentData.phone,
                    password: hashedPassword,
                    dob: studentData.dob,
                    address: studentData.address,
                    profilePhoto: studentData.profilePhoto,
                    latitude: studentData.latitude,
                    longitude: studentData.longitude,
                    role: "STUDENT",
                    student: {
                        create: {
                            subjects: JSON.stringify(studentData.subjects),
                        },
                    },
                },
                include: {
                    student: true,
                },
            });

            return NextResponse.json({
                message: "Student registration successful!",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }
    } catch (error) {
        console.error("Signup error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Registration failed. Please try again." },
            { status: 500 }
        );
    }
}

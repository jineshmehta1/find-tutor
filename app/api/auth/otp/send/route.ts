import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sgMail from "@sendgrid/mail";
import { z } from "zod";

// Initialize SendGrid with API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const schema = z.object({
    email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
    let email = "";
    let otp = "";

    try {
        const body = await request.json();
        const parsed = schema.parse(body);
        email = parsed.email;

        // check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email is already registered. Please login instead." },
                { status: 400 }
            );
        }

        // Generate 6-digit OTP
        otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Upsert verification request
        await prisma.verificationRequest.upsert({
            where: {
                identifier_token: {
                    identifier: email,
                    token: otp
                }
            },
            update: {
                token: otp,
                expires,
            },
            create: {
                identifier: email,
                token: otp,
                expires,
            },
        });

        // Better approach: Delete any existing OTPs for this email to avoid clutter and unique constraint issues if we generate same token (rare but possible)
        // However, the unique constraint is on [identifier, token]. 
        // Let's just create a new record and let old ones exist (or clean up).
        // Actually, to make it simple and robust:
        await prisma.verificationRequest.deleteMany({
            where: { identifier: email }
        });

        await prisma.verificationRequest.create({
            data: {
                identifier: email,
                token: otp,
                expires
            }
        });

        // Send Email
        const msg = {
            to: email,
            from: process.env.EMAIL_FROM || "onboarding@chesswiz.com", // Ensure this email is verified in SendGrid
            subject: "Your Aacharya Verification Code",
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #f59e0b;">Verification Code</h1>
          <p>Please use the following code to verify your email address:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a5f5f; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
        };

        if (process.env.SENDGRID_API_KEY) {
            await sgMail.send(msg);
        } else {
            console.log("SENDGRID_API_KEY not set. OTP:", otp);
            // For development/testing without key
            return NextResponse.json({
                message: "OTP generated (Dev Mode: Check console)",
                devOtp: otp
            });
        }

        return NextResponse.json({ message: "OTP sent successfully" });

    } catch (error: any) {
        console.error("OTP Error:", error);

        // Fallback for Dev/Credits Exceeded
        if (error.response) {
            const errorBody = error.response.body;
            console.error("SendGrid Error Body:", JSON.stringify(errorBody, null, 2));

            // Check for specific SendGrid errors (credits exceeded, unauthorized)
            const isCreditsExceeded = errorBody.errors?.some((e: any) =>
                e.message?.includes("Maximum credits exceeded") ||
                e.message?.includes("Unauthorized")
            );

            if ((isCreditsExceeded || process.env.NODE_ENV === "development") && email && otp) {
                console.warn("⚠️ SendGrid Error (likely credits/auth). FALLBACK: Logging OTP to console.");
                console.log("==========================================");
                console.log(`DEV MODE OTP for ${email}: ${otp}`);
                console.log("==========================================");

                return NextResponse.json({
                    message: "OTP sent (Dev Mode: Check server console for code)",
                    devMode: true
                });
            }
        }

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to send OTP. Please try again." },
            { status: 500 }
        );
    }
}

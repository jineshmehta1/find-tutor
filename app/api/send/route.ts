// import { Resend } from 'resend';
// import { NextResponse } from 'next/server';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(req: Request) {
//   try {
//     const { parentName, studentName, email, phone, queryType, message } = await req.json();

//     const data = await resend.emails.send({
//       from: 'Aacharya Website <onboarding@resend.dev>', // Update this to your verified domain once ready
//       to: ['aacharyateam@gmail.com'],
//       subject: `New Enquiry: ${queryType} - ${studentName}`,
//       replyTo: email,
//       html: `
//         <div style="font-family: sans-serif; padding: 20px; color: #333;">
//           <h2 style="color: #f59e0b;">New Admission Enquiry</h2>
//           <p><strong>Query Type:</strong> ${queryType}</p>
//           <hr />
//           <p><strong>Parent Name:</strong> ${parentName}</p>
//           <p><strong>Student Name:</strong> ${studentName}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Phone:</strong> ${phone}</p>
//           <p><strong>Message:</strong></p>
//           <p style="background: #f1f5f9; padding: 15px; border-radius: 8px;">${message || "No message provided."}</p>
//         </div>
//       `,
//     });

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
//   }
// }

import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extract all possible fields from both forms
    const {
      parentName,
      studentName,
      email,
      phone,
      queryType,  // Contact Form field
      message,    // Contact Form field
      course,     // Book Demo field
      experience, // Book Demo field
      age,        // Book Demo field
      captchaToken // reCAPTCHA token
    } = body;

    // Server-side reCAPTCHA verification
    if (captchaToken) {
      const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
      const verifyResponse = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      });
      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 400 });
      }
    }

    // Determine if this is a Demo Booking or a General Enquiry
    // We check for 'course' because it's unique to the Demo form
    const isDemoBooking = !!course;

    const subject = isDemoBooking
      ? `New Demo Booking: ${course} - ${studentName}`
      : `New Enquiry: ${queryType || 'General'} - ${studentName}`;

    const htmlContent = isDemoBooking
      ? `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1a5f5f;">New Demo Session Request</h2>
          <p><strong>Interested Course:</strong> <span style="color: #1a5f5f; font-weight: bold;">${course}</span></p>
          <p><strong>Experience Level:</strong> ${experience}</p>
          <p><strong>Student Age:</strong> ${age}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Student Name:</strong> ${studentName}</p>
          <p><strong>Parent Name:</strong> ${parentName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        </div>
      `
      : `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f59e0b;">New Admission Enquiry</h2>
          <p><strong>Query Type:</strong> ${queryType}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Parent Name:</strong> ${parentName}</p>
          <p><strong>Student Name:</strong> ${studentName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f1f5f9; padding: 15px; border-radius: 8px; line-height: 1.5;">${message || "No message provided."}</p>
        </div>
      `;

    const data = await resend.emails.send({
      from: 'Aacharya Website <onboarding@resend.dev>',
      to: ['aacharyateam@gmail.com'],
      subject: subject,
      replyTo: email,
      html: htmlContent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { parentName, studentName, email, phone, queryType, message } = await req.json();

    const data = await resend.emails.send({
      from: 'Aacharya Website <onboarding@resend.dev>', // Update this to your verified domain once ready
      to: ['aacharyateam@gmail.com'],
      subject: `New Enquiry: ${queryType} - ${studentName}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #f59e0b;">New Admission Enquiry</h2>
          <p><strong>Query Type:</strong> ${queryType}</p>
          <hr />
          <p><strong>Parent Name:</strong> ${parentName}</p>
          <p><strong>Student Name:</strong> ${studentName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f1f5f9; padding: 15px; border-radius: 8px;">${message || "No message provided."}</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
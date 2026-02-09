import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { amount, eventName, eventId } = body

        if (!amount || !eventName) {
            return NextResponse.json(
                { error: "Amount and event name are required" },
                { status: 400 }
            )
        }

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `event_${eventId}_${Date.now()}`,
            notes: {
                eventName,
                eventId: String(eventId),
            },
        }

        const order = await razorpay.orders.create(options)

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        })
    } catch (error) {
        console.error("Razorpay order creation error:", error)
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        )
    }
}

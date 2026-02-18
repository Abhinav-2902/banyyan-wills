"use server";

import { auth } from "@/auth";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function createWillPaymentOrder(willId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    // verify ownership
    const will = await prisma.will.findUnique({
        where: { id: willId, userId: session.user.id }
    });

    if (!will) {
        return { success: false, error: "Will not found" };
    }

    if (will.isPaid) {
        return { success: false, error: "Will is already paid for" };
    }

    const options = {
        amount: 5000, // amount in the smallest currency unit (paise) -> 50 INR
        currency: "INR",
        receipt: `will_order_${willId}`,
    };

    const order = await razorpay.orders.create(options);

    return { 
        success: true, 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
    };

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return { success: false, error: "Failed to create payment order" };
  }
}

export async function verifyWillPayment(
    willId: string, 
    razorpayOrderId: string, 
    razorpayPaymentId: string, 
    razorpaySignature: string
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const body = razorpayOrderId + "|" + razorpayPaymentId;
        
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpaySignature) {
            // Payment is verified
            await prisma.will.update({
                where: { id: willId },
                data: {
                    isPaid: true,
                    status: "PAID",
                    paymentId: razorpayPaymentId,
                }
            });
            
            revalidatePath("/dashboard");
            return { success: true };
        } else {
            return { success: false, error: "Invalid signature" };
        }

    } catch (error) {
        console.error("Error verifying payment:", error);
        return { success: false, error: "Payment verification failed" };
    }
}

/**
 * Server Action to check if a will is paid
 * @param willId - The Will ID
 * @returns ActionResponse with payment status
 */
export async function getWillPaymentStatus(willId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const will = await prisma.will.findUnique({
      where: { id: willId, userId: session.user.id },
      select: { 
        isPaid: true, 
        status: true,
        user: { select: { subscriptionTier: true } }
      },
    });

    if (!will) {
      return { success: false, error: "Will not found" };
    }

    // Check if user is premium
    const isPremium = will.user.subscriptionTier === "PREMIUM";

    // Consider PAID if premium, or if explicitly paid/completed
    const isPaid = isPremium || will.isPaid || will.status === "PAID" || will.status === "COMPLETED";

    return {
      success: true,
      data: { isPaid },
    };
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return { success: false, error: "Failed to fetch status" };
  }
}

export async function createSubscriptionOrder() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { subscriptionTier: true }
    });

    if (user?.subscriptionTier === "PREMIUM") {
        return { success: false, error: "User is already a Premium member" };
    }

    const options = {
        amount: 30000, // 300 INR in paise
        currency: "INR",
        receipt: `sub_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return { 
        success: true, 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
    };

  } catch (error) {
    console.error("Error creating subscription order:", error);
    return { success: false, error: "Failed to create subscription order" };
  }
}

export async function verifySubscriptionPayment(
    razorpayOrderId: string, 
    razorpayPaymentId: string, 
    razorpaySignature: string
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const body = razorpayOrderId + "|" + razorpayPaymentId;
        
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpaySignature) {
            // Payment is verified
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    subscriptionTier: "PREMIUM"
                }
            });
            
            revalidatePath("/dashboard");
            return { success: true };
        } else {
            return { success: false, error: "Invalid signature" };
        }

    } catch (error) {
        console.error("Error verifying subscription payment:", error);
        return { success: false, error: "Payment verification failed" };
    }
}

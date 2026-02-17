"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createWillPaymentOrder, verifyWillPayment } from "@/server/actions/payment"; // You need to create this action file
import { Loader2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RazorpayBtnProps {
  willId: string;
  onSuccess?: () => void;
}

import { RazorpayOptions, RazorpayOrderResponse, RazorpayErrorResponse } from "@/types/razorpay";

// Window interface is augmented in razorpay.d.ts, but we might need to verify if it's picked up. 
// If not, we can re-declare locally or import.
// For now, let's remove the local declaration and see.


export function RazorpayBtn({ willId, onSuccess }: RazorpayBtnProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast({
          title: "Error",
          description: "Razorpay SDK failed to load. Are you online?",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 1. Create Order
      const data = await createWillPaymentOrder(willId); 

      if (!data || !data.success || !data.orderId) {
        toast({
           title: "Error", 
           description: data?.error || "Failed to create order",
           variant: "destructive"
        });
        setLoading(false);
        return; 
      }

      // 2. Open Razorpay Checkout
      const options: RazorpayOptions = {
        key: data.key || "", // Ensure string
        amount: Number(data.amount),
        currency: data.currency,
        name: "Banyyan Wills",
        description: "Will Finalization & PDF Generation",
        order_id: data.orderId,
        handler: async function (response: RazorpayOrderResponse) {
             // 3. Verify Payment
             const verifyRes = await verifyWillPayment(
                 willId,
                 response.razorpay_order_id,
                 response.razorpay_payment_id,
                 response.razorpay_signature
             );

             if (verifyRes.success) {
                 toast({
                     title: "Payment Successful",
                     description: "Your Will is now finalized and ready for download.",
                 });
                 if (onSuccess) onSuccess();
             } else {
                 toast({
                     title: "Payment Verification Failed",
                     description: verifyRes.error || "Please contact support.",
                     variant: "destructive"
                 });
             }
        },
        prefill: {
          name: "User Name", // Ideally get from session or props
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#FF6B6B", // Valid hex color
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      // Handle closure if user cancels? 
      paymentObject.on('payment.failed', function (response: RazorpayErrorResponse){
          toast({
              title: "Payment Failed",
              description: response.error.description,
              variant: "destructive"
          });
          setLoading(false);
      });

    } catch (error) {
      console.error("Payment Error:", error);
      toast({
          title: "Error processing payment",
          description: "Something went wrong.",
          variant: "destructive"
      });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white"
    >
      {loading ? (
        <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
        </>
      ) : (
        <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay ₹50 & Download
        </>
      )}
    </Button>
  );
}

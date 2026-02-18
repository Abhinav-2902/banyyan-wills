"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createSubscriptionOrder, verifySubscriptionPayment } from "@/server/actions/payment";
import { Loader2, Crown, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RazorpayOptions, RazorpayOrderResponse, RazorpayErrorResponse } from "@/types/razorpay";
import { useRouter } from "next/navigation";

export function PremiumMembershipCard() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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

      // 1. Create Subscription Order
      const data = await createSubscriptionOrder();

      if (!data || !data.success || !data.orderId) {
        toast({
           title: "Error", 
           description: data?.error || "Failed to create subscription order",
           variant: "destructive"
        });
        setLoading(false);
        return; 
      }

      // 2. Open Razorpay Checkout
      const options: RazorpayOptions = {
        key: data.key || "",
        amount: Number(data.amount),
        currency: data.currency,
        name: "Banyyan Wills Premium",
        description: "Premium Membership Upgrade",
        order_id: data.orderId,
        handler: async function (response: RazorpayOrderResponse) {
             // 3. Verify Payment
             const verifyRes = await verifySubscriptionPayment(
                 response.razorpay_order_id,
                 response.razorpay_payment_id,
                 response.razorpay_signature
             );

             if (verifyRes.success) {
                 toast({
                     title: "Welcome to Premium!",
                     description: "Your membership has been upgraded successfully.",
                 });
                 router.refresh(); // Refresh to update UI/Session
             } else {
                 toast({
                     title: "Verification Failed",
                     description: verifyRes.error || "Please contact support.",
                     variant: "destructive"
                 });
             }
        },
        prefill: {
          name: "Banyyan User",
          email: "user@banyyan.com", 
          contact: "",
        },
        theme: {
          color: "#F59E0B", // Amber color for Premium
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

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
    <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border border-amber-200 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-2xl opacity-50"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              PREMIUM MEMBERSHIP
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Unlock Full Potential with Premium
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl">
             Get exclusive access to advanced features designed to secure your legacy for generations. 
             One-time payment for lifetime peace of mind.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1 rounded-full">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Permanent Secure Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1 rounded-full">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Full Edit History</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1 rounded-full">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Unlimited PDF Downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1 rounded-full">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Edit Completed Wills</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 min-w-[200px]">
           <div className="text-center">
             <span className="text-3xl font-bold text-gray-900">₹300</span>
             <span className="text-sm text-gray-500 block">One-time payment</span>
           </div>
           <Button 
             onClick={handlePayment} 
             disabled={loading}
             className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-200 border-none h-12 rounded-xl"
           >
             {loading ? (
               <>
                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                 Processing...
               </>
             ) : (
               <>
                 <Sparkles className="mr-2 h-5 w-5" />
                 Upgrade Now
               </>
             )}
           </Button>
           <p className="text-xs text-center text-gray-500">Secure payment via Razorpay</p>
        </div>
      </div>
    </div>
  );
}

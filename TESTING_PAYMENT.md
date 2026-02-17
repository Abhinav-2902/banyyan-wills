# How to Test Razorpay Integration

Since we are in **Test Mode**, you don't need to spend real money. Follow these steps to verify the entire flow:

## 1. Prerequisites

Ensure your `.env` file has the Razorpay Test Keys.
If you don't have them, log in to [Razorpay Dashboard](https://dashboard.razorpay.com/) -> Settings -> API Keys -> Generate Test Key.

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

## 2. Create a Will

1. Go to the Dashboard.
2. Click "Create New Will".
3. Fill in some dummy data (or leave it empty if allowed).
4. Save the Will. It should appear in your Dashboard with status **DRAFT**.

## 3. Verify Payment Button

1. Look at the Will Card on the Dashboard.
2. You should see a **"Pay ₹50 & Download"** button.
3. The "Download" icon should NOT be visible yet.

## 4. Make a Test Payment

1. Click the "Pay ₹50 & Download" button.
2. The Razorpay Checkout modal should open.
3. Choose **Netbanking** -> **Test Bank**.
4. Or use a **Test Card**:
   - **Card Number**: `4111 1111 1111 1111`
   - **Expiry**: Any future date (e.g., `12/30`)
   - **CVV**: `123`
   - **OTP**: `123456`
5. Complete the payment.

## 5. Verify Success

1. You should see a toast notification: "Payment Successful".
2. The page should reload (or the button should update immediately).
3. The button should now change to a **Download Icon** (Paper/Arrow).
4. Clicking it should trigger the PDF download.
5. In your Database (if you check `prisma studio`), the Will's status should be `PAID` and `paymentId` should be populated.

## 6. Verify Failure (Optional)

1. Try to pay again on a new Will.
2. When the modal opens, close it (X button).
3. Verify that the "Payment Failed" toast appears and the Will remains in **DRAFT** status.

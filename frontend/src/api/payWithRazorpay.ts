import axios from "axios";

 const API = import.meta.env.VITE_API_BASE_URL + "/payment" || "http://localhost:5000/api/payments";
// const API = "http://localhost:5000/api/payments";

type CartItem = {
  ticketType: string;
  quantity: number;
};

type PayOptions = {
  eventId: string;
  items: CartItem[];
  token: string;
  userName?: string;
  userEmail?: string;
  eventTitle?: string;
};

type PayResult = {
  message: string;
  tickets: unknown[];
};

export async function payWithRazorpay({
  eventId,
  items,
  token,
  userName,
  userEmail,
  eventTitle,
}: PayOptions): Promise<PayResult> {
  const headers = { Authorization: `Bearer ${token}` };

  const orderRes = await axios.post(
    `${API}/create-order`,
    { eventId, items },
    { headers }
  );

  // Free event — tickets already created
  if (orderRes.data.free) {
    return {
      message: orderRes.data.message,
      tickets: orderRes.data.tickets,
    };
  }

  const { orderId, amount, keyId, eventTitle: title } = orderRes.data;

  if (!window.Razorpay) {
    throw new Error("Razorpay failed to load. Refresh the page and try again.");
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: keyId,
      amount,
      currency: "INR",
      name: "MeetSphere",
      description: title || eventTitle || "Event tickets",
      order_id: orderId,
      prefill: {
        name: userName || "",
        email: userEmail || "",
      },
      theme: { color: "#8b5cf6" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const verifyRes = await axios.post(
            `${API}/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers }
          );

          resolve({
            message: verifyRes.data.message,
            tickets: verifyRes.data.tickets,
          });
        } catch (err: unknown) {
          const msg =
            axios.isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : "Payment verification failed";
          reject(new Error(msg));
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });

    rzp.open();
  });
}

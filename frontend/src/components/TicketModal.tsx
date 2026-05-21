import { useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEvents } from "../store/slices/eventSlice";
import { fetchTickets } from "../store/slices/ticketSlice";
import { payWithRazorpay } from "../api/payWithRazorpay";

type TicketModalProps = {
  open: boolean;
  onClose: () => void;
  event: any;
};

export default function TicketModal({
  open,
  onClose,
  event,
}: TicketModalProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const [qty, setQty] = useState<Record<string, number>>({});
  const [paying, setPaying] = useState(false);

  const changeQty = (id: string, type: "inc" | "dec") => {
    setQty((prev) => ({
      ...prev,
      [id]:
        type === "inc"
          ? (prev[id] || 0) + 1
          : Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const total = useMemo(() => {
    if (!event?.tickets) return 0;

    return event.tickets.reduce((sum: number, ticket: any) => {
      const id = ticket._id || ticket.id;
      return sum + ticket.price * (qty[id] || 0);
    }, 0);
  }, [qty, event]);

  const isDisabled = Object.values(qty).every((n) => n === 0);

  const completePurchase = async () => {
    if (!event?._id || !user?._id || !token) {
      alert("Please log in to buy tickets");
      return;
    }

    const items = event.tickets
      .filter((ticket: any) => (qty[ticket._id || ticket.id] || 0) > 0)
      .map((ticket: any) => ({
        ticketType: ticket.name,
        quantity: qty[ticket._id || ticket.id],
      }));

    setPaying(true);

    try {
      const result = await payWithRazorpay({
        eventId: event._id,
        items,
        token,
        userName: user.name,
        userEmail: user.email,
        eventTitle: event.title,
      });

      await dispatch(fetchEvents());
      await dispatch(fetchTickets(user._id));

      alert(result.message);
      setQty({});
      onClose();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Payment failed";
      alert(message);
    } finally {
      setPaying(false);
    }
  };

  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[var(--bg2)] p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{event.title}</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[var(--bg3)] text-gray-400 transition-all hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-8 h-52 overflow-hidden rounded-2xl">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-5">
          {event.tickets.map((ticket: any) => {
            const id = ticket._id || ticket.id;
            const remaining = ticket.capacity - (ticket.sold || 0);
            const soldOut = remaining <= 0;

            return (
              <div
                key={id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[var(--bg3)] p-5"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {ticket.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">{remaining} left</p>
                  {ticket.description && (
                    <p className="mt-2 text-sm text-gray-500">
                      {ticket.description}
                    </p>
                  )}
                  {soldOut && (
                    <p className="mt-1 text-sm text-red-400">Sold out</p>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--accent)]">
                    {ticket.price === 0 ? "Free" : `₹${ticket.price}`}
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-3">
                    <button
                      onClick={() => changeQty(id, "dec")}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg4)] text-white"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-semibold text-white">
                      {qty[id] || 0}
                    </span>
                    <button
                      disabled={soldOut || (qty[id] || 0) >= remaining}
                      onClick={() => changeQty(id, "inc")}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${
                        soldOut
                          ? "cursor-not-allowed bg-gray-600"
                          : "bg-[var(--accent)]"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="my-6 border-t border-white/10" />

        <div className="mb-6 flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-[var(--accent)]">₹{total.toFixed(2)}</span>
        </div>

        <button
          onClick={completePurchase}
          disabled={isDisabled || paying || !user?._id}
          className={`flex w-full items-center justify-center rounded-xl py-4 text-lg font-semibold text-white ${
            isDisabled || paying || !user?._id
              ? "cursor-not-allowed bg-gray-600"
              : "bg-[var(--accent)] hover:opacity-90"
          }`}
        >
          {paying
            ? "Opening payment..."
            : total === 0
              ? "Book free tickets"
              : `Pay ₹${total} with Razorpay`}
        </button>
      </div>
    </div>
  );
}

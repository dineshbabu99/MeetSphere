import { useMemo, useState } from "react";

type TicketModalProps = {
  open: boolean;
  onClose: () => void;
  eventName: string;
};

const ticketTypes = [
  {
    id: "ga",
    name: "General Admission",
    desc: "Full day access",
    price: 149,
    color: "bg-[var(--accent)]",
  },
  {
    id: "vip",
    name: "VIP All-Access",
    desc: "Exclusive perks + front row",
    price: 349,
    color: "bg-yellow-400",
  },
];

export default function TicketModal({
  open,
  onClose,
  eventName,
}: TicketModalProps) {
  const [qty, setQty] = useState({
    ga: 0,
    vip: 0,
  });

  const changeQty = (
    id: string,
    type: "inc" | "dec"
  ) => {
    setQty((prev) => ({
      ...prev,
      [id]:
        type === "inc"
          ? prev[id as keyof typeof prev] + 1
          : Math.max(prev[id as keyof typeof prev] - 1, 0),
    }));
  };

  const subtotal = useMemo(() => {
    return (
      qty.ga * 149 +
      qty.vip * 349
    );
  }, [qty]);

  const total = useMemo(() => {
    return subtotal + subtotal * 0.05;
  }, [subtotal]);

  const completePurchase = () => {
    alert(
      "🎉 Purchase confirmed! Check your email for tickets."
    );

    setQty({
      ga: 0,
      vip: 0,
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      
      {/* Modal */}
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[var(--bg2)] p-8">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          
          <h2 className="text-2xl font-bold text-white">
            {eventName}
          </h2>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[var(--bg3)] text-gray-400 transition-all hover:border-white/20 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Hero */}
        <div className="mb-8 flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-900 to-indigo-700 text-6xl">
          💻
        </div>

        {/* Tickets */}
        <div className="space-y-5">
          
          {ticketTypes.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-[var(--bg3)] p-5"
            >
              {/* Left */}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {ticket.name}
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  {ticket.desc}
                </p>
              </div>

              {/* Right */}
              <div className="text-right">
                
                <div
                  className={`text-2xl font-bold ${
                    ticket.id === "vip"
                      ? "text-yellow-400"
                      : "text-[var(--accent)]"
                  }`}
                >
                  ${ticket.price}
                </div>

                {/* Qty */}
                <div className="mt-3 flex items-center justify-end gap-3">
                  
                  <button
                    onClick={() =>
                      changeQty(ticket.id, "dec")
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg4)] text-white transition-all hover:bg-white/10"
                  >
                    −
                  </button>

                  <span className="w-5 text-center font-semibold text-white">
                    {
                      qty[
                        ticket.id as keyof typeof qty
                      ]
                    }
                  </span>

                  <button
                    onClick={() =>
                      changeQty(ticket.id, "inc")
                    }
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-white transition-all hover:opacity-90 ${ticket.color}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-white/10"></div>

        {/* Total */}
        <div className="mb-6 flex items-center justify-between text-lg font-semibold">
          
          <span>Total</span>

          <span className="text-[var(--accent)]">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Button */}
        <button
          onClick={completePurchase}
          disabled={subtotal === 0}
          className={`flex w-full items-center justify-center rounded-xl py-4 text-lg font-semibold text-white transition-all ${
            subtotal === 0
              ? "cursor-not-allowed bg-gray-600"
              : "bg-[var(--accent)] hover:opacity-90"
          }`}
        >
          🔒 Proceed to Payment
        </button>
      </div>
    </div>
  );
}
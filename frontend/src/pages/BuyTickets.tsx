import { useMemo, useState } from "react";

const ticketTypes = [
  {
    id: "ga",
    name: "General Admission",
    desc: "Full day access · 180 left",
    price: 149,
    color: "bg-[var(--accent)]",
    progress: "40%",
  },
  {
    id: "vip",
    name: "VIP All-Access",
    desc: "VIP lounge + workshops · 12 left",
    price: 349,
    color: "bg-yellow-400",
    progress: "76%",
  },
];

export default function BuyTickets() {
  const [qty, setQty] = useState({
    ga: 0,
    vip: 0,
  });

  const changeQty = (id: string, type: "inc" | "dec") => {
    setQty((prev) => ({
      ...prev,
      [id]:
        type === "inc"
          ? prev[id as keyof typeof prev] + 1
          : Math.max(prev[id as keyof typeof prev] - 1, 0),
    }));
  };

  const summary = useMemo(() => {
    return ticketTypes
      .map((ticket) => ({
        ...ticket,
        quantity: qty[ticket.id as keyof typeof qty],
        total:
          qty[ticket.id as keyof typeof qty] * ticket.price,
      }))
      .filter((ticket) => ticket.quantity > 0);
  }, [qty]);

  const totalPrice = useMemo(() => {
    return summary.reduce(
      (acc, item) => acc + item.total,
      0
    );
  }, [summary]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Buy Tickets
        </h1>

        <p className="mt-2 text-gray-400">
          Secure your spot at the best events
        </p>
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* LEFT */}
        <div className="space-y-6">

          {/* Event Card */}
          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
            
            <div className="mb-5 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-900 to-indigo-700 text-6xl">
              💻
            </div>

            <h2 className="text-2xl font-bold text-white">
              TechSummit 2025
            </h2>

            <p className="mt-3 text-sm text-gray-400">
              📍 Moscone Center, San Francisco · 📅 Jan 15, 2025 · ⏰ 9:00 AM
            </p>
          </div>

          {/* Tickets */}
          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
            
            <h2 className="mb-5 text-2xl font-bold text-white">
              Select Tickets
            </h2>

            <div className="space-y-5">

              {ticketTypes.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[var(--bg3)] p-5"
                >
                  {/* LEFT */}
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {ticket.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      {ticket.desc}
                    </p>

                    {/* Progress */}
                    <div className="mt-3 h-2 w-32 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${ticket.color}`}
                        style={{
                          width: ticket.progress,
                        }}
                      />
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">
                    
                    <div className="text-2xl font-bold text-white">
                      ${ticket.price}
                    </div>

                    {/* Quantity */}
                    <div className="mt-3 flex items-center justify-end gap-3">

                      <button
                        onClick={() =>
                          changeQty(ticket.id, "dec")
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg4)] text-white transition-all hover:bg-white/10"
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
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-white transition-all hover:opacity-90 ${ticket.color}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* Summary */}
          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
            
            <h2 className="mb-5 text-2xl font-bold text-white">
              Order Summary
            </h2>

            {summary.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-400">
                Select tickets to continue
              </div>
            ) : (
              <div className="space-y-4">
                {summary.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-[var(--bg3)] p-4"
                  >
                    <div>
                      <h3 className="font-semibold text-white">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        {item.quantity} × ${item.price}
                      </p>
                    </div>

                    <div className="text-lg font-bold text-[var(--accent)]">
                      ${item.total}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="my-5 border-t border-white/10"></div>

            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>

              <span className="text-[var(--accent)]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
            
            <h2 className="mb-5 text-2xl font-bold text-white">
              Payment Details
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
              />

              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
              />

              <div className="grid grid-cols-2 gap-4">
                
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                />

                <input
                  type="password"
                  placeholder="CVV"
                  className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                />
              </div>
           <div>
                <label className="mb-3 block text-sm text-gray-300">
                  Payment Method
                </label>

                <div className="grid grid-cols-3 gap-3">
                  
                  <button className="rounded-xl border-2 border-[var(--accent)] bg-[var(--bg3)] py-3 text-sm text-white">
                    💳 Card
                  </button>

                  <button className="rounded-xl border border-white/10 bg-[var(--bg3)] py-3 text-sm text-gray-300 transition-all hover:bg-white/5">
                    🍎 Pay
                  </button>

                  <button className="rounded-xl border border-white/10 bg-[var(--bg3)] py-3 text-sm text-gray-300 transition-all hover:bg-white/5">
                    🅿️ PayPal
                  </button>
                </div>
              </div>
              <button
                disabled={totalPrice === 0}
                className={`w-full rounded-xl py-4 text-lg font-semibold text-white transition-all ${
                  totalPrice === 0
                    ? "cursor-not-allowed bg-gray-600"
                    : "bg-[var(--accent)] hover:opacity-90"
                }`}
              >
                🔒 Complete Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
     
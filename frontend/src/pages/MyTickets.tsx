const tickets = [
  {
    id: 1,
    title: "TechSummit 2025",
    location: "San Francisco",
    date: "Jan 15, 2025 · 9:00 AM",
    ticket: "Ticket #TS-8472",
    type: "General Admission",
    emoji: "💻",
    gradient: "from-violet-900 to-indigo-700",
    status: "Confirmed",
    statusColor:
      "bg-green-500/20 text-green-400",
    progressColor:
      "bg-[var(--accent)]",
    opacity: "",
  },
  {
    id: 2,
    title: "Neon Music Festival",
    location: "Austin, TX",
    date: "Jan 22, 2025 · 6:00 PM",
    ticket: "VIP Ticket #NMF-2391",
    type: "VIP Access",
    emoji: "🎵",
    gradient: "from-pink-900 to-rose-700",
    status: "Upcoming",
    statusColor:
      "bg-yellow-500/20 text-yellow-400",
    progressColor: "bg-rose-500",
    opacity: "",
  },
  {
    id: 3,
    title: "Digital Art Expo 2024",
    location: "Chicago, IL",
    date: "Dec 5, 2024 · 10:00 AM",
    ticket: "Ticket #DAE-1104",
    type: "General Admission",
    emoji: "🎨",
    gradient: "from-zinc-800 to-zinc-700",
    status: "Past Event",
    statusColor:
      "bg-red-500/20 text-red-400",
    progressColor: "bg-zinc-500",
    opacity: "opacity-60",
  },
];

export default function MyTickets() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          My Tickets
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your event registrations and tickets
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-3">

        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg2)] transition-all hover:-translate-y-1 hover:border-[var(--accent)] ${ticket.opacity}`}
          >
            {/* Top */}
            <div
              className={`relative flex h-52 items-center justify-center bg-gradient-to-br ${ticket.gradient}`}
            >
              <div className="text-7xl">
                {ticket.emoji}
              </div>

              <span className="absolute right-4 top-4 rounded-full bg-black/30 px-3 py-1 text-sm text-white backdrop-blur">
                {ticket.type}
              </span>
            </div>

            {/* Body */}
            <div className="p-5">
              
              <h2 className="text-2xl font-bold text-white">
                {ticket.title}
              </h2>

              <p className="mt-3 text-sm text-gray-400">
                📍 {ticket.location}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                📅 {ticket.date}
              </p>

              <p className="mt-3 text-sm font-medium text-[var(--accent)]">
                🎟️ {ticket.ticket}
              </p>

              {/* Progress */}
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full w-full ${ticket.progressColor}`}
                />
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between">
                
                {/* Status */}
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${ticket.statusColor}`}
                >
                  {ticket.status === "Confirmed" && "✓ "}
                  {ticket.status === "Upcoming" && "⏳ "}
                  {ticket.status === "Past Event" && "✗ "}
                  {ticket.status}
                </span>

                {/* Actions */}
                <div className="flex gap-2">

                  <button className="rounded-lg border border-white/10 bg-[var(--bg3)] px-3 py-2 text-sm text-gray-300 transition-all hover:bg-white/5">
                    📧 Email
                  </button>

                  {ticket.status === "Confirmed" && (
                    <button className="rounded-lg border border-white/10 bg-[var(--bg3)] px-3 py-2 text-sm text-gray-300 transition-all hover:bg-white/5">
                      Transfer
                    </button>
                  )}

                  {ticket.status === "Upcoming" && (
                    <button className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400 transition-all hover:bg-red-500/30">
                      Cancel
                    </button>
                  )}

                  {ticket.status === "Past Event" && (
                    <button className="rounded-lg border border-white/10 bg-[var(--bg3)] px-3 py-2 text-sm text-gray-300 transition-all hover:bg-white/5">
                      ⭐ Rate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
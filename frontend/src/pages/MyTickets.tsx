
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { cancelTicket, fetchTickets } from "../store/slices/ticketSlice";
import { fetchEvents } from "../store/slices/eventSlice";


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

void tickets;

const  user = {
  userInfo: JSON.parse(
    localStorage.getItem("user") ||
      "[]"
  ),
};



export default function MyTickets() {
    const dispatch =
      useAppDispatch();


useEffect(() => {

  dispatch(
    fetchTickets(user?.userInfo._id)
  );

  dispatch(
    fetchEvents()
  );

}, [dispatch]);
    
  const tickets = useAppSelector(
    (state) => state.tickets.tickets
  );
  
  const events = useAppSelector(
  (state) => state.events.events
);

const handleCancel =
  async (
    ticketId: string
  ) => {

    const confirmCancel =
      window.confirm(
        "Cancel this ticket?"
      );

    if (!confirmCancel)
      return;

    try {

      await dispatch(
        cancelTicket(
          ticketId
        )
      ).unwrap();

      await dispatch(
        fetchEvents()
      );

      alert(
        "Ticket cancelled successfully"
      );

    } catch (error: any) {

      alert(
        error.message
      );
    }
};
  

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

      {tickets.map((ticket) => {

        const event = events.find(
          (event: any) =>
            event._id === ticket.eventId
        );

const eventDate =
  event?.eventDateTime
    ? new Date(
        event.eventDateTime
      )
    : new Date();
const currentDate =
  new Date();

const isPast =
  eventDate < currentDate;

const isToday =
  eventDate.toDateString() ===
  currentDate.toDateString();

const status =
  isPast
    ? "Past Event"
    : isToday
    ? "Confirmed"
    : "Upcoming";

       
        return (
          <div
            key={ticket._id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg2)] transition-all hover:-translate-y-1 hover:border-[var(--accent)]"
          >

            {/* Top */}
            <div className="relative h-52 overflow-hidden">

              <img
               src={
  event?.image ||
  "https://placehold.co/600x400"
}
                alt={ticket.eventName}
                className="h-full w-full object-cover"
              />

              <span className="absolute right-4 top-4 rounded-full bg-black/30 px-3 py-1 text-sm text-white backdrop-blur">
                {ticket.ticketType}
              </span>
            </div>

            {/* Body */}
            <div className="p-5">

              <h2 className="text-2xl font-bold text-white">
                {ticket.eventName}
              </h2>

              <p className="mt-3 text-sm text-gray-400">
                📍 {event?.location}
              </p>

        <p className="mt-1 text-sm text-gray-400">
  📅{" "}
  {event?.eventDateTime
    ? new Date(
        event.eventDateTime
      ).toLocaleDateString(
        "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "No Date"}

  {" · "}

  ⏰{" "}
  {event?.eventDateTime
    ? new Date(
        event.eventDateTime
      ).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      )
    : "No Time"}
</p>
<p className="mt-3 text-sm font-medium text-[var(--accent)]">
  🎟️ {ticket.ticketId}
</p>

<p className="mt-1 text-sm text-gray-400">
  Quantity: {ticket.quantity}
</p>

              {/* Progress */}
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full w-full bg-[var(--accent)]`}
                />
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between">
                
                {/* Status */}
          <span
  className={`rounded-full px-3 py-1 text-sm font-medium ${
    status === "Confirmed"
      ? "bg-green-500/20 text-green-400"
      : status === "Upcoming"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-red-500/20 text-red-400"
  }`}
>
  {status === "Confirmed" && "✓ "}
  {status === "Upcoming" && "⏳ "}
  {status === "Past Event" && "✗ "}

  {status}
</span>

                {/* Actions */}
              <div className="flex gap-2">

  <button className="rounded-lg border border-white/10 bg-[var(--bg3)] px-3 py-2 text-sm text-gray-300 transition-all hover:bg-white/5">
    📧 Email
  </button>

  {status === "Confirmed" && (
    <button className="rounded-lg border border-white/10 bg-[var(--bg3)] px-3 py-2 text-sm text-gray-300 transition-all hover:bg-white/5">
      Transfer
    </button>
  )}

  {status === "Upcoming" && (
    <button onClick={()=>handleCancel(ticket._id!)} className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400 transition-all hover:bg-red-500/30">
      Cancel
    </button>
  )}

  {status === "Past Event" && (
    <button className="rounded-lg border border-white/10 bg-[var(--bg3)] px-3 py-2 text-sm text-gray-300 transition-all hover:bg-white/5">
      ⭐ Rate
    </button>
  )}

</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)
}

import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { cancelTicket, fetchTickets } from "../store/slices/ticketSlice";
import { fetchEvents } from "../store/slices/eventSlice";

export default function MyTickets() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const tickets = useAppSelector((state) => state.tickets.tickets);
  const events = useAppSelector((state) => state.events.events);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchTickets(user._id));
    }
    dispatch(fetchEvents());
  }, [dispatch, user?._id]);

  const handleCancel = async (ticketId: string) => {
    if (!window.confirm("Cancel this ticket?")) return;

    try {
      await dispatch(cancelTicket(ticketId)).unwrap();
      await dispatch(fetchEvents());
      alert("Ticket cancelled successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Cancel failed";
      alert(message);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">My Tickets</h1>
        <p className="mt-2 text-gray-400">
          Manage your event registrations and tickets
        </p>
      </div>

      {tickets.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--bg2)] p-10 text-center text-gray-400">
          <p>No tickets yet.</p>
          <Link to="/events" className="mt-3 inline-block text-violet-400">
            Browse events
          </Link>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {tickets.map((ticket) => {
          const event = events.find((e) => e._id === ticket.eventId);
          const eventDate = event?.eventDateTime
            ? new Date(event.eventDateTime)
            : new Date();
          const now = new Date();
          const isPast = eventDate < now;
          const isToday =
            eventDate.toDateString() === now.toDateString();
          const status = isPast
            ? "Past Event"
            : isToday
              ? "Confirmed"
              : "Upcoming";

          return (
            <div
              key={ticket._id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg2)] transition-all hover:-translate-y-1 hover:border-[var(--accent)]"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={event?.image || "https://placehold.co/600x400"}
                  alt={ticket.eventName}
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-4 top-4 rounded-full bg-black/30 px-3 py-1 text-sm text-white backdrop-blur">
                  {ticket.ticketType}
                </span>
              </div>

              <div className="p-5">
                <h2 className="text-2xl font-bold text-white">
                  {ticket.eventName}
                </h2>

                <p className="mt-3 text-sm text-gray-400">
                  📍 {event?.location || "TBA"}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  📅{" "}
                  {event?.eventDateTime
                    ? eventDate.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "No date"}
                  {" · "}⏰{" "}
                  {event?.eventDateTime
                    ? eventDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "No time"}
                </p>

                <p className="mt-3 text-sm font-medium text-[var(--accent)]">
                  🎟️ {ticket.ticketId}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Quantity: {ticket.quantity}
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-full bg-[var(--accent)]" />
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
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

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/my-schedule?eventId=${ticket.eventId}`}
                      className="rounded-lg border border-white/10 bg-[var(--bg3)] px-3 py-2 text-sm text-violet-300 transition-all hover:border-violet-500/40 hover:bg-violet-500/10"
                    >
                      🗓️ Schedule
                    </Link>

                    {status === "Upcoming" && (
                      <button
                        onClick={() => handleCancel(ticket._id!)}
                        className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400 hover:bg-red-500/30"
                      >
                        Cancel
                      </button>
                    )}

                    {status === "Past Event" && (
                      <button
                        type="button"
                        className="rounded-lg border border-white/10 bg-[var(--bg3)] px-3 py-2 text-sm text-gray-300"
                      >
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
  );
}

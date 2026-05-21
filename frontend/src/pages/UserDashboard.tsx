import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEvents } from "../store/slices/eventSlice";
import { fetchTickets } from "../store/slices/ticketSlice";
import {
  formatDate,
  formatRevenue,
  getUpcomingOpenEvents,
  getUserUpcomingTickets,
  ticketAmount,
} from "../lib/dashboardStats";

export default function UserDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { events, loading: eventsLoading } = useAppSelector(
    (state) => state.events
  );
  const { tickets, loading: ticketsLoading } = useAppSelector(
    (state) => state.tickets
  );

  useEffect(() => {
    dispatch(fetchEvents());
    if (user?._id) {
      dispatch(fetchTickets(user._id));
    }
  }, [dispatch, user?._id]);

  const totalSpent = useMemo(
    () => tickets.reduce((sum, t) => sum + ticketAmount(t), 0),
    [tickets]
  );

  const upcomingFromTickets = useMemo(
    () => getUserUpcomingTickets(tickets, events),
    [tickets, events]
  );

  const browseUpcoming = useMemo(
    () => getUpcomingOpenEvents(events, 4),
    [events]
  );

  const recentBookings = useMemo(
    () =>
      [...tickets]
        .sort(
          (a, b) =>
            new Date(b.purchaseDate).getTime() -
            new Date(a.purchaseDate).getTime()
        )
        .slice(0, 5),
    [tickets]
  );

  const loading = eventsLoading || ticketsLoading;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="mt-2 text-gray-400">
          Your upcoming events, tickets, and bookings at a glance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="total-card gold">
          <div className="total-icon">🎟️</div>
          <div className="total-label">My Tickets</div>
          <div
            className="total-value"
            style={{ color: "var(--gold)" }}
          >
            {loading ? "..." : tickets.length}
          </div>
          <div className="total-change up">
            {upcomingFromTickets.length} upcoming
          </div>
        </div>

        <div className="total-card rose">
          <div className="total-icon">💰</div>
          <div className="total-label">Total Spent</div>
          <div
            className="total-value"
            style={{ color: "var(--rose)" }}
          >
            {loading ? "..." : formatRevenue(totalSpent)}
          </div>
          <div className="total-change up">Across all bookings</div>
        </div>

        <div className="total-card purple">
          <div className="total-icon">🎭</div>
          <div className="total-label">Live Events</div>
          <div
            className="total-value"
            style={{ color: "var(--accent2)" }}
          >
            {loading
              ? "..."
              : events.filter((e) => e.status === "Open").length}
          </div>
          <div className="total-change up">Available to book</div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Link
          to="/events"
          className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5 transition hover:border-violet-500/40"
        >
          <p className="text-2xl">🎭</p>
          <p className="mt-2 font-semibold text-white">Browse Events</p>
          <p className="mt-1 text-sm text-gray-400">
            Discover and book new events
          </p>
        </Link>

        <Link
          to="/myTickets"
          className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5 transition hover:border-violet-500/40"
        >
          <p className="text-2xl">🪪</p>
          <p className="mt-2 font-semibold text-white">My Tickets</p>
          <p className="mt-1 text-sm text-gray-400">
            View, cancel, or manage bookings
          </p>
        </Link>

        <Link
          to="/buyTickets"
          className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5 transition hover:border-violet-500/40"
        >
          <p className="text-2xl">🛒</p>
          <p className="mt-2 font-semibold text-white">Buy Tickets</p>
          <p className="mt-1 text-sm text-gray-400">
            Quick checkout for live events
          </p>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">My Upcoming Events</div>
            <Link to="/myTickets" className="btn">
              View Tickets
            </Link>
          </div>

          {upcomingFromTickets.length === 0 && (
            <p className="px-4 pb-4 text-sm text-gray-400">
              No upcoming events in your tickets.{" "}
              <Link to="/events" className="text-violet-400 hover:underline">
                Browse events
              </Link>
            </p>
          )}

          {upcomingFromTickets.map(({ ticket, event }) => (
            <div key={ticket._id || ticket.ticketId} className="mini-event">
              <div
                className="mini-event-dot"
                style={{ background: "#06b6d426" }}
              >
                🎟️
              </div>
              <div className="mini-event-info">
                <div className="mini-event-title">
                  {ticket.eventName}
                </div>
                <div className="mini-event-meta">
                  {formatDate(event?.eventDateTime)} · {ticket.ticketType} ·
                  Qty {ticket.quantity}
                </div>
              </div>
              <span className="badge badge-gold">Booked</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Discover Events</div>
            <Link to="/events" className="btn">
              View All
            </Link>
          </div>

          {browseUpcoming.length === 0 && (
            <p className="px-4 pb-4 text-sm text-gray-400">
              No live upcoming events right now.
            </p>
          )}

          {browseUpcoming.map((event) => (
            <div key={event._id} className="mini-event">
              <div
                className="mini-event-dot"
                style={{ background: "#8b5cf626" }}
              >
                🎭
              </div>
              <div className="mini-event-info">
                <div className="mini-event-title">{event.title}</div>
                <div className="mini-event-meta">
                  {formatDate(event.eventDateTime)} ·{" "}
                  {event.location || "TBA"}
                </div>
              </div>
              <span className="badge badge-green">Live</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-8">
        <div className="card-header">
          <div className="card-title">Recent Bookings</div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Type</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.length === 0 && (
              <tr>
                <td colSpan={4} className="text-gray-400">
                  No bookings yet.
                </td>
              </tr>
            )}

            {recentBookings.map((ticket) => (
              <tr key={ticket._id || ticket.ticketId}>
                <td>{ticket.eventName}</td>
                <td>{ticket.ticketType}</td>
                <td>{formatDate(ticket.purchaseDate)}</td>
                <td style={{ color: "var(--emerald)" }}>
                  ₹{ticketAmount(ticket)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

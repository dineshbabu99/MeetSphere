import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEvents } from "../store/slices/eventSlice";
import { fetchUsers } from "../store/slices/authSlice";
import { formatDate } from "../lib/dashboardStats";

export default function AdminHomeDashboard() {
  const dispatch = useAppDispatch();
  const { events, loading: eventsLoading } = useAppSelector(
    (state) => state.events
  );
  const { users, loading: usersLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchUsers());
  }, [dispatch]);

  const pendingEvents = useMemo(
    () => events.filter((e) => e.status === "Pending"),
    [events]
  );

  const activeEvents = useMemo(
    () => events.filter((e) => e.status === "Open"),
    [events]
  );

  const ticketsSold = useMemo(
    () => events.reduce((sum, e) => sum + (e.sold || 0), 0),
    [events]
  );

  const loading = eventsLoading || usersLoading;

  const stats = [
    {
      title: "Pending Approvals",
      value: pendingEvents.length,
      sub: "Awaiting review",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      title: "Live Events",
      value: activeEvents.length,
      sub: "Published & open",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Registered Users",
      value: users.length,
      sub: "Platform accounts",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Tickets Sold",
      value: ticketsSold,
      sub: "Across all events",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-400">
          Platform overview and quick actions
        </p>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`rounded-2xl border border-white/10 p-6 ${stat.bg}`}
          >
            <p className="text-sm text-gray-400">{stat.title}</p>
            <h2 className={`mt-3 text-4xl font-bold ${stat.color}`}>
              {loading ? "..." : stat.value}
            </h2>
            <p className="mt-3 text-sm text-gray-300">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/admin"
          className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5 transition hover:border-violet-500/40"
        >
          <p className="text-2xl">⚙️</p>
          <p className="mt-2 font-semibold text-white">Admin Panel</p>
          <p className="mt-1 text-sm text-gray-400">
            Approvals, users, bookings
          </p>
        </Link>

        <Link
          to="/analytics"
          className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5 transition hover:border-violet-500/40"
        >
          <p className="text-2xl">📈</p>
          <p className="mt-2 font-semibold text-white">Analytics</p>
          <p className="mt-1 text-sm text-gray-400">
            Revenue, attendance, charts
          </p>
        </Link>

        <Link
          to="/create"
          className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5 transition hover:border-violet-500/40"
        >
          <p className="text-2xl">✨</p>
          <p className="mt-2 font-semibold text-white">Create Event</p>
          <p className="mt-1 text-sm text-gray-400">Add a new listing</p>
        </Link>

        <Link
          to="/attendees"
          className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5 transition hover:border-violet-500/40"
        >
          <p className="text-2xl">👥</p>
          <p className="mt-2 font-semibold text-white">Attendees</p>
          <p className="mt-1 text-sm text-gray-400">Manage check-ins</p>
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Pending Event Approvals
          </h2>
          <Link
            to="/admin"
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            Open Admin Panel →
          </Link>
        </div>

        {pendingEvents.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            No events waiting for approval.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="pb-4">Event</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingEvents.slice(0, 5).map((event) => (
                  <tr
                    key={event._id}
                    className="border-b border-white/5"
                  >
                    <td className="py-4 text-white">{event.title}</td>
                    <td className="py-4 text-gray-400">
                      {formatDate(event.eventDateTime)}
                    </td>
                    <td className="py-4 text-gray-400">
                      {event.category}
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

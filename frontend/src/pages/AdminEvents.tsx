import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  deleteEvent,
  fetchEvents,
  updateEventStatus,
} from "../store/slices/eventSlice";
import { formatDate } from "../data/dashboardStats";

export default function AdminEvents() {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state) => state.events);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter(
      (event) =>
        (!status || event.status === status) &&
        (!query ||
          event.title.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.organizer?.name?.toLowerCase().includes(query))
    );
  }, [events, search, status]);

  const publish = async (eventId: string) => {
    await dispatch(updateEventStatus({ eventId, status: "Open" }));
  };

  const remove = async (eventId: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await dispatch(deleteEvent(eventId));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Manage Events</h1>
        <p className="mt-2 text-gray-400">
          Administrative event actions without entering the public browse view.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search event, location, or organizer"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[var(--bg2)] px-4 py-3 text-white outline-none"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-white/10 bg-[var(--bg2)] px-4 py-3 text-white outline-none"
        >
          <option value="">All statuses</option>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Draft">Draft</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[var(--bg2)] p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left text-sm text-gray-400">
              <th className="pb-4">Event</th>
              <th className="pb-4">Organizer</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Sales</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event._id} className="border-b border-white/5">
                <td className="py-4">
                  <p className="font-semibold text-white">{event.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{event.location}</p>
                </td>
                <td className="py-4 text-sm text-gray-300">
                  {event.organizer?.name || "Unknown"}
                </td>
                <td className="py-4 text-sm text-gray-300">
                  {formatDate(event.eventDateTime)}
                </td>
                <td className="py-4 text-sm text-gray-300">
                  {event.sold || 0} / {event.capacity || 0}
                </td>
                <td className="py-4 text-sm text-gray-300">{event.status}</td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/events/${event._id}/edit`}
                      className="rounded-lg bg-violet-500/20 px-3 py-2 text-sm text-violet-300"
                    >
                      Edit
                    </Link>
                    {event.status !== "Open" && (
                      <button
                        onClick={() => publish(event._id || "")}
                        className="rounded-lg bg-green-500/20 px-3 py-2 text-sm text-green-300"
                      >
                        Publish
                      </button>
                    )}
                    {event.status === "Open" && (
                      <Link
                        to={`/schedule?eventId=${event._id}`}
                        className="rounded-lg bg-cyan-500/20 px-3 py-2 text-sm text-cyan-300"
                      >
                        Schedule
                      </Link>
                    )}
                    <Link
                      to={`/admin/bookings?eventId=${event._id}`}
                      className="rounded-lg bg-yellow-500/20 px-3 py-2 text-sm text-yellow-300"
                    >
                      Bookings
                    </Link>
                    <button
                      onClick={() => remove(event._id || "", event.title)}
                      className="rounded-lg bg-rose-500/20 px-3 py-2 text-sm text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredEvents.length === 0 && (
          <p className="py-12 text-center text-gray-400">No events found.</p>
        )}
      </div>
    </div>
  );
}

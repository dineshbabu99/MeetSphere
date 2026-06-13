import { useEffect, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchEvents,
  updateEventStatus,
} from "../store/slices/eventSlice";
import { formatDate } from "../data/dashboardStats";

export default function AdminApprovals() {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const pendingEvents = useMemo(
    () => events.filter((event) => event.status === "Pending"),
    [events]
  );

  const updateStatus = async (
    eventId: string,
    status: "Open" | "Rejected"
  ) => {
    await dispatch(updateEventStatus({ eventId, status }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Event Approvals</h1>
        <p className="mt-2 text-gray-400">
          Review submitted event listings before they become public.
        </p>
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
              <th className="pb-4">Category</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Capacity</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingEvents.map((event) => (
              <tr key={event._id} className="border-b border-white/5">
                <td className="py-4">
                  <p className="font-semibold text-white">{event.title}</p>
                  <p className="mt-1 max-w-sm truncate text-sm text-gray-500">
                    {event.description}
                  </p>
                </td>
                <td className="py-4 text-sm text-gray-300">
                  {event.organizer?.name || "Unknown"}
                </td>
                <td className="py-4 text-sm text-gray-300">{event.category}</td>
                <td className="py-4 text-sm text-gray-300">
                  {formatDate(event.eventDateTime)}
                </td>
                <td className="py-4 text-sm text-gray-300">{event.capacity}</td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(event._id || "", "Open")}
                      className="rounded-lg bg-green-500/20 px-3 py-2 text-sm text-green-400 hover:bg-green-500/30"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(event._id || "", "Rejected")}
                      className="rounded-lg bg-rose-500/20 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/30"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && pendingEvents.length === 0 && (
          <p className="py-12 text-center text-gray-400">
            No events are waiting for approval.
          </p>
        )}
      </div>
    </div>
  );
}

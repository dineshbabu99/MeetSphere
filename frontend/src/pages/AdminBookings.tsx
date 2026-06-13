import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEvents } from "../store/slices/eventSlice";
import { fetchAllTickets } from "../store/slices/ticketSlice";

export default function AdminBookings() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const eventFromUrl = searchParams.get("eventId") || "";
  const { events } = useAppSelector((state) => state.events);
  const { tickets, loading, error } = useAppSelector((state) => state.tickets);
  const [eventId, setEventId] = useState(eventFromUrl);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchAllTickets());
  }, [dispatch]);

  useEffect(() => {
    setEventId(eventFromUrl);
  }, [eventFromUrl]);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tickets.filter(
      (ticket) =>
        (!eventId || ticket.eventId === eventId) &&
        (!query ||
          ticket.ticketId.toLowerCase().includes(query) ||
          ticket.eventName.toLowerCase().includes(query) ||
          ticket.userName?.toLowerCase().includes(query) ||
          ticket.userEmail?.toLowerCase().includes(query))
    );
  }, [eventId, search, tickets]);

  const revenue = filteredTickets.reduce(
    (total, ticket) => total + ticket.price * ticket.quantity,
    0
  );
  const quantity = filteredTickets.reduce(
    (total, ticket) => total + ticket.quantity,
    0
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Booking Management</h1>
        <p className="mt-2 text-gray-400">
          Inspect ticket sales and attendee booking records.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[var(--bg2)] p-5">
          <p className="text-sm text-gray-400">Booking Records</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {filteredTickets.length}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[var(--bg2)] p-5">
          <p className="text-sm text-gray-400">Ticket Quantity</p>
          <p className="mt-2 text-3xl font-bold text-white">{quantity}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[var(--bg2)] p-5">
          <p className="text-sm text-gray-400">Revenue</p>
          <p className="mt-2 text-3xl font-bold text-green-400">
            ₹{revenue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <select
          value={eventId}
          onChange={(event) => setEventId(event.target.value)}
          className="rounded-xl border border-white/10 bg-[var(--bg2)] px-4 py-3 text-white outline-none"
        >
          <option value="">All events</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search ticket, attendee, or event"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[var(--bg2)] px-4 py-3 text-white outline-none"
        />
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
              <th className="pb-4">Ticket</th>
              <th className="pb-4">Attendee</th>
              <th className="pb-4">Event</th>
              <th className="pb-4">Type</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket._id} className="border-b border-white/5">
                <td className="py-4 text-xs text-gray-500">{ticket.ticketId}</td>
                <td className="py-4">
                  <p className="text-sm text-white">{ticket.userName}</p>
                  <p className="text-xs text-gray-500">{ticket.userEmail}</p>
                </td>
                <td className="py-4 text-sm text-gray-300">{ticket.eventName}</td>
                <td className="py-4 text-sm text-gray-300">
                  {ticket.ticketType} x {ticket.quantity}
                </td>
                <td className="py-4 text-sm font-semibold text-green-400">
                  ₹{(ticket.price * ticket.quantity).toLocaleString("en-IN")}
                </td>
                <td className="py-4 text-sm text-gray-300">
                  {ticket.attendanceStatus || "Booked"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredTickets.length === 0 && (
          <p className="py-12 text-center text-gray-400">No bookings found.</p>
        )}
      </div>
    </div>
  );
}

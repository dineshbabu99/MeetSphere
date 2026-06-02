import {
  useEffect,
  useMemo,
} from "react";
import { Link } from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../store/hooks";

import {
  fetchEvents,
  updateEventStatus,
  deleteEvent,
} from "../store/slices/eventSlice";

import {
  fetchUsers,
  updateUserRole,
} from "../store/slices/authSlice";

import type {
  Role,
} from "../store/slices/authSlice";

import {
  fetchAllTickets,
} from "../store/slices/ticketSlice";

const formatDate =
  (value?: string) => {

    if (!value) {

      return "-";
    }

    return new Date(value)
      .toLocaleDateString(
        "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
  };

export default function AdminDashboard() {
  const dispatch =
    useAppDispatch();

  const {
    events,
    loading: eventsLoading,
    error: eventsError,
  } = useAppSelector(
    (state) => state.events
  );

  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useAppSelector(
    (state) => state.auth
  );

  const {
    tickets,
    loading: ticketsLoading,
    error: ticketsError,
  } = useAppSelector(
    (state) => state.tickets
  );

  useEffect(() => {

    dispatch(fetchEvents());
    dispatch(fetchUsers());
    dispatch(fetchAllTickets());

  }, [dispatch]);

  const pendingEvents =
    useMemo(
      () =>
        events.filter(
          (event) =>
            event.status ===
            "Pending"
        ),
      [events]
    );

  const activeEvents =
    useMemo(
      () =>
        events.filter(
          (event) =>
            event.status === "Open"
        ),
      [events]
    );

    // console.log(activeEvents);
  const totalRevenue =
    useMemo(
      () =>
        tickets.reduce(
          (total, ticket) =>
            total +
            ticket.price *
              ticket.quantity,
          0
        ),
      [tickets]
    );

  const stats = [
    {
      title: "Pending Approvals",
      value:
        pendingEvents.length,
      sub: "Awaiting admin review",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      title: "Live Events",
      value:
        activeEvents.length,
      sub: "Published events",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Total Users",
      value: users.length,
      sub: "Registered accounts",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Ticket Revenue",
      value:
        `₹${totalRevenue}`,
      sub: `${tickets.length} bookings`,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
  ];

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "Open":
      case "Active":
      case "Attended":
        return "bg-green-500/20 text-green-400";

      case "Pending":
      case "Booked":
        return "bg-yellow-500/20 text-yellow-400";

      case "Rejected":
      case "Cancelled":
      case "Not Arrived":
        return "bg-rose-500/20 text-rose-400";

      case "Draft":
        return "bg-white/10 text-gray-300";

      default:
        return "bg-white/10 text-white";
    }
  };

  const handleEventStatus =
    async (
      eventId: string,
      status:
        | "Open"
        | "Rejected"
    ) => {

      await dispatch(
        updateEventStatus({
          eventId,
          status,
        })
      );
    };

  const handleRoleChange =
    async (
      userId: string,
      role: Role
    ) => {

      await dispatch(
        updateUserRole({
          userId,
          role,
        })
      );
    };

  const handleDeleteEvent =
    async (eventId: string, title: string) => {

      const confirmed = window.confirm(
        `Delete "${title}"? This cannot be undone.`
      );

      if (!confirmed) return;

      await dispatch(deleteEvent(eventId));
    };

  const loading =
    eventsLoading ||
    usersLoading ||
    ticketsLoading;

  const error =
    eventsError ||
    usersError ||
    ticketsError;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-400">
          Approve events, manage users, and monitor bookings
        </p>
        <Link
          to="/analytics"
          className="mt-3 inline-block text-sm text-violet-400 hover:text-violet-300"
        >
          View full analytics →
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`rounded-2xl border border-white/10 p-6 ${stat.bg}`}
          >
            <p className="text-sm text-gray-400">
              {stat.title}
            </p>

            <h2
              className={`mt-3 text-4xl font-bold ${stat.color}`}
            >
              {stat.value}
            </h2>

            <p className="mt-3 text-sm text-gray-300">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Pending Event Approvals
            </h2>

            {loading && (
              <span className="text-sm text-gray-400">
                Loading...
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="pb-4">
                    Event
                  </th>
                  <th className="pb-4">
                    Date
                  </th>
                  <th className="pb-4">
                    Status
                  </th>
                  <th className="pb-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {pendingEvents.map(
                  (event) => (
                    <tr
                      key={event._id}
                      className="border-b border-white/5"
                    >
                      <td className="py-4 text-white">
                        {event.title}
                      </td>

                      <td className="py-4 text-gray-400">
                        {formatDate(
                          event.eventDateTime
                        )}
                      </td>

                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${getStatusColor(
                            event.status
                          )}`}
                        >
                          {event.status}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleEventStatus(
                                event._id || "",
                                "Open"
                              )
                            }
                            className="rounded-lg bg-green-500/20 px-3 py-2 text-sm text-green-400 transition-all hover:bg-green-500/30"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleEventStatus(
                                event._id || "",
                                "Rejected"
                              )
                            }
                            className="rounded-lg bg-rose-500/20 px-3 py-2 text-sm text-rose-400 transition-all hover:bg-rose-500/30"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {pendingEvents.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400">
                No events are waiting for approval.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
          <h2 className="mb-5 text-2xl font-bold text-white">
            User Role Management
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="pb-4">
                    User
                  </th>
                  <th className="pb-4">
                    Email
                  </th>
                  <th className="pb-4">
                    Role
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-white/5"
                  >
                    <td className="py-4 font-medium text-white">
                      {user.name}
                    </td>

                    <td className="py-4 text-sm text-gray-400">
                      {user.email}
                    </td>

                    <td className="py-4">
                      <select
                        value={user.role}
                        onChange={(event) =>
                          handleRoleChange(
                            user._id || "",
                            event.target
                              .value as Role
                          )
                        }
                        className="rounded-xl border border-white/10 bg-[var(--bg3)] px-3 py-2 text-sm text-white outline-none"
                      >
                        <option value="User">
                          User
                        </option>
                        <option value="Admin">
                          Admin
                        </option>
                        <option value="Event Organizer">
                          Event Organizer
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
        <h2 className="mb-5 text-2xl font-bold text-white">
          Published Events
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                <th className="pb-4">Event</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Sold</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Organizer</th>
                <th className="pb-4">Organizer Email</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {activeEvents.map((event) => (
              
                <tr
                  key={event._id}
                  className="border-b border-white/5"
                >
                  <td className="py-4 text-white">
                    {event.title}
                  </td>

                  <td className="py-4 text-gray-400">
                    {formatDate(event.eventDateTime)}
                  </td>

                  <td className="py-4 text-gray-400">
                    {event.sold || 0} / {event.capacity || 0}
                  </td>

                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </td>
                    <td className="py-4 text-white">
                    {event.organizer?.name || "Unknown Organizer"}
                  </td>
                    <td className="py-4 text-white">
                    {event.organizer?.email || "Unknown Organizer"}
                  </td>

                  <td className="py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/events/${event._id}/edit`}
                        className="rounded-lg bg-violet-500/20 px-3 py-2 text-sm text-violet-300 transition-all hover:bg-violet-500/30"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDeleteEvent(
                            event._id || "",
                            event.title
                          )
                        }
                        className="rounded-lg bg-rose-500/20 px-3 py-2 text-sm text-rose-400 transition-all hover:bg-rose-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {activeEvents.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">
              No published events yet.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
        <h2 className="mb-5 text-2xl font-bold text-white">
          Ticket Bookings
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                <th className="pb-4">
                  Ticket
                </th>
                <th className="pb-4">
                  User
                </th>
                <th className="pb-4">
                  Event
                </th>
                <th className="pb-4">
                  Amount
                </th>
                <th className="pb-4">
                  Attendance
                </th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="border-b border-white/5"
                >
                  <td className="py-4 text-xs text-gray-500">
                    {ticket.ticketId}
                  </td>

                  <td className="py-4">
                    <p className="text-white">
                      {ticket.userName ||
                        "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ticket.userEmail ||
                        ticket.userId}
                    </p>
                  </td>

                  <td className="py-4 text-gray-300">
                    {ticket.eventName}
                  </td>

                  <td className="py-4 font-semibold text-green-400">
                    ₹
                    {ticket.price *
                      ticket.quantity}
                  </td>

                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${getStatusColor(
                        ticket.attendanceStatus ||
                          "Booked"
                      )}`}
                    >
                      {ticket.attendanceStatus ||
                        "Booked"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tickets.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">
              No ticket bookings yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

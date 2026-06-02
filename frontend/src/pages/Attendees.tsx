import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../store/hooks";

import {
  fetchEvents,
} from "../store/slices/eventSlice";

import {
  fetchAllTickets,
  updateTicketAttendance,
} from "../store/slices/ticketSlice";

type AttendanceStatus =
  | "Booked"
  | "Attended"
  | "Not Arrived";

export default function AttendeeManagement() {
  const dispatch =
    useAppDispatch();

  const {
    events,
  } = useAppSelector(
    (state) => state.events
  );

  const currentUser =
    useAppSelector(
      (state) => state.auth.user
    );

  const {
    tickets,
    loading,
    error,
  } = useAppSelector(
    (state) => state.tickets
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    eventId,
    setEventId,
  ] = useState("");

  useEffect(() => {

    dispatch(fetchEvents());
    dispatch(fetchAllTickets());

  }, [dispatch]);

  const activeEvents =
    useMemo(
      () =>
        events.filter(
          (event) => {
            if (event.status !== "Open") {
              return false;
            }

            if (
              currentUser?.role !==
              "Event Organizer"
            ) {
              return true;
            }

            const organizer =
              typeof event.organizer === "string"
                ? event.organizer
                : event.organizer?._id;

            return organizer === currentUser._id;
          }
        ),
      [currentUser, events]
    );

  const activeEventIds =
    useMemo(
      () =>
        new Set(
          activeEvents
            .map((event) => event._id)
            .filter(Boolean)
        ),
      [activeEvents]
    );

  const filteredTickets =
    useMemo(() => {

      return tickets.filter(
        (ticket) => {
          if (
            currentUser?.role ===
              "Event Organizer" &&
            !activeEventIds.has(
              ticket.eventId
            )
          ) {
            return false;
          }

          const matchesEvent =
            !eventId ||
            ticket.eventId ===
              eventId;

          const query =
            search.toLowerCase();

          const matchesSearch =
            !query ||
            ticket.userName
              ?.toLowerCase()
              .includes(query) ||
            ticket.userEmail
              ?.toLowerCase()
              .includes(query) ||
            ticket.ticketId
              .toLowerCase()
              .includes(query) ||
            ticket.eventName
              .toLowerCase()
              .includes(query);

          return (
            matchesEvent &&
            matchesSearch
          );
        }
      );
    }, [
      eventId,
      search,
      tickets,
      currentUser?.role,
      activeEventIds,
    ]);

  const counts =
    useMemo(
      () => ({
        booked:
          filteredTickets.filter(
            (ticket) =>
              (ticket.attendanceStatus ||
                "Booked") ===
              "Booked"
          ).length,
        attended:
          filteredTickets.filter(
            (ticket) =>
              ticket.attendanceStatus ===
              "Attended"
          ).length,
        notArrived:
          filteredTickets.filter(
            (ticket) =>
              ticket.attendanceStatus ===
              "Not Arrived"
          ).length,
      }),
      [filteredTickets]
    );

  const getTicketColor = (
    ticket: string
  ) => {
    if (
      ticket
        .toLowerCase()
        .includes("vip")
    ) {

      return "bg-yellow-500/20 text-yellow-400";
    }

    if (
      ticket
        .toLowerCase()
        .includes("general")
    ) {

      return "bg-violet-500/20 text-violet-400";
    }

    return "bg-cyan-500/20 text-cyan-400";
  };

  const getStatusColor = (
    status: AttendanceStatus
  ) => {
    switch (status) {
      case "Attended":
        return "bg-green-500/20 text-green-400";

      case "Not Arrived":
        return "bg-red-500/20 text-red-400";

      case "Booked":
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  const handleAttendance =
    async (
      ticketId: string,
      attendanceStatus:
        AttendanceStatus
    ) => {

      await dispatch(
        updateTicketAttendance({
          ticketId,
          attendanceStatus,
        })
      );
    };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Attendee Management
        </h1>

        <p className="mt-2 text-gray-400">
          Track booked tickets, attended guests, and not arrived attendees
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
          <p className="text-sm text-gray-400">
            Booked
          </p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-400">
            {counts.booked}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
          <p className="text-sm text-gray-400">
            Attended
          </p>
          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {counts.attended}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
          <p className="text-sm text-gray-400">
            Not Arrived
          </p>
          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {counts.notArrived}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={eventId}
              onChange={(event) =>
                setEventId(
                  event.target.value
                )
              }
              className="rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
            >
              <option value="">
                All Live Events
              </option>

              {activeEvents.map(
                (event) => (
                  <option
                    key={event._id}
                    value={event._id}
                  >
                    {event.title}
                  </option>
                )
              )}
            </select>

            <span className="text-sm text-gray-400">
              {filteredTickets.length} tickets booked
            </span>
          </div>

          {loading && (
            <span className="text-sm text-gray-400">
              Loading...
            </span>
          )}
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search attendees, tickets, or events..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full max-w-md rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none transition-all focus:border-[var(--accent)]"
          />
        </div>

        {filteredTickets.length ===
          0 && (
          <div className="py-20 text-center text-gray-400">
            No booked tickets found.
          </div>
        )}

        {filteredTickets.length >
          0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="pb-4 font-medium">
                    Ticket ID
                  </th>
                  <th className="pb-4 font-medium">
                    Attendee
                  </th>
                  <th className="pb-4 font-medium">
                    Event
                  </th>
                  <th className="pb-4 font-medium">
                    Ticket
                  </th>
                  <th className="pb-4 font-medium">
                    Booked On
                  </th>
                  <th className="pb-4 font-medium">
                    Status
                  </th>
                  <th className="pb-4 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map(
                  (ticket) => {
                    const status =
                      (ticket.attendanceStatus ||
                        "Booked") as AttendanceStatus;

                    return (
                      <tr
                        key={ticket._id}
                        className="border-b border-white/5 transition-all hover:bg-white/5"
                      >
                        <td className="py-5 text-xs text-gray-500">
                          {ticket.ticketId}
                        </td>

                        <td className="py-5">
                          <p className="font-semibold text-white">
                            {ticket.userName ||
                              "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {ticket.userEmail ||
                              ticket.userId}
                          </p>
                        </td>

                        <td className="py-5 text-sm text-gray-300">
                          {ticket.eventName}
                        </td>

                        <td className="py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getTicketColor(
                              ticket.ticketType
                            )}`}
                          >
                            {ticket.ticketType} x {ticket.quantity}
                          </span>
                        </td>

                        <td className="py-5 text-sm text-gray-300">
                          {new Date(
                            ticket.purchaseDate
                          ).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>

                        <td className="py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="py-5">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                handleAttendance(
                                  ticket._id || "",
                                  "Attended"
                                )
                              }
                              className="rounded-lg bg-green-500/20 px-3 py-2 text-sm text-green-400 transition-all hover:bg-green-500/30"
                            >
                              Attended
                            </button>

                            <button
                              onClick={() =>
                                handleAttendance(
                                  ticket._id || "",
                                  "Not Arrived"
                                )
                              }
                              className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400 transition-all hover:bg-red-500/30"
                            >
                              Not Arrived
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

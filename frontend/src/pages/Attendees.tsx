import { useMemo, useState } from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../store/hooks";

import {
  removeAttendee,
  updateAttendeeStatus,
} from "../store/slices/attendeeSlice";

const attendeesData = [
  {
    id: "001",
    name: "Sarah Chen",
    email: "s.chen@email.com",
    ticket: "VIP",
    registered: "Jan 5",
    status: "In",
  },
  {
    id: "002",
    name: "Marcus Lee",
    email: "m.lee@email.com",
    ticket: "GA",
    registered: "Jan 6",
    status: "In",
  },
  {
    id: "003",
    name: "Jamie Rodriguez",
    email: "j.rod@email.com",
    ticket: "VIP",
    registered: "Jan 7",
    status: "Out",
  },
  {
    id: "004",
    name: "Priya Sharma",
    email: "p.shar@email.com",
    ticket: "GA",
    registered: "Jan 8",
    status: "Pending",
  },
  {
    id: "005",
    name: "Tom Wilson",
    email: "t.wil@email.com",
    ticket: "Early Bird",
    registered: "Jan 3",
    status: "In",
  },
];

export default function AttendeeManagement() {

  const dispatch = useAppDispatch();

  const attendeesData = useAppSelector(
    (state) => state.attendees.attendees
  );

  const [search, setSearch] =
    useState("");

  const [event, setEvent] =
    useState("TechSummit 2025");

  const filteredAttendees =
    useMemo(() => {
      return attendeesData.filter(
        (attendee) =>
          attendee.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          attendee.email
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [search, attendeesData]);

  const getTicketColor = (
    ticket: string
  ) => {
    switch (ticket) {
      case "VIP":
        return "bg-yellow-500/20 text-yellow-400";

      case "GA":
        return "bg-violet-500/20 text-violet-400";

      case "Early Bird":
        return "bg-cyan-500/20 text-cyan-400";

      default:
        return "bg-white/10 text-white";
    }
  };

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "In":
        return "bg-green-500/20 text-green-400";

      case "Out":
        return "bg-red-500/20 text-red-400";

      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";

      default:
        return "bg-white/10 text-white";
    }
  };

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        
        <h1 className="text-4xl font-bold text-white">
          Attendee Management
        </h1>

        <p className="mt-2 text-gray-400">
          View, filter and export attendee
          lists for your events
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">

        {/* Top */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            <select
              value={event}
              onChange={(e) =>
                setEvent(e.target.value)
              }
              className="rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
            >
              <option>
                TechSummit 2025
              </option>

              <option>
                Neon Music Festival
              </option>

              <option>
                Startup Pitch Night
              </option>
            </select>

            <span className="text-sm text-gray-400">
              {
                filteredAttendees.length
              }{" "}
              registered
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button className="rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-sm text-gray-300 transition-all hover:bg-white/5">
              📥 Export CSV
            </button>

            <button className="rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90">
              📧 Email All
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          
          <input
            type="text"
            placeholder="🔍 Search attendees..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full max-w-md rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none transition-all focus:border-[var(--accent)]"
          />
        </div>

        {/* Empty State */}
        {filteredAttendees.length ===
          0 && (
          <div className="py-20 text-center text-gray-400">
            No attendees found
          </div>
        )}

        {/* Table */}
        {filteredAttendees.length >
          0 && (
          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">

                  <th className="pb-4 font-medium">
                    #
                  </th>

                  <th className="pb-4 font-medium">
                    Name
                  </th>

                  <th className="pb-4 font-medium">
                    Email
                  </th>

                  <th className="pb-4 font-medium">
                    Ticket
                  </th>

                  <th className="pb-4 font-medium">
                    Registered
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
                {filteredAttendees.map(
                  (attendee) => (
                    <tr
                      key={attendee.id}
                      className="border-b border-white/5 transition-all hover:bg-white/5"
                    >

                      <td className="py-5 text-sm text-gray-500">
                        {attendee.id}
                      </td>

                      <td className="py-5 font-semibold text-white">
                        {attendee.name}
                      </td>

                      <td className="py-5 text-sm text-gray-400">
                        {attendee.email}
                      </td>

                      {/* Ticket */}
                      <td className="py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getTicketColor(
                            attendee.ticket
                          )}`}
                        >
                          {
                            attendee.ticket
                          }
                        </span>
                      </td>

                      <td className="py-5 text-sm text-gray-300">
                        {
                          attendee.registered
                        }
                      </td>

                      {/* Status */}
                      <td className="py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                            attendee.status
                          )}`}
                        >
                          {
                            attendee.status
                          }
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-5">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              dispatch(
                                updateAttendeeStatus(
                                  {
                                    id: attendee.id,
                                    status:
                                      "In",
                                  }
                                )
                              )
                            }
                            className="rounded-lg bg-green-500/20 px-3 py-2 text-sm text-green-400 transition-all hover:bg-green-500/30"
                          >
                            Check In
                          </button>

                          <button
                            onClick={() =>
                              dispatch(
                                removeAttendee(
                                  attendee.id
                                )
                              )
                            }
                            className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400 transition-all hover:bg-red-500/30"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
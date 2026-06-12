import { useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { FiInfo } from "react-icons/fi";
import {
  createEvent,
  deleteEvent,
  fetchEvents,
  updateEvent,
  updateEventStatus,
} from "../store/slices/eventSlice";
import { formatDate } from "../data/dashboardStats";
// import { Link } from "react-router-dom";

const toApiDateTime = (value: string) =>
  value
    ? new Date(value).toISOString()
    : value;

type Ticket = {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
};


export default function CreateEvent() {

  const user = useAppSelector((state) => state.auth.user);


  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchEvents());
  }, []);
  const [editingEventId, setEditingEventId] =
    useState<string | null>(null);

  const [eventData, setEventData] =
    useState({
      title: "",
      description: "",
      category: "Technology",
      location: "",

      eventDateTime: "",

      bookingStart: "",

      bookingEnd: "",

      capacity: "",

      image: "",
      userId: user?._id || "",
    });

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      price: 0,
      capacity: 0,
    },
  ]);

  const handleEdit = (id: string) => {
    const event = events.find(
      (item) => item._id === id
    );
    // console.log(event);

    if (!event) return;

    setEditingEventId(id);

    setEventData({
      title: event.title || "",
      description: event.description || "",
      category: event.category || "Technology",
      location: event.location || "",
      eventDateTime: event.eventDateTime
        ? new Date(event.eventDateTime)
          .toISOString()
          .slice(0, 16)
        : "",
      bookingStart: event.bookingStart
        ? new Date(event.bookingStart)
          .toISOString()
          .slice(0, 16)
        : "",
      bookingEnd: event.bookingEnd
        ? new Date(event.bookingEnd)
          .toISOString()
          .slice(0, 16)
        : "",
      capacity: String(event.capacity || ""),
      image: event.image || "",
      userId: event.organizer?._id || "",
    });

    setTickets(
      (event?.tickets || []).map((ticket) => ({
        id: ticket._id || crypto.randomUUID(),
        _id: ticket._id,
        name: ticket.name,
        description: ticket.description || "",
        price: ticket.price,
        capacity: ticket.capacity,
      }))
    );
  };


const totalTicketCapacity = tickets.reduce(
  (sum, ticket) => sum + (ticket.capacity || 0),
  0
);

const eventCapacity = Number(eventData.capacity || 0);

const remainingCapacity =
  eventCapacity - totalTicketCapacity;

const capacityExceeded =
  totalTicketCapacity > eventCapacity;

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const publishEvent =
    async () => {

      if (!eventData.title) {

        alert(
          "Enter event title"
        );

        return;
      }

const totalCapacity = tickets.reduce(
  (sum, ticket) => sum + ticket.capacity,
  0
);

if (totalCapacity > Number(eventData.capacity)) {
  alert(
    "Total ticket capacity cannot exceed expected event capacity"
  );
  return;
}


      const result =
        await dispatch(
          createEvent({
            ...eventData,
            eventDateTime: toApiDateTime(eventData.eventDateTime),
            bookingStart: toApiDateTime(eventData.bookingStart),
            bookingEnd: toApiDateTime(eventData.bookingEnd),

            capacity: Number(
              eventData.capacity
            ),

            tickets,

            sold: 0,

            status: "Pending",
          })
        );

      if (
        createEvent.fulfilled.match(
          result
        )
      ) {

        alert(
          "Event sent for approval"
        );

        resetForm();
      }
    };

  const saveDraft =
    async () => {

      const result =
        await dispatch(
          createEvent({
            ...eventData,
            eventDateTime: toApiDateTime(eventData.eventDateTime),
            bookingStart: toApiDateTime(eventData.bookingStart),
            bookingEnd: toApiDateTime(eventData.bookingEnd),

            capacity: Number(
              eventData.capacity
            ),

            tickets,

            sold: 0,

            status: "Draft",
          })
        );

      if (
        createEvent.fulfilled.match(
          result
        )
      ) {

        alert(
          "Draft Saved ✨"
        );

        resetForm();
      }
    };


  const removeTicket =
    (id: string) => {

      setTickets((prev) =>
        prev.filter(
          (ticket) =>
            ticket.id !== id
        )
      );
    };


  const updateTicket = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? {
            ...ticket,
            [field]: value,
          }
          : ticket
      )
    );
  };
  const addTicketType = () => {
    setTickets([
      ...tickets,

      {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        price: 0,
        capacity: 0,
      },
    ]);
  };

  const resetForm = () => {

    setEventData({
      title: "",
      description: "",
      category: "Technology",
      location: "",

      eventDateTime: "",

      bookingStart: "",

      bookingEnd: "",

      capacity: "",

      image: "",
      userId: user?._id || "",
    });
    setTickets([
      {
        id:
          crypto.randomUUID(),

        name:
          "",

        description: "",

        price: 0,

        capacity: 0,
      },
    ]);
  };

  const ticketPrices = (items: typeof tickets) =>
    items
      .map((ticket) => ticket.price)
      .filter((price) => !Number.isNaN(price));

  const minTicketPrice = (items: typeof tickets) => {
    const prices = ticketPrices(items);
    return prices.length ? Math.min(...prices) : 0;
  };
  const {
    events,
  } = useAppSelector(
    (state) => state.events
  );

  // console.log(events);
  const activeEvents = events.filter(
    (event) => event.organizer?._id === user?._id
  );
  // console.log(activeEvents);


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


  const handleDeleteEvent =
    async (eventId: string, title: string) => {

      const confirmed = window.confirm(
        `Delete "${title}"? This cannot be undone.`
      );

      if (!confirmed) return;

      await dispatch(deleteEvent(eventId));
    };

  const publishDraft =
    async (eventId: string) => {

      const status =
        user?.role === "Admin"
          ? "Open"
          : "Pending";

      const result =
        await dispatch(
          updateEventStatus({
            eventId,
            status,
          })
        );

      if (
        updateEventStatus.fulfilled.match(
          result
        )
      ) {

        alert(
          status === "Open"
            ? "Event published"
            : "Event submitted for approval"
        );
      }
    };

  const saveChanges = async () => {
    if (!editingEventId || !eventData.title) {
      alert("Enter event title");
      return;
    }

        const totalCapacity = tickets.reduce(
  (sum, ticket) => sum + ticket.capacity,
  0
);

if (totalCapacity > Number(eventData.capacity)) {
  alert(
    "Total ticket capacity cannot exceed expected event capacity"
  );
  return;
}

    const result = await dispatch(
      
      updateEvent({
        eventId: editingEventId,
        eventData: {
          ...eventData,
          eventDateTime: toApiDateTime(eventData.eventDateTime),
          bookingStart: toApiDateTime(eventData.bookingStart),
          bookingEnd: toApiDateTime(eventData.bookingEnd),
          capacity: Number(eventData.capacity),
          tickets: tickets.map(({ id, ...ticket }) => ({
            _id: ticket._id,
            name: ticket.name,
            description: ticket.description,
            price: ticket.price,
            capacity: ticket.capacity,
          })),
        },
      })
    );
    

    if (updateEvent.fulfilled.match(result)) {
      alert("Event updated successfully");
      setEditingEventId(null);
      resetForm();
    }
  };

  const minDateTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }, []);


  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">

        <div className="space-y-6">

          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Event Details
            </h2>

            <div className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Event Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  placeholder="e.g. TechSummit 2026"
                  className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none transition-all focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none transition-all focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Category
                  </label>

                  <select
                    name="category"
                    value={eventData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none">
                    <option>Technology</option>
                    <option>Music</option>
                    <option>Business</option>
                    <option>Art</option>
                    <option>Sports</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Location
                  </label>

                  <input
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none transition-all focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Event Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    name="eventDateTime"
                    value={eventData.eventDateTime}
                    onChange={handleChange}
                    min={minDateTime}
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Booking Start Date & Time
                    </label>

                    <div className="group relative">
                      <FiInfo className="cursor-help text-gray-400" />

                      <div className="absolute left-5 top-0 z-10 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block">
                        Customers can start booking tickets from this date and time.
                      </div>
                    </div>
                  </div>

                  <input
                    type="datetime-local"
                    name="bookingStart"
                    value={eventData.bookingStart}
                    min={minDateTime}
                    max={eventData.eventDateTime || undefined}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Booking End Date & Time
                    </label>

                    <div className="group relative">
                      <FiInfo className="cursor-help text-gray-400" />

                      <div className="absolute left-5 top-0 z-10 hidden w-72 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block">
                        Ticket sales will automatically stop at this date and time. It must be before the event starts.
                      </div>
                    </div>
                  </div>

                  <input
                    type="datetime-local"
                    name="bookingEnd"
                    value={eventData.bookingEnd}
                    min={eventData.bookingStart || minDateTime}
                    max={eventData.eventDateTime || undefined}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Expected Capacity
                  </label>

                  <input
                    type="number"
                    name="capacity"
                    value={eventData.capacity}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                  />
                </div>

                {/* Emoji */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Event Poster
                  </label>

                  <input
                    type="url"
                    placeholder="Paste event poster URL"
                    value={eventData.image}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        image: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
          {/* <div className="mb-4 rounded-lg bg-black/20 p-3 text-sm">
  <p className="text-gray-300">
    Event Capacity: {eventCapacity}
  </p>

  <p className="text-gray-300">
    Allocated Tickets: {totalTicketCapacity}
  </p>

  <p
    className={
      remainingCapacity >= 0
        ? "text-green-400"
        : "text-red-400"
    }
  >
    Remaining Capacity: {remainingCapacity}
  </p>

  {capacityExceeded && (
    <p className="mt-2 text-red-400">
      Total ticket capacity exceeds the event capacity.
    </p>
  )}
</div> */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Ticket Types
              </h2>

              <button
                onClick={addTicketType}
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90">
                + Add
              </button>
            </div>


            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-xl border border-white/10 bg-[var(--bg3)] p-4"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Ticket Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VIP Pass"
                        value={ticket.name}
                        onChange={(e) =>
                          updateTicket(ticket.id, "name", e.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="Enter price"
                        value={ticket.price === 0 ? "" : ticket.price}
                        onChange={(e) =>
                          updateTicket(ticket.id, "price", Number(e.target.value))
                        }
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                      />
                    </div>
<div>
  <label className="mb-2 block text-sm font-medium text-gray-300">
    Capacity
  </label>

  <input
    type="number"
    placeholder="Available seats"
    value={ticket.capacity === 0 ? "" : ticket.capacity}
    max={remainingCapacity + ticket.capacity}
    onChange={(e) => {
      const newCapacity = Number(e.target.value);

      const otherTicketsCapacity = tickets.reduce(
        (sum, t) =>
          t.id === ticket.id
            ? sum
            : sum + (t.capacity || 0),
        0
      );

      const maxAllowed =
        eventCapacity - otherTicketsCapacity;

      updateTicket(
        ticket.id,
        "capacity",
        Math.min(newCapacity, maxAllowed)
      );
    }}
    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
  />
</div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <textarea
                      placeholder="e.g. VIP lounge access, early entry"
                      value={ticket.description}
                      onChange={(e) =>
                        updateTicket(ticket.id, "description", e.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                      rows={2}
                    />
                  </div>

                  <button
                    onClick={() => removeTicket(ticket.id)}
                    className="mt-3 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400 transition-all hover:bg-red-500/30"
                  >
                    Remove Ticket
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="space-y-6">

          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
            <h2 className="mb-5 text-2xl font-bold text-white">
              Event Preview
            </h2>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg3)]">

              {/* Top */}
              <div className="h-48 overflow-hidden">

                {
                  eventData.image ? (
                    <img
                      src={eventData.image}
                      alt="Event Poster"
                      className="h-48 w-full rounded-xl object-cover"
                    />
                  ) : (

                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-600 to-pink-500 text-white">
                      No Poster
                    </div>
                  )
                }
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white">
                  {eventData.title || "Event Title"}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  📍 {eventData.location || "Location"} · 📅{" "}
                  {
                    eventData.eventDateTime
                      ? new Date(
                        eventData.eventDateTime
                      ).toLocaleString()
                      : "Date"
                  }
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-lg font-bold text-[var(--accent)]">
                    From ₹{minTicketPrice(tickets)}
                  </span>

                  <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">
                    Pending Approval
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <button
                disabled={capacityExceeded}
                onClick={
                  editingEventId
                    ? saveChanges
                    : publishEvent
                }
                className="w-full rounded-xl bg-[var(--accent)] py-3 font-semibold text-white"
              >
                {editingEventId
                  ? "Update Event"
                  : "Publish Event"}
              </button>

              {!editingEventId && (
                <button
                  onClick={saveDraft}
                  className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] py-3 font-medium text-gray-300"
                >
                  Save as Draft
                </button>
              )}
              {editingEventId && (
                <button
                  onClick={() => {
                    setEditingEventId(null);
                    resetForm();
                  }}
                  className="w-full rounded-xl border border-red-500 py-3 text-red-400"
                >
                  Cancel Edit
                </button>
              )}
            </div>
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
                      {event.status === "Draft" && (
                        <button
                          onClick={() =>
                            publishDraft(
                              event._id || ""
                            )
                          }
                          className="rounded-lg bg-green-500/20 px-3 py-2 text-sm text-green-300 transition-all hover:bg-green-500/30"
                        >
                          {user?.role === "Admin"
                            ? "Publish"
                            : "Submit"}
                        </button>
                      )}
                      {/* <Link
                        to={`/events/${event._id}/edit`}
                        className="rounded-lg bg-violet-500/20 px-3 py-2 text-sm text-violet-300 transition-all hover:bg-violet-500/30"
                      >
                        Edit
                      </Link> */}
                      <button
                        onClick={() => {
                          if (event._id) {
                            handleEdit(event._id);
                          }
                        }}
                        className="rounded-lg bg-violet-500/20 px-3 py-2 text-sm text-violet-300"
                      >
                        Edit
                      </button>

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
    </>
  );
}

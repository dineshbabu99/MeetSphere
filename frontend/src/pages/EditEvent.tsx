import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchEvents,
  updateEvent,
} from "../store/slices/eventSlice";

type LocalTicket = {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
};

const toLocalDateTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

const toApiDateTime = (value: string) =>
  value ? new Date(value).toISOString() : value;

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { events, loading } = useAppSelector((state) => state.events);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    category: "Technology",
    location: "",
    eventDateTime: "",
    bookingStart: "",
    bookingEnd: "",
    capacity: "",
    image: "",
    status: "Open" as "Open" | "Pending" | "Rejected" | "Draft",
  });

  const [tickets, setTickets] = useState<LocalTicket[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (events.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, events.length]);

  useEffect(() => {
    const event = events.find((item) => item._id === id);
    if (!event || initialized) return;

    if (currentUser?.role === "Event Organizer") {
      const organizer =
        typeof event.organizer === "string"
          ? event.organizer
          : event.organizer?._id;

      if (organizer !== currentUser._id) {
        return;
      }
    }

    setEventData({
      title: event.title || "",
      description: event.description || "",
      category: event.category || "Technology",
      location: event.location || "",
      eventDateTime: toLocalDateTime(event.eventDateTime),
      bookingStart: toLocalDateTime(event.bookingStart),
      bookingEnd: toLocalDateTime(event.bookingEnd),
      capacity: String(event.capacity || ""),
      image: event.image || "",
      status: event.status,
    });

    setTickets(
      (event.tickets || []).map((ticket) => ({
        id: ticket._id || crypto.randomUUID(),
        _id: ticket._id,
        name: ticket.name,
        description: ticket.description || "",
        price: ticket.price,
        capacity: ticket.capacity,
      }))
    );

    setInitialized(true);
  }, [currentUser, events, id, initialized]);

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

  const updateTicket = (
    ticketId: string,
    field: string,
    value: string | number
  ) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, [field]: value }
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

  const removeTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
  };

  const saveChanges = async () => {
    if (!id || !eventData.title) {
      alert("Enter event title");
      return;
    }

    const result = await dispatch(
      updateEvent({
        eventId: id,
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
      navigate("/admin");
    }
  };

  const ticketPrices = tickets
    .map((ticket) => ticket.price)
    .filter((price) => !Number.isNaN(price));
  const minPrice = ticketPrices.length ? Math.min(...ticketPrices) : 0;

  if (loading && !initialized) {
    return (
      <div className="py-20 text-center text-gray-400">
        Loading event...
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="py-20 text-center text-gray-400">
        Event not found.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Edit Event</h1>
          <p className="mt-2 text-gray-400">
            Update published event details and ticket types
          </p>
        </div>

        <button
          onClick={() => navigate("/admin")}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
        >
          Back to Admin
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">Event Details</h2>

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
                  className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
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
                  className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
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
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                  >
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
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
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
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={eventData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="Pending">Pending</option>
                    <option value="Draft">Draft</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Booking Start
                  </label>
                  <input
                    type="datetime-local"
                    name="bookingStart"
                    value={eventData.bookingStart}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Booking End
                  </label>
                  <input
                    type="datetime-local"
                    name="bookingEnd"
                    value={eventData.bookingEnd}
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Event Poster URL
                  </label>
                  <input
                    type="url"
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
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Ticket Types</h2>
              <button
                onClick={addTicketType}
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
              >
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
                    <input
                      type="text"
                      placeholder="Ticket Name"
                      value={ticket.name}
                      onChange={(e) =>
                        updateTicket(ticket.id, "name", e.target.value)
                      }
                      className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                    />

                    <input
                      type="number"
                      placeholder="Price"
                      value={ticket.price}
                      onChange={(e) =>
                        updateTicket(
                          ticket.id,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                    />

                    <input
                      type="number"
                      placeholder="Capacity"
                      value={ticket.capacity}
                      onChange={(e) =>
                        updateTicket(
                          ticket.id,
                          "capacity",
                          Number(e.target.value)
                        )
                      }
                      className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <textarea
                    placeholder="Ticket description (e.g. VIP lounge access, early entry)"
                    value={ticket.description}
                    onChange={(e) =>
                      updateTicket(
                        ticket.id,
                        "description",
                        e.target.value
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    rows={2}
                  />

                  <button
                    onClick={() => removeTicket(ticket.id)}
                    className="mt-3 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
            <h2 className="mb-5 text-2xl font-bold text-white">Preview</h2>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg3)]">
              {eventData.image ? (
                <img
                  src={eventData.image}
                  alt="Event poster"
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-violet-600 to-pink-500 text-white">
                  No Poster
                </div>
              )}

              <div className="p-5">
                <h3 className="text-xl font-bold text-white">
                  {eventData.title || "Event Title"}
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  From ₹{minPrice}
                </p>
              </div>
            </div>

            <button
              onClick={saveChanges}
              className="mt-5 w-full rounded-xl bg-[var(--accent)] py-3 font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

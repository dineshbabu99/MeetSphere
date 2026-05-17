import { useState } from "react";

import { useAppDispatch } from "../store/hooks";

import { addEvent } from "../store/slices/eventSlice";


type TicketType = {
  id: string;
  name: string;
  price: number;
  capacity: number;
};

type EventType = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  capacity: string;
  emoji: string;

  tickets: TicketType[];

  sold: number;

  status: "Open" | "Draft";
};

export default function CreateEvent() {
  const dispatch = useAppDispatch();

const [eventData, setEventData] =
  useState({
    title: "",
    description: "",
    category: "Technology",
    location: "",
    date: "",
    time: "",
    capacity: "",
    emoji: "💻",
  });
  const [tickets, setTickets] = useState([
  {
    id: crypto.randomUUID(),
    name: "General Admission",
    price: 49,
    capacity: 200,
  },
]);
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

const publishEvent = () => {
  if (!eventData.title) {
    alert("Enter event title");
    return;
  }

dispatch(
  addEvent({
    id: crypto.randomUUID(),

    ...eventData,

    tickets,

    sold: 0,

    status: "Open",
  })
);

  alert("Event Published 🚀");

  setEventData({
    title: "",
    description: "",
    category: "Technology",
    location: "",
    date: "",
    time: "",
    capacity: "",
    emoji: "💻",
  });
};
const saveDraft = () => {

  dispatch(
    addEvent({
      id: crypto.randomUUID(),

      ...eventData,

      tickets,

      sold: 0,

      status: "Draft",
    })
  );

  alert("Draft Saved ✨");
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
      price: 0,
      capacity: 0,
    },
  ]);
};
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      
      {/* LEFT SIDE */}
      <div className="space-y-6">

        {/* Event Details */}
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Event Details
          </h2>

          <div className="space-y-5">

            {/* Title */}
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

            {/* Description */}
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

            {/* Grid */}
            <div className="grid gap-5 md:grid-cols-2">

              {/* Category */}
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

              {/* Location */}
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

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Start Date
                </label>

                <input
                  type="date"
  name="date"
  value={eventData.date}
  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                />
              </div>

              {/* Time */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Start Time
                </label>

                <input
                 type="time"
  name="time"
  value={eventData.time}
  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
                />
              </div>

              {/* Capacity */}
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
                  Event Emoji
                </label>

                <select 
                 name="emoji"
  value={eventData.emoji}
  onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none">
                  <option>💻</option>
                  <option>🎵</option>
                  <option>🚀</option>
                  <option>🎨</option>
                  <option>⚽</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Types */}
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Ticket Types
            </h2>
<button
  onClick={addTicketType}
  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
>
  + Add Ticket
</button>
            <button className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90">
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

        {/* Name */}
        <input
          type="text"
          placeholder="Ticket Name"
          value={ticket.name}
          onChange={(e) =>
            updateTicket(
              ticket.id,
              "name",
              e.target.value
            )
          }
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
        />

        {/* Price */}
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

        {/* Capacity */}
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
    </div>
  ))}
</div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6">

        {/* Preview Card */}
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
          <h2 className="mb-5 text-2xl font-bold text-white">
            Event Preview
          </h2>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg3)]">

            {/* Top */}
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-violet-600 to-pink-500 text-6xl">
            {eventData.emoji}
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-white">
                {eventData.title || "Event Title"}
              </h3>

              <p className="mt-2 text-sm text-gray-400">
               📍 {eventData.location || "Location"} · 📅{" "}
{eventData.date || "Date"}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-lg font-bold text-[var(--accent)]">
                  From $49
                </span>

                <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                  Open
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 space-y-3">
           <button
  onClick={publishEvent}
  className="w-full rounded-xl bg-[var(--accent)] py-3 font-semibold text-white transition-all hover:opacity-90"
>
  🚀 Publish Event
</button>

          <button
  onClick={saveDraft}
  className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] py-3 font-medium text-gray-300 transition-all hover:bg-white/5"
>
  Save as Draft
</button>
          </div>
        </div>

        {/* Checklist */}
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
          <h2 className="mb-5 text-2xl font-bold text-white">
            Publishing Checklist
          </h2>

          <div className="space-y-4 text-sm">

            <div className="flex items-center gap-3 text-green-400">
              ✅ Event title
            </div>

            <div className="flex items-center gap-3 text-green-400">
              ✅ Date & time
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              ⬜ Description
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              ⬜ Ticket pricing
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              ⬜ Location set
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
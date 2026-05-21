import { useState } from "react";

import { useAppDispatch } from "../store/hooks";

import { createEvent } from "../store/slices/eventSlice";


export default function CreateEvent() {
  const dispatch = useAppDispatch();

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
  });

  const [tickets, setTickets] = useState([
  {
    id: crypto.randomUUID(),
    name: "General Admission",
    description: "",
    price: 0,
    capacity: 0,
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

const publishEvent =
  async () => {

    if (!eventData.title) {

      alert(
        "Enter event title"
      );

      return;
    }

    const result =
      await dispatch(
      createEvent({
  ...eventData,

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
});
  setTickets([
    {
      id:
        crypto.randomUUID(),

      name:
        "General Admission",

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
{/* Event Date & Time */}
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

{/* Booking Start */}
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

{/* Booking End */}
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

        {/* Ticket Types */}
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
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
  onClick={() =>
    removeTicket(ticket.id)
  }
  className="mt-3 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400 transition-all hover:bg-red-500/30"
>
  Remove
</button>
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
         <div className="h-48 overflow-hidden">

 {
  eventData.image ? (
    <img
      src={eventData.image}
      alt="Event Poster"
      className="h-48 w-full rounded-xl object-cover"
    />
  )    : (

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

      </div>
    </div>
  );
}

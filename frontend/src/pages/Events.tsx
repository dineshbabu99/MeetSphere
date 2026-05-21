import { useEffect, useMemo, useState } from "react";
import TicketModal from "../components/TicketModal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEvents } from "../store/slices/eventSlice";



export default function Events() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
const [selectedEvent,setSelectedEvent] = useState<any>(null);

  const events = useAppSelector(
    (state) => state.events.events
  );
  const publishedEvents = events.filter(
    (event) => event.status === "Open"
  );

const handleOpen = (
  event: any
) => {
  setSelectedEvent(event);

  setOpen(true);
};

 

  const filteredEvents =
    useMemo(() => {

      return publishedEvents.filter(
        (event) => {

          const matchesSearch =
            event.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            event.location
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );



          const matchesCategory =
            category === "" ||

            event.category ===
            category;



          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      publishedEvents,
      search,
      category,
    ]);

  const dispatch =
    useAppDispatch();

  useEffect(() => {

    dispatch(fetchEvents());

  }, []);

  // console.log(events)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Browse Events
        </h1>

        <p className="mt-2 text-gray-400">
          Discover and join amazing events near you
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-4 py-3 text-white outline-none transition-all focus:border-[var(--accent)]"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-4 py-3 text-white outline-none"
        >
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Music">Music</option>
          <option value="Business">Business</option>
          <option value="Art">Art</option>
          <option value="Sports">Sports</option>
        </select>

        {/* Date */}
        <select className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-4 py-3 text-white outline-none">
          <option>Any Date</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>Next 3 Months</option>
        </select>

      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredEvents.map((event) => {
          const now = new Date();

const bookingStarted =
  now >=
  new Date(
    event.bookingStart
  );

const bookingEnded =
  now >
  new Date(
    event.bookingEnd
  );

const soldOut =
  event.sold >=
  event.capacity;

const bookingStatus =
  soldOut
    ? "Sold Out"
    : !bookingStarted
    ? "Not Started"
    : bookingEnded
    ? "Booking Closed"
    : "Open";
          const progress = event.capacity > 0 ? Math.round((event.sold / event.capacity) * 100) : 0;
          return (
            <div
              key={event._id}
              className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg2)] transition-all hover:-translate-y-1 hover:border-[var(--accent)]"
            >
              {/* Thumbnail */}
              <div
                className="relative h-52 overflow-hidden"
              >
                <div className="absolute right-3 top-3">

  <span
    className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur ${
      bookingStatus === "Open"
        ? "bg-green-500/20 text-green-400"
        : bookingStatus ===
          "Sold Out"
        ? "bg-red-500/20 text-red-400"
        : "bg-yellow-500/20 text-yellow-400"
    }`}
  >
    {bookingStatus}
  </span>

</div>
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
                
              </div>
              

              <div className="p-5">
                <h3 className="text-xl font-semibold">
                  {event.title}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  📍 {event.location}
                </p>
              <p className="mt-1 text-sm text-gray-400">
  📅{" "}
  {new Date(
    event.eventDateTime
  ).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )}

  {" · "}

  ⏰{" "}
  {new Date(
    event.eventDateTime
  ).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  )}
</p>
                <div className="mt-5">
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--bg3)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-2xl font-bold text-[var(--accent)]">
                    ₹
                    {
                      Math.min(
                        ...event.tickets.map(
                          (ticket) =>
                            ticket.price
                        )
                      )
                    }
                  </span>

                  <span className="text-sm text-gray-400">
                    {/* {event.capacity - event.sold} left
                    {" "} */}
                    {event.sold}/{event.capacity} Sold
                  </span>
                </div>

<button
  onClick={() =>
    handleOpen(event)
  }
  disabled={
    soldOut ||
    !bookingStarted ||
    bookingEnded
  }
  className={`mt-5 w-full rounded-xl py-3 font-semibold text-white transition-all ${
    soldOut ||
    !bookingStarted ||
    bookingEnded
      ? "cursor-not-allowed bg-gray-600"
      : "bg-[var(--accent)] hover:opacity-90"
  }`}
>
  {soldOut
    ? "Sold Out"
    : !bookingStarted
    ? "Booking Not Started"
    : bookingEnded
    ? "Booking Closed"
    : "Get Ticket"}
</button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="mt-20 text-center text-gray-400">
          No events found.
        </div>
      )}
    {open && selectedEvent && (
  <TicketModal
    open={open}
    onClose={() =>
      setOpen(false)
    }
    event={selectedEvent}
  />
)}
    </div>

  );
}

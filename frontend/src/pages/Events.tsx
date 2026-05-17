import { useMemo, useState } from "react";
import TicketModal from "../components/TicketModal";
import { useAppSelector } from "../store/hooks";

const eventsData = [
  {
    id: 1,
    title: "TechSummit 2025",
    cat: "Technology",
    date: "Jan 15",
    loc: "San Francisco",
    price: 149,
    emoji: "💻",
    color: "#1a0e3f,#2d1a6e",
    badge: "Tech",
    sold: 380,
    cap: 500,
  },
  {
    id: 2,
    title: "Neon Music Festival",
    cat: "Music",
    date: "Jan 22",
    loc: "Austin, TX",
    price: 89,
    emoji: "🎵",
    color: "#3b0a24,#7a1a4b",
    badge: "Music",
    sold: 720,
    cap: 1000,
  },
  {
    id: 3,
    title: "Startup Pitch Night",
    cat: "Business",
    date: "Feb 3",
    loc: "New York",
    price: 49,
    emoji: "🚀",
    color: "#1a1500,#3d3000",
    badge: "Biz",
    sold: 180,
    cap: 300,
  },
  {
    id: 4,
    title: "AI Art Exhibition",
    cat: "Art",
    date: "Feb 14",
    loc: "Chicago",
    price: 25,
    emoji: "🎨",
    color: "#001a0e,#003d1a",
    badge: "Art",
    sold: 60,
    cap: 200,
  },
  {
    id: 5,
    title: "Design Sprint Workshop",
    cat: "Technology",
    date: "Feb 20",
    loc: "Seattle",
    price: 199,
    emoji: "✏️",
    color: "#0e0a1a,#2d1a6e",
    badge: "Design",
    sold: 40,
    cap: 60,
  },
  {
    id: 6,
    title: "City Run Marathon",
    cat: "Sports",
    date: "Mar 1",
    loc: "Boston",
    price: 35,
    emoji: "🏃",
    color: "#001a1a,#003d3d",
    badge: "Sport",
    sold: 890,
    cap: 2000,
  },
];

export default function Events() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
const [open, setOpen] = useState(false);
const [selectedEvent, setSelectedEvent] = useState("");

const events = useAppSelector(
  (state) => state.events.events
);
const publishedEvents = events.filter(
  (event) => event.status === "Open"
);
console.log(publishedEvents)

  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.loc.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "" || event.cat === category;

      const matchesPrice =
        price === ""
          ? true
          : price === "free"
          ? event.price === 0
          : price === "under50"
          ? event.price < 50
          : price === "50to150"
          ? event.price >= 50 && event.price <= 150
          : event.price > 150;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [search, category, price]);

  
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

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
        
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

        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-4 py-3 text-white outline-none"
        >
          <option value="">Any Price</option>
          <option value="free">Free</option>
          <option value="under50">Under $50</option>
          <option value="50to150">$50–$150</option>
          <option value="150plus">$150+</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredEvents.map((event) => {
          const progress = Math.round((event.sold / event.cap) * 100);
          return (
            <div
              key={event.id}
              className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg2)] transition-all hover:-translate-y-1 hover:border-[var(--accent)]"
            >
              {/* Thumbnail */}
              <div
                className="relative flex h-52 items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${event.color})`,
                }}
              >
                <div className="text-7xl">
                  {event.emoji}
                </div>

                <span className="absolute right-4 top-4 rounded-full bg-black/30 px-3 py-1 text-sm backdrop-blur">
                  {event.badge}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold">
                  {event.title}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  📍 {event.loc}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  📅 {event.date}
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
                    ${event.price}
                  </span>

                  <span className="text-sm text-gray-400">
                    {event.cap - event.sold} left
                  </span>
                </div>

           <button
  onClick={() => {
    setSelectedEvent(event.title);
    setOpen(true);
  }}
  className="mt-5 w-full rounded-xl bg-[var(--accent)] py-3 font-semibold text-white transition-all hover:opacity-90"
>
  Get Ticket
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
      <TicketModal
  open={open}
  onClose={() => setOpen(false)}
  eventName={selectedEvent}
/>
    </div>
    
  );
}
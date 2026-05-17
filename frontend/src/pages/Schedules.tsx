const events = [
  {
    title: "TechSummit 2025",
    emoji: "💻",
    meta: "Jan 15–16 · 3 Sessions",
  },
  {
    title: "Neon Music Festival",
    emoji: "🎵",
    meta: "Jan 22 · 8 Acts",
  },
  {
    title: "Startup Pitch Night",
    emoji: "🚀",
    meta: "Feb 3 · 5 Pitches",
  },
];

const schedules = [
  {
    day: "Day 1 — January 15, 2025",
    sessions: [
      {
        time: "09:00 AM",
        title: "Opening Keynote: The Future of AI",
        speaker: "Dr. Sarah Chen, CTO @ DeepMind",
        tag: "Keynote",
        border: "border-violet-500",
      },
      {
        time: "11:00 AM",
        title: "Workshop: Building LLM Applications",
        speaker: "Marcus Lee, Principal Engineer @ Anthropic",
        tag: "Workshop",
        border: "border-cyan-500",
      },
      {
        time: "02:00 PM",
        title: "Panel: Ethics in Tech",
        speaker: "4 Industry Leaders",
        tag: "Panel",
        border: "border-yellow-500",
      },
    ],
  },
  {
    day: "Day 2 — January 16, 2025",
    sessions: [
      {
        time: "10:00 AM",
        title: "Networking Brunch + Demo Showcase",
        speaker: "All Exhibitors",
        tag: "Networking",
        border: "border-green-500",
      },
      {
        time: "03:00 PM",
        title: "Closing: Awards & Recognition",
        speaker: "Host: Jamie Rodriguez",
        tag: "Closing",
        border: "border-pink-500",
      },
    ],
  },
];

export default function Schedule() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Event Schedules
        </h1>

        <p className="mt-2 text-gray-400">
          Session timelines and speaker lineup for upcoming events
        </p>
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        
        {/* Left Side */}
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
          
          <h2 className="mb-5 text-2xl font-bold text-white">
            Select Event
          </h2>

          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={event.title}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all hover:border-[var(--accent)] hover:bg-[var(--bg3)] ${
                  index === 0
                    ? "border-[var(--accent)] bg-[var(--bg3)]"
                    : "border-white/10"
                }`}
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 text-2xl">
                  {event.emoji}
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-semibold text-white">
                    {event.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    {event.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
          
          {/* Top */}
          <div className="mb-8 flex items-center justify-between">
            
            <h2 className="text-3xl font-bold text-white">
              💻 TechSummit 2025 — Schedule
            </h2>

            <button className="rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/5">
              📬 Notify Attendees
            </button>
          </div>

          {/* Schedule Days */}
          <div className="space-y-10">
            {schedules.map((day) => (
              <div key={day.day}>
                
                {/* Date */}
                <div className="mb-5 text-lg font-semibold text-[var(--accent)]">
                  📅 {day.day}
                </div>

                {/* Sessions */}
                <div className="space-y-5">
                  {day.sessions.map((session) => (
                    <div
                      key={session.title}
                      className={`flex gap-5 rounded-2xl border-l-4 ${session.border} bg-[var(--bg3)] p-5`}
                    >
                      {/* Time */}
                      <div className="min-w-[90px] text-sm font-semibold text-gray-400">
                        {session.time}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {session.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          {session.speaker}
                        </p>
                      </div>

                      {/* Tag */}
                      <div>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                          {session.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
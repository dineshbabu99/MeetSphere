import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEvents } from "../store/slices/eventSlice";
import { fetchTickets } from "../store/slices/ticketSlice";
import {
  fetchSchedules,
  type ScheduleItem,
} from "../store/slices/scheduleSlice";

const tagBorders = [
  "border-violet-500",
  "border-cyan-500",
  "border-yellow-500",
  "border-green-500",
  "border-pink-500",
];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const getEventId = (scheduleEvent: ScheduleItem["event"]) => {
  if (typeof scheduleEvent === "string") return scheduleEvent;
  if (scheduleEvent && typeof scheduleEvent === "object" && "_id" in scheduleEvent) {
    return String(scheduleEvent._id);
  }
  return "";
};

export default function UserSchedule() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const eventFromUrl = searchParams.get("eventId");

  const user = useAppSelector((state) => state.auth.user);
  const { tickets } = useAppSelector((state) => state.tickets);
  const { events } = useAppSelector((state) => state.events);
  const { schedules, loading, error } = useAppSelector(
    (state) => state.schedules
  );

  const [selectedEventId, setSelectedEventId] = useState("");

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchTickets(user._id));
    }
    dispatch(fetchEvents());
    dispatch(fetchSchedules());
  }, [dispatch, user?._id]);

  const myEventIds = useMemo(
    () => [...new Set(tickets.map((t) => t.eventId).filter(Boolean))],
    [tickets]
  );

  const myEvents = useMemo(
    () => events.filter((e) => e._id && myEventIds.includes(e._id)),
    [events, myEventIds]
  );

  useEffect(() => {
    if (myEvents.length === 0) {
      setSelectedEventId("");
      return;
    }

    if (eventFromUrl && myEvents.some((e) => e._id === eventFromUrl)) {
      setSelectedEventId(eventFromUrl);
      return;
    }

    if (!myEvents.some((e) => e._id === selectedEventId)) {
      setSelectedEventId(myEvents[0]._id || "");
    }
  }, [myEvents, eventFromUrl, selectedEventId]);

  const selectedEvent = myEvents.find((e) => e._id === selectedEventId);

  const selectedSchedule = schedules.find(
    (s) => getEventId(s.event) === selectedEventId
  );

  const scheduleDays = useMemo(
    () =>
      [...(selectedSchedule?.days || [])]
        .map((day) => ({
          ...day,
          sessions: [...day.sessions].sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
          ),
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    [selectedSchedule]
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">My Event Schedule</h1>
        <p className="mt-2 text-gray-400">
          Session timings for events you booked
        </p>
        <Link
          to="/myTickets"
          className="mt-3 inline-block text-sm text-violet-400 hover:text-violet-300"
        >
          ← Back to My Tickets
        </Link>
      </div>

      {myEvents.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--bg2)] p-10 text-center text-gray-400">
          <p>You have no tickets yet.</p>
          <Link to="/events" className="mt-3 inline-block text-violet-400">
            Browse events
          </Link>
        </div>
      )}

      {myEvents.length > 0 && (
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
            <h2 className="mb-4 text-xl font-bold text-white">Your events</h2>
            <div className="space-y-3">
              {myEvents.map((event) => (
                <button
                  key={event._id}
                  type="button"
                  onClick={() => setSelectedEventId(event._id || "")}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selectedEventId === event._id
                      ? "border-[var(--accent)] bg-violet-500/10"
                      : "border-white/10 bg-[var(--bg3)] hover:border-white/20"
                  }`}
                >
                  <p className="font-semibold text-white">{event.title}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {event.location || "TBA"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
            {loading && (
              <p className="text-sm text-gray-400">Loading schedule...</p>
            )}

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {selectedEvent && (
              <>
                <h2 className="text-2xl font-bold text-white">
                  {selectedEvent.title}
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {selectedEvent.location} ·{" "}
                  {formatDate(selectedEvent.eventDateTime)}
                </p>
              </>
            )}

            <div className="mt-8 space-y-10">
              {scheduleDays.map((day, dayIndex) => (
                <div key={day._id || day.date}>
                  <p className="mb-4 text-lg font-semibold text-[var(--accent)]">
                    Day {dayIndex + 1} — {formatDate(day.date)}
                  </p>

                  <div className="space-y-4">
                    {day.sessions.map((session, sessionIndex) => (
                      <div
                        key={
                          session._id ||
                          `${session.title}-${session.startTime}`
                        }
                        className={`flex flex-col gap-3 rounded-2xl border-l-4 ${
                          tagBorders[sessionIndex % tagBorders.length]
                        } bg-[var(--bg3)] p-5 md:flex-row`}
                      >
                        <div className="min-w-[100px] text-sm font-semibold text-gray-400">
                          {session.startTime}
                          {session.endTime ? ` – ${session.endTime}` : ""}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">
                            {session.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-400">
                            {session.speaker || "Speaker TBA"}
                          </p>
                          {session.description && (
                            <p className="mt-2 text-sm text-gray-500">
                              {session.description}
                            </p>
                          )}
                          {session.venue && (
                            <p className="mt-1 text-sm text-gray-500">
                              📍 {session.venue}
                            </p>
                          )}
                        </div>
                        <span className="h-fit rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
                          {session.tag || "Session"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {selectedEvent && scheduleDays.length === 0 && !loading && (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-gray-400">
                  No schedule published for this event yet. Check back later.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

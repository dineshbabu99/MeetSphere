import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { FiInfo } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../store/hooks";

import {
  fetchEvents,
} from "../store/slices/eventSlice";

import {
  addScheduleSession,
  fetchSchedules,
} from "../store/slices/scheduleSlice";

const tagBorders = [
  "border-violet-500",
  "border-cyan-500",
  "border-yellow-500",
  "border-green-500",
  "border-pink-500",
];

const formatDate = (
  value: string
) =>
  new Date(value).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

const formatEventDate = (
  value: string
) =>
  new Date(value).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

const getEventId = (
  scheduleEvent: unknown
) => {

  if (
    typeof scheduleEvent ===
    "string"
  ) {

    return scheduleEvent;
  }

  if (
    scheduleEvent &&
    typeof scheduleEvent ===
    "object" &&
    "_id" in scheduleEvent
  ) {

    return String(
      scheduleEvent._id
    );
  }

  return "";
};

export default function Schedule() {
  const dispatch =
    useAppDispatch();
  const [searchParams] =
    useSearchParams();
  const eventFromUrl =
    searchParams.get("eventId") || "";

  const {
    events,
    loading: eventsLoading,
  } = useAppSelector(
    (state) => state.events
  );

  const {
    schedules,
    loading: schedulesLoading,
    saving,
    error,
  } = useAppSelector(
    (state) => state.schedules
  );

  const currentUser =
    useAppSelector(
      (state) => state.auth.user
    );

  const liveEvents =
    useMemo(
      () => {

        const now =
          new Date();

        return events.filter(
          (event) => {
            if (
              event.status !== "Open" ||
              new Date(
                event.eventDateTime
              ) < now
            ) {
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
        );
      },
      [currentUser, events]
    );

  const [
    selectedEventId,
    setSelectedEventId,
  ] = useState("");

  const [
    formData,
    setFormData,
  ] = useState({
    date: "",
    startTime: "",
    endTime: "",
    title: "",
    speaker: "",
    tag: "Session",
    venue: "",
    description: "",
  });

  useEffect(() => {

    dispatch(fetchEvents());
    dispatch(fetchSchedules());

  }, [dispatch]);

  useEffect(() => {

    if (
      liveEvents.length === 0
    ) {

      if (selectedEventId) {

        setSelectedEventId("");
      }

      return;
    }

    if (
      eventFromUrl &&
      liveEvents.some(
        (event) =>
          event._id === eventFromUrl
      )
    ) {

      setSelectedEventId(
        eventFromUrl
      );

      return;
    }

    const selectedEventExists =
      liveEvents.some(
        (event) =>
          event._id ===
          selectedEventId
      );

    if (selectedEventExists) {

      return;
    }

    setSelectedEventId(
      liveEvents[0]._id || ""
    );

  }, [
    liveEvents,
    selectedEventId,
    eventFromUrl,
  ]);

  const selectedEvent =
    liveEvents.find(
      (event) =>
        event._id ===
        selectedEventId
    );

  const selectedSchedule =
    schedules.find(
      (schedule) =>
        getEventId(
          schedule.event
        ) === selectedEventId
    );

  const scheduleDays =
    useMemo(
      () =>
        [...(selectedSchedule?.days || [])]
          .map((day) => ({
            ...day,
            sessions: [
              ...day.sessions,
            ].sort((first, second) =>
              first.startTime.localeCompare(
                second.startTime
              )
            ),
          }))
          .sort(
            (first, second) =>
              new Date(first.date).getTime() -
              new Date(second.date).getTime()
          ),
      [selectedSchedule]
    );

  const sessionCount =
    scheduleDays.reduce(
      (total, day) =>
        total + day.sessions.length,
      0
    );

  const speakerCount =
    new Set(
      scheduleDays.flatMap((day) =>
        day.sessions
          .map((session) =>
            session.speaker?.trim()
          )
          .filter(Boolean)
      )
    ).size;

  const scheduledVenues =
    new Set(
      scheduleDays.flatMap((day) =>
        day.sessions
          .map((session) =>
            session.venue?.trim()
          )
          .filter(Boolean)
      )
    ).size;

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {

    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };

  const resetForm = () => {

    setFormData({
      date: "",
      startTime: "",
      endTime: "",
      title: "",
      speaker: "",
      tag: "Session",
      venue: "",
      description: "",
    });
  };

  const handleSubmit =
    async (
      event: React.FormEvent
    ) => {

      event.preventDefault();

      if (!selectedEventId) {

        return;
      }

      const result =
        await dispatch(
          addScheduleSession({
            eventId:
              selectedEventId,
            ...formData,
          })
        );

      if (
        addScheduleSession.fulfilled.match(
          result
        )
      ) {

        resetForm();
      }
    };

  const loading =
    eventsLoading ||
    schedulesLoading;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Event Schedules
        </h1>

        <p className="mt-2 text-gray-400">
          Build session timelines and speaker lineups for published events
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Select Event
            </h2>

            {loading && (
              <span className="text-sm text-gray-400">
                Loading...
              </span>
            )}
          </div>

          <div className="space-y-4">
            {liveEvents.map(
              (event) => {
                const schedule =
                  schedules.find(
                    (item) =>
                      getEventId(
                        item.event
                      ) === event._id
                  );

                const totalSessions =
                  schedule?.days.reduce(
                    (total, day) =>
                      total +
                      day.sessions.length,
                    0
                  ) || 0;

                return (
                  <button
                    key={event._id}
                    type="button"
                    onClick={() =>
                      setSelectedEventId(
                        event._id || ""
                      )
                    }
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all hover:border-[var(--accent)] hover:bg-[var(--bg3)] ${
                      selectedEventId ===
                      event._id
                        ? "border-[var(--accent)] bg-[var(--bg3)]"
                        : "border-white/10"
                    }`}
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-xl bg-white/5">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[var(--accent)]">
                          {event.title
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        {formatEventDate(
                          event.eventDateTime
                        )}{" "}
                        - {totalSessions} sessions
                      </p>
                    </div>
                  </button>
                );
              }
            )}

            {!loading &&
              liveEvents.length ===
                0 && (
                <div className="rounded-2xl border border-white/10 bg-[var(--bg3)] p-5 text-sm text-gray-400">
                  No live events are available for scheduling.
                </div>
              )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {selectedEvent
                    ? `${selectedEvent.title} Schedule`
                    : "Choose an Event"}
                </h2>

                {selectedEvent && (
                  <p className="mt-2 text-sm text-gray-400">
                    {selectedEvent.location} - {sessionCount} sessions planned
                  </p>
                )}
              </div>

            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {selectedEvent && (
              <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-[var(--bg3)] p-4">
                  <p className="text-xs uppercase text-gray-500">Event date</p>
                  <p className="mt-2 font-semibold text-white">
                    {new Date(selectedEvent.eventDateTime).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[var(--bg3)] p-4">
                  <p className="text-xs uppercase text-gray-500">Booking window</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {formatEventDate(selectedEvent.bookingStart)} -{" "}
                    {formatEventDate(selectedEvent.bookingEnd)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[var(--bg3)] p-4">
                  <p className="text-xs uppercase text-gray-500">Ticket sales</p>
                  <p className="mt-2 font-semibold text-white">
                    {selectedEvent.sold || 0} / {selectedEvent.capacity || 0}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedEvent.tickets.length} ticket types
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[var(--bg3)] p-4">
                  <p className="text-xs uppercase text-gray-500">Schedule coverage</p>
                  <p className="mt-2 font-semibold text-white">
                    {scheduleDays.length} days · {sessionCount} sessions
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {speakerCount} speakers · {scheduledVenues} venues
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-10">
              {scheduleDays.map(
                (day, dayIndex) => (
                  <div key={day._id || day.date}>
                    <div className="mb-5 text-lg font-semibold text-[var(--accent)]">
                      Day {dayIndex + 1} - {formatDate(day.date)}
                    </div>

                    <div className="space-y-5">
                      {day.sessions.map(
                        (
                          session,
                          sessionIndex
                        ) => (
                          <div
                            key={
                              session._id ||
                              `${session.title}-${session.startTime}`
                            }
                            className={`flex flex-col gap-4 rounded-2xl border-l-4 ${
                              tagBorders[
                                sessionIndex %
                                  tagBorders.length
                              ]
                            } bg-[var(--bg3)] p-5 md:flex-row`}
                          >
                            <div className="min-w-[110px] text-sm font-semibold text-gray-400">
                              {session.startTime}
                              {session.endTime
                                ? ` - ${session.endTime}`
                                : ""}
                            </div>

                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white">
                                {session.title}
                              </h3>

                              <p className="mt-1 text-sm text-gray-400">
                                {session.speaker ||
                                  "Speaker to be announced"}
                              </p>

                              {session.venue && (
                                <p className="mt-1 text-sm text-gray-500">
                                  Venue: {session.venue}
                                </p>
                              )}

                              {session.description && (
                                <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300">
                                  {session.description}
                                </p>
                              )}
                            </div>

                            <div>
                              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                                {session.tag ||
                                  "Session"}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}

              {selectedEvent &&
                scheduleDays.length ===
                  0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--bg3)] p-8 text-center text-gray-400">
                    No sessions have been added for this event yet.
                  </div>
                )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6"
          >
            <h2 className="mb-5 text-2xl font-bold text-white">
              Add Session
            </h2>

         <div className="grid gap-4 lg:grid-cols-2">

<div>
  <div className="mb-2 flex items-center gap-2">
    <label className="text-sm font-medium text-gray-300">
      Session Date
    </label>

    <div className="group relative">
      <FiInfo className="cursor-help text-gray-400" />

      <div className="absolute left-5 top-0 z-10 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block">
        Select the date on which this session will take place.
      </div>
    </div>
  </div>

  <input
    type="date"
    name="date"
    value={formData.date}
    onChange={handleChange}
    required
    disabled={!selectedEvent}
    className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
  />
</div>

  <div>

 <div className="mb-2 flex items-center gap-2">
    <label className="text-sm font-medium text-gray-300">
     Session Type
    </label>

    <div className="group relative">
      <FiInfo className="cursor-help text-gray-400" />

      <div className="absolute left-5 top-0 z-10 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block">
           Categorize the session for attendees.
      </div>
    </div>
  </div>

    <select
      name="tag"
      value={formData.tag}
      onChange={handleChange}
      disabled={!selectedEvent}
      className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
    >
      <option>Session</option>
      <option>Keynote</option>
      <option>Workshop</option>
      <option>Panel</option>
      <option>Networking</option>
      <option>Closing</option>
    </select>
  </div>

  <div>
   <div className="mb-2 flex items-center gap-2">
    <label className="text-sm font-medium text-gray-300">
      Start Time
    </label>

    <div className="group relative">
      <FiInfo className="cursor-help text-gray-400" />

      <div className="absolute left-5 top-0 z-10 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block">
       Time when the session begins.
      </div>
    </div>
  </div>


    <input
      type="time"
      name="startTime"
      value={formData.startTime}
      onChange={handleChange}
      required
      disabled={!selectedEvent}
      className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
    />
  </div>

  <div>
   <div className="mb-2 flex items-center gap-2">
    <label className="text-sm font-medium text-gray-300">
      End Time
    </label>

    <div className="group relative">
      <FiInfo className="cursor-help text-gray-400" />

      <div className="absolute left-5 top-0 z-10 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block">
        Time when the session ends.
      </div>
    </div>
  </div>

    <input
      type="time"
      name="endTime"
      value={formData.endTime}
      onChange={handleChange}
      disabled={!selectedEvent}
      className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
    />
  </div>

  <div className="lg:col-span-2">
   <div className="mb-2 flex items-center gap-2">
    <label className="text-sm font-medium text-gray-300">
      Session Title
    </label>

    <div className="group relative">
      <FiInfo className="cursor-help text-gray-400" />

      <div className="absolute left-5 top-0 z-10 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block">
       A clear title attendees will see in the schedule.
      </div>
    </div>
  </div>

    <input
      type="text"
      name="title"
      value={formData.title}
      onChange={handleChange}
      placeholder="e.g. Future of AI"
      required
      disabled={!selectedEvent}
      className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
    />
  </div>

  <div>
   <div className="mb-2 flex items-center gap-2">
    <label className="text-sm font-medium text-gray-300">
      Speaker
    </label>

    <div className="group relative">
      <FiInfo className="cursor-help text-gray-400" />

      <div className="absolute left-5 top-0 z-10 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block">
        Enter the name of the speaker for this session.
      </div>
    </div>
  </div>

    <input
      type="text"
      name="speaker"
      value={formData.speaker}
      onChange={handleChange}
      placeholder="Speaker name"
      disabled={!selectedEvent}
      className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
    />
  </div>

  <div>
   <div className="mb-2 flex items-center gap-2">
    <label className="text-sm font-medium text-gray-300">
      Venue
    </label>

    <div className="group relative">
      <FiInfo className="cursor-help text-gray-400" />

      <div className="absolute left-5 top-0 z-10 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block">
        Enter the location where this session will take place.
      </div>
    </div>
  </div>

    <input
      type="text"
      name="venue"
      value={formData.venue}
      onChange={handleChange}
      placeholder="Hall A, Main Stage, etc."
      disabled={!selectedEvent}
      className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
    />
  </div>


  <div className="lg:col-span-2">
 <div className="mb-2 flex items-center gap-2">
    <label className="text-sm font-medium text-gray-300">
      Description
    </label>

    <div className="group relative">
      <FiInfo className="cursor-help text-gray-400" />

      <div className="absolute left-5 top-0 z-10 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block">
        Provide a brief overview of what this session will cover.
      </div>
    </div>
  </div>

    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      placeholder="Describe the session..."
      disabled={!selectedEvent}
      className="min-h-24 w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none"
    />
  </div>

</div>
            <button
              type="submit"
              disabled={
                !selectedEvent ||
                saving
              }
              className="mt-5 rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Session"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

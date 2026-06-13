import { useEffect, useMemo } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiMapPin,
  FiPlus,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import { formatDate, ticketAmount } from "../data/dashboardStats";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEvents } from "../store/slices/eventSlice";
import { fetchAllTickets } from "../store/slices/ticketSlice";

const statusStyles: Record<string, string> = {
  Open: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Pending: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  Draft: "border-slate-400/30 bg-slate-400/10 text-slate-300",
  Rejected: "border-rose-400/30 bg-rose-400/10 text-rose-300",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function OrganizerDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { events, loading: eventsLoading } = useAppSelector(
    (state) => state.events
  );
  const { tickets, loading: ticketsLoading } = useAppSelector(
    (state) => state.tickets
  );

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const organizerEvents = useMemo(
    () =>
      events.filter((event) => {
        const organizer =
          typeof event.organizer === "string"
            ? event.organizer
            : event.organizer?._id;
        return organizer === user?._id;
      }),
    [events, user?._id]
  );

  const eventIds = useMemo(
    () => new Set(organizerEvents.map((event) => event._id).filter(Boolean)),
    [organizerEvents]
  );
  const organizerTickets = useMemo(
    () => tickets.filter((ticket) => eventIds.has(ticket.eventId)),
    [eventIds, tickets]
  );
  const liveEvents = organizerEvents.filter((event) => event.status === "Open");
  const pendingEvents = organizerEvents.filter(
    (event) => event.status === "Pending"
  );
  const ticketsSold = organizerTickets.reduce(
    (total, ticket) => total + ticket.quantity,
    0
  );
  const revenue = organizerTickets.reduce(
    (total, ticket) => total + ticketAmount(ticket),
    0
  );
  const recentEvents = [...organizerEvents]
    .sort(
      (a, b) =>
        new Date(a.eventDateTime).getTime() -
        new Date(b.eventDateTime).getTime()
    )
    .slice(0, 3);
  const loading = eventsLoading || ticketsLoading;

  const metrics = [
    {
      label: "My Events",
      value: organizerEvents.length,
      detail: `${liveEvents.length} currently live`,
      icon: FiCalendar,
      accent: "from-cyan-400/20 to-cyan-400/5",
      iconStyle: "bg-cyan-400/15 text-cyan-300",
    },
    {
      label: "Tickets Sold",
      value: ticketsSold,
      detail: `${organizerTickets.length} booking records`,
      icon: FiTag,
      accent: "from-amber-400/20 to-amber-400/5",
      iconStyle: "bg-amber-400/15 text-amber-300",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(revenue),
      detail: "Across all your events",
      icon: FiBarChart2,
      accent: "from-emerald-400/20 to-emerald-400/5",
      iconStyle: "bg-emerald-400/15 text-emerald-300",
    },
    {
      label: "Pending Approval",
      value: pendingEvents.length,
      detail: "Waiting for admin review",
      icon: FiClock,
      accent: "from-rose-400/20 to-rose-400/5",
      iconStyle: "bg-rose-400/15 text-rose-300",
    },
  ];

  const actions = [
    {
      title: "Create event",
      text: "Build a new event listing",
      to: "/create",
      icon: FiPlus,
      color: "bg-cyan-400/15 text-cyan-300",
    },
    {
      title: "Manage schedules",
      text: "Add sessions and speakers",
      to: "/schedule",
      icon: FiCalendar,
      color: "bg-amber-400/15 text-amber-300",
    },
    {
      title: "View analytics",
      text: "Track sales and performance",
      to: "/analytics",
      icon: FiActivity,
      color: "bg-emerald-400/15 text-emerald-300",
    },
    {
      title: "Manage attendees",
      text: "Review bookings and check-ins",
      to: "/attendees",
      icon: FiUsers,
      color: "bg-rose-400/15 text-rose-300",
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      <section className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {/* <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <FiActivity /> Organizer workspace
          </span> */}
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
            Keep an eye on event performance, publishing progress, schedules,
            and attendees from one focused workspace.
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-950 transition hover:bg-cyan-100"
        >
          <FiPlus /> Create event
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={`rounded-lg border border-white/10 bg-gradient-to-br ${metric.accent} p-5`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-white">
                    {loading ? "..." : metric.value}
                  </p>
                </div>
                <span className={`rounded-lg p-3 ${metric.iconStyle}`}>
                  <Icon size={20} />
                </span>
              </div>
              <p className="mt-4 text-xs text-gray-400">{metric.detail}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Quick actions</h2>
            <p className="mt-1 text-sm text-gray-500">
              Common organizer workflows
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.to}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[var(--bg2)] p-5 transition hover:border-violet-500/40"
              >
                <span className={`rounded-lg p-3 ${action.color}`}>
                  <Icon size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-white">
                    {action.title}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    {action.text}
                  </span>
                </span>
                <FiArrowRight className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Your events</h2>
            <p className="mt-1 text-sm text-gray-500">
              The next events in your calendar
            </p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Manage all <FiArrowRight />
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/15 bg-[var(--bg2)] px-6 py-14 text-center">
            <FiCalendar className="mx-auto text-gray-500" size={28} />
            <p className="mt-4 font-semibold text-white">No events created yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first listing to start selling tickets.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recentEvents.map((event) => {
              const progress =
                event.capacity > 0
                  ? Math.min(100, Math.round((event.sold / event.capacity) * 100))
                  : 0;
              return (
                <article
                  key={event._id}
                  className="overflow-hidden rounded-lg border border-white/10 bg-[var(--bg2)] transition hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="relative h-40 bg-[var(--bg3)]">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-600">
                        <FiCalendar size={32} />
                      </div>
                    )}
                    <span
                      className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur ${statusStyles[event.status]}`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="truncate text-lg font-semibold text-white">
                      {event.title}
                    </h3>
                    <div className="mt-3 space-y-2 text-sm text-gray-400">
                      <p className="flex items-center gap-2">
                        <FiCalendar className="text-cyan-300" />
                        {formatDate(event.eventDateTime)}
                      </p>
                      <p className="flex items-center gap-2">
                        <FiMapPin className="text-amber-300" />
                        <span className="truncate">{event.location || "TBA"}</span>
                      </p>
                    </div>
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs text-gray-500">
                        <span>{event.sold || 0} sold</span>
                        <span>{progress}% capacity</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-cyan-400"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
                      <Link
                        to={`/events/${event._id}/edit`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-white/10"
                      >
                        <FiEdit3 /> Edit
                      </Link>
                      {event.status === "Open" && (
                        <Link
                          to={`/schedule?eventId=${event._id}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                        >
                          <FiCheckCircle /> Schedule
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

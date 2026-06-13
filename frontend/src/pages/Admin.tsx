import { useEffect, useMemo } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiDollarSign,
  FiShield,
  FiTag,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import { formatDate, ticketAmount } from "../data/dashboardStats";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUsers } from "../store/slices/authSlice";
import { fetchEvents } from "../store/slices/eventSlice";
import { fetchAllTickets } from "../store/slices/ticketSlice";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { events, loading: eventsLoading } = useAppSelector(
    (state) => state.events
  );
  const { users, loading: usersLoading } = useAppSelector((state) => state.auth);
  const { tickets, loading: ticketsLoading } = useAppSelector(
    (state) => state.tickets
  );

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchUsers());
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const pendingEvents = useMemo(
    () => events.filter((event) => event.status === "Pending"),
    [events]
  );
  const activeEvents = events.filter((event) => event.status === "Open");
  const organizers = users.filter((user) => user.role === "Event Organizer");
  const platformUsers = users.filter((user) => user.role === "User");
  const ticketsSold = tickets.reduce(
    (total, ticket) => total + ticket.quantity,
    0
  );
  const revenue = tickets.reduce(
    (total, ticket) => total + ticketAmount(ticket),
    0
  );
  const loading = eventsLoading || usersLoading || ticketsLoading;

  const stats = [
    {
      label: "Total Events",
      value: events.length,
      detail: `${pendingEvents.length} awaiting approval`,
      icon: FiCalendar,
      accent: "from-cyan-400/25 to-cyan-400/5",
      iconStyle: "bg-cyan-400/15 text-cyan-300",
    },
    {
      label: "Active Events",
      value: activeEvents.length,
      detail: "Published and accepting bookings",
      icon: FiCheckCircle,
      accent: "from-emerald-400/25 to-emerald-400/5",
      iconStyle: "bg-emerald-400/15 text-emerald-300",
    },
    {
      label: "Total Organizers",
      value: organizers.length,
      detail: "Event organizer accounts",
      icon: FiUserCheck,
      accent: "from-amber-400/25 to-amber-400/5",
      iconStyle: "bg-amber-400/15 text-amber-300",
    },
    {
      label: "Total Users",
      value: platformUsers.length,
      detail: `${users.length} total platform accounts`,
      icon: FiUsers,
      accent: "from-blue-400/25 to-blue-400/5",
      iconStyle: "bg-blue-400/15 text-blue-300",
    },
    {
      label: "Tickets Sold",
      value: ticketsSold,
      detail: `${tickets.length} booking records`,
      icon: FiTag,
      accent: "from-rose-400/25 to-rose-400/5",
      iconStyle: "bg-rose-400/15 text-rose-300",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(revenue),
      detail: "Gross booking value",
      icon: FiDollarSign,
      accent: "from-violet-400/25 to-violet-400/5",
      iconStyle: "bg-violet-400/15 text-violet-300",
    },
  ];

  const modules = [
    {
      title: "Event approvals",
      description: "Review organizer submissions and control publishing.",
      path: "/admin/approvals",
      value: pendingEvents.length,
      label: "pending",
      icon: FiClipboard,
      color: "bg-amber-400/15 text-amber-300",
    },
    {
      title: "Manage events",
      description: "Edit listings, schedules, status, and event records.",
      path: "/admin/events",
      value: events.length,
      label: "events",
      icon: FiCalendar,
      color: "bg-cyan-400/15 text-cyan-300",
    },
    {
      title: "Manage users",
      description: "Review accounts and assign platform roles.",
      path: "/admin/users",
      value: users.length,
      label: "accounts",
      icon: FiShield,
      color: "bg-blue-400/15 text-blue-300",
    },
    {
      title: "Manage bookings",
      description: "Monitor ticket sales, revenue, and attendance.",
      path: "/admin/bookings",
      value: tickets.length,
      label: "bookings",
      icon: FiTag,
      color: "bg-rose-400/15 text-rose-300",
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      <section className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {/* <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <FiShield /> Platform control center
          </span> */}
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Admin Overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
            Monitor platform growth and move quickly between approvals, events,
            users, and bookings.
          </p>
        </div>
        <Link
          to="/analytics"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-950 transition hover:bg-cyan-100"
        >
          View analytics <FiArrowRight />
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-lg border border-white/10 bg-gradient-to-br ${stat.accent} p-5 transition hover:border-white/20`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-white">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
                <span className={`rounded-lg p-3 ${stat.iconStyle}`}>
                  <Icon size={20} />
                </span>
              </div>
              <p className="mt-4 text-xs text-gray-400">{stat.detail}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">
            Administrative workspaces
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Focused tools for each operational responsibility
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.path}
                to={module.path}
                className="group flex items-start gap-4 rounded-lg border border-white/10 bg-[var(--bg2)] p-5 transition hover:border-white/20 hover:bg-[var(--bg3)]"
              >
                <span className={`rounded-lg p-3 ${module.color}`}>
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">
                      {module.title}
                    </span>
                    <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-gray-400">
                      {loading ? "..." : module.value} {module.label}
                    </span>
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-gray-500">
                    {module.description}
                  </span>
                </span>
                <FiArrowRight className="mt-1 text-gray-600 transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-white/10 bg-[var(--bg2)]">
        <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-white">Pending approvals</h2>
            <p className="mt-1 text-xs text-gray-500">
              Latest organizer submissions requiring review
            </p>
          </div>
          <Link
            to="/admin/approvals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Review all <FiArrowRight />
          </Link>
        </div>

        {pendingEvents.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <FiCheckCircle className="mx-auto text-emerald-300" size={26} />
            <p className="mt-3 font-semibold text-white">Approval queue is clear</p>
            <p className="mt-1 text-sm text-gray-500">
              There are no event listings waiting for review.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {pendingEvents.slice(0, 5).map((event) => (
              <div
                key={event._id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {event.organizer?.name || "Unknown organizer"} ·{" "}
                    {formatDate(event.eventDateTime)} · {event.category}
                  </p>
                </div>
                <Link
                  to="/admin/approvals"
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/20"
                >
                  Review <FiArrowRight />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

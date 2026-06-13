import "../style.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEvents } from "../store/slices/eventSlice";
import { fetchUsers } from "../store/slices/authSlice";
import { fetchAllTickets } from "../store/slices/ticketSlice";
import {
  buildAttendanceChart,
  buildCategoryChart,
  buildEventStatusChart,
  buildRevenueChart,
  buildTopEventsChart,
  formatRevenue,
  ticketAmount,
} from "../data/dashboardStats";
import { FiBarChart2, FiCalendar, FiDollarSign, FiTag } from "react-icons/fi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const doughnutOptions = {
  responsive: true,
  borderWidth: 0,
  plugins: {
    legend: {
      display: true,
      position: "right" as const,
      labels: {
        boxWidth: 12,
        boxHeight: 12,
        padding: 10,
        font: { size: 12 },
      },
    },
  },
  cutout: "65%",
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: true } },
  scales: { y: { beginAtZero: true } },
};

const horizontalBarOptions = {
  ...barOptions,
  indexAxis: "y" as const,
};

export default function Analytics() {
  const [revenueTab, setRevenueTab] = useState<"weekly" | "monthly">("weekly");
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(
    (state) => state.auth.user
  );

  const { events, loading: eventsLoading } = useAppSelector(
    (state) => state.events
  );
  const { users, loading: usersLoading } = useAppSelector(
    (state) => state.auth
  );
  const { tickets, loading: ticketsLoading } = useAppSelector(
    (state) => state.tickets
  );

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchAllTickets());

    if (currentUser?.role === "Admin") {
      dispatch(fetchUsers());
    }
  }, [dispatch, currentUser?.role]);

  const visibleEvents = useMemo(() => {
    if (currentUser?.role !== "Event Organizer") {
      return events;
    }

    return events.filter((event) => {
      const organizer =
        typeof event.organizer === "string"
          ? event.organizer
          : event.organizer?._id;

      return organizer === currentUser._id;
    });
  }, [currentUser, events]);

  const visibleEventIds = useMemo(
    () => new Set(visibleEvents.map((event) => event._id).filter(Boolean)),
    [visibleEvents]
  );

  const visibleTickets = useMemo(() => {
    if (currentUser?.role !== "Event Organizer") {
      return tickets;
    }

    return tickets.filter((ticket) => visibleEventIds.has(ticket.eventId));
  }, [currentUser?.role, tickets, visibleEventIds]);

  const totalRevenue = useMemo(
    () => visibleTickets.reduce((sum, t) => sum + ticketAmount(t), 0),
    [visibleTickets]
  );

  const ticketsSold = useMemo(
    () => visibleTickets.reduce((sum, t) => sum + t.quantity, 0),
    [visibleTickets]
  );

  const attendanceRate = useMemo(() => {
    if (visibleTickets.length === 0) return 0;
    const attended = visibleTickets.filter(
      (t) => t.attendanceStatus === "Attended"
    ).length;
    return Math.round((attended / visibleTickets.length) * 100);
  }, [visibleTickets]);

  const revenueChart = useMemo(
    () => buildRevenueChart(visibleTickets, revenueTab),
    [visibleTickets, revenueTab]
  );

  const categoryChart = useMemo(
    () => buildCategoryChart(visibleEvents),
    [visibleEvents]
  );

  const attendanceChart = useMemo(
    () => buildAttendanceChart(visibleTickets),
    [visibleTickets]
  );

  const eventStatusChart = useMemo(
    () => buildEventStatusChart(visibleEvents),
    [visibleEvents]
  );

  const topEventsChart = useMemo(
    () => buildTopEventsChart(visibleTickets, visibleEvents),
    [visibleTickets, visibleEvents]
  );

  const loading = eventsLoading || ticketsLoading || usersLoading;
  const metrics = [
    {
      label: "Total Events",
      value: loading ? "..." : visibleEvents.length,
      detail: `${visibleEvents.filter((e) => e.status === "Open").length} live events`,
      icon: FiCalendar,
      accent: "from-cyan-400/20 to-cyan-400/5",
      iconStyle: "bg-cyan-400/15 text-cyan-300",
    },
    {
      label: "Tickets Sold",
      value: loading ? "..." : ticketsSold,
      detail: `${visibleTickets.length} booking records`,
      icon: FiTag,
      accent: "from-amber-400/20 to-amber-400/5",
      iconStyle: "bg-amber-400/15 text-amber-300",
    },
    {
      label: "Attendance Rate",
      value: loading ? "..." : `${attendanceRate}%`,
      detail: "Marked as attended",
      icon: FiBarChart2,
      accent: "from-emerald-400/20 to-emerald-400/5",
      iconStyle: "bg-emerald-400/15 text-emerald-300",
    },
    {
      label: "Total Revenue",
      value: loading ? "..." : formatRevenue(totalRevenue),
      detail: `${visibleTickets.length} bookings`,
      icon: FiDollarSign,
      accent: "from-rose-400/20 to-rose-400/5",
      iconStyle: "bg-rose-400/15 text-rose-300",
    },
    
  ];
  // const metrics = [
  //   {
  //     label: "Total Revenue",
  //     value: loading ? "..." : formatRevenue(totalRevenue),
  //     sub: `${visibleTickets.length} bookings`,
  //     icon: FiDollarSign,
  //     accent: "text-rose-400",

  //     bg: "bg-rose-500/10",
  //          iconStyle: "bg-rose-400/15 text-rose-300",
  //   },
  //   {
  //     label: "Tickets Sold",
  //     value: loading ? "..." : ticketsSold,
  //     sub: "All ticket quantities",
  //     icon: FiDollarSign,
  //     accent: "text-yellow-400",
  //     bg: "bg-yellow-500/10",
  //     iconStyle: "bg-yellow-400/15 text-yellow-300",
  //   },
  //   {
  //     label: "Attendance Rate",
  //     value: loading ? "..." : `${attendanceRate}%`,
  //     sub: "Marked as attended",
  //     icon: FiDollarSign,
  //     accent: "text-green-400",
  //     bg: "bg-green-500/10",
  //     iconStyle: "bg-green-400/15 text-green-300",
  //   },
  //   {
  //     label: "Active Users",
  //     value: loading
  //       ? "..."
  //       : currentUser?.role === "Admin"
  //       ? users.length
  //       : new Set(visibleTickets.map((ticket) => ticket.userId)).size,
  //     sub: `${visibleEvents.filter((e) => e.status === "Open").length} live events`,
  //     accent: "text-violet-400",
  //     bg: "bg-violet-500/10",
  //     iconStyle: "bg-violet-400/15 text-violet-300",
  //   },
  // ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Analytics</h1>
        <p className="mt-2 text-gray-400">
          Revenue, ticket sales, attendance, and event performance
        </p>
      </div>
{/* 
      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`rounded-2xl border border-white/10 p-6 ${metric.bg}`}
          >
            <p className="text-sm text-gray-400">{metric.label}</p>
            <h2 className={`mt-3 text-3xl font-bold ${metric.accent}`}>
              {metric.value}
            </h2>
            <p className="mt-2 text-sm text-gray-300">{metric.sub}</p>
          </div>
        ))}
      </div> */}
      
      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card chart-card lg:col-span-2">
          <div className="card-header">
            <div className="card-title">Revenue Overview</div>
            <div className="tab-bar">
              <button
                className={`tab ${revenueTab === "weekly" ? "active" : ""}`}
                onClick={() => setRevenueTab("weekly")}
              >
                Weekly
              </button>
              <button
                className={`tab ${revenueTab === "monthly" ? "active" : ""}`}
                onClick={() => setRevenueTab("monthly")}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="chart-wrapper">
            <Bar data={revenueChart} options={barOptions} />
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Events by Category</h3>
          </div>
          <div className="chart-wrapper doughnut-wrapper">
            <Doughnut
              data={categoryChart}
              options={{
                ...doughnutOptions,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card chart-card lg:col-span-2">
          <div className="card-header">
            <h3 className="card-title">Top Events by Ticket Sales</h3>
          </div>
          <div className="chart-wrapper" style={{ minHeight: 280 }}>
            <Bar data={topEventsChart} options={horizontalBarOptions} />
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Attendance Status</h3>
          </div>
          <div className="chart-wrapper doughnut-wrapper">
            <Doughnut
              data={attendanceChart}
              options={{
                ...doughnutOptions,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Event Status Breakdown</h3>
          </div>
          <div className="chart-wrapper doughnut-wrapper">
            <Doughnut
              data={eventStatusChart}
              options={{
                ...doughnutOptions,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Performance Summary</h3>
          </div>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-gray-400">Total events</td>
                <td className="font-semibold text-white">
                  {loading ? "..." : visibleEvents.length}
                </td>
              </tr>
              <tr>
                <td className="text-gray-400">Pending approval</td>
                <td className="font-semibold text-yellow-400">
                  {loading
                    ? "..."
                    : visibleEvents.filter((e) => e.status === "Pending").length}
                </td>
              </tr>
              <tr>
                <td className="text-gray-400">Live events</td>
                <td className="font-semibold text-green-400">
                  {loading
                    ? "..."
                    : visibleEvents.filter((e) => e.status === "Open").length}
                </td>
              </tr>
              <tr>
                <td className="text-gray-400">Draft / rejected</td>
                <td className="font-semibold text-gray-300">
                  {loading
                    ? "..."
                    : visibleEvents.filter(
                        (e) =>
                          e.status === "Draft" || e.status === "Rejected"
                      ).length}
                </td>
              </tr>
              <tr>
                <td className="text-gray-400">Avg. order value</td>
                <td className="font-semibold text-rose-400">
                  {loading || visibleTickets.length === 0
                    ? "..."
                    : formatRevenue(totalRevenue / visibleTickets.length)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

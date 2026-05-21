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
} from "../lib/dashboardStats";

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
    dispatch(fetchUsers());
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const totalRevenue = useMemo(
    () => tickets.reduce((sum, t) => sum + ticketAmount(t), 0),
    [tickets]
  );

  const ticketsSold = useMemo(
    () => tickets.reduce((sum, t) => sum + t.quantity, 0),
    [tickets]
  );

  const attendanceRate = useMemo(() => {
    if (tickets.length === 0) return 0;
    const attended = tickets.filter(
      (t) => t.attendanceStatus === "Attended"
    ).length;
    return Math.round((attended / tickets.length) * 100);
  }, [tickets]);

  const revenueChart = useMemo(
    () => buildRevenueChart(tickets, revenueTab),
    [tickets, revenueTab]
  );

  const categoryChart = useMemo(
    () => buildCategoryChart(events),
    [events]
  );

  const attendanceChart = useMemo(
    () => buildAttendanceChart(tickets),
    [tickets]
  );

  const eventStatusChart = useMemo(
    () => buildEventStatusChart(events),
    [events]
  );

  const topEventsChart = useMemo(
    () => buildTopEventsChart(tickets, events),
    [tickets, events]
  );

  const loading = eventsLoading || ticketsLoading || usersLoading;

  const metrics = [
    {
      label: "Total Revenue",
      value: loading ? "..." : formatRevenue(totalRevenue),
      sub: `${tickets.length} bookings`,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      label: "Tickets Sold",
      value: loading ? "..." : ticketsSold,
      sub: "All ticket quantities",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Attendance Rate",
      value: loading ? "..." : `${attendanceRate}%`,
      sub: "Marked as attended",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Active Users",
      value: loading ? "..." : users.length,
      sub: `${events.filter((e) => e.status === "Open").length} live events`,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Analytics</h1>
        <p className="mt-2 text-gray-400">
          Revenue, ticket sales, attendance, and event performance
        </p>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`rounded-2xl border border-white/10 p-6 ${metric.bg}`}
          >
            <p className="text-sm text-gray-400">{metric.label}</p>
            <h2 className={`mt-3 text-3xl font-bold ${metric.color}`}>
              {metric.value}
            </h2>
            <p className="mt-2 text-sm text-gray-300">{metric.sub}</p>
          </div>
        ))}
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
                  {loading ? "..." : events.length}
                </td>
              </tr>
              <tr>
                <td className="text-gray-400">Pending approval</td>
                <td className="font-semibold text-yellow-400">
                  {loading
                    ? "..."
                    : events.filter((e) => e.status === "Pending").length}
                </td>
              </tr>
              <tr>
                <td className="text-gray-400">Live events</td>
                <td className="font-semibold text-green-400">
                  {loading
                    ? "..."
                    : events.filter((e) => e.status === "Open").length}
                </td>
              </tr>
              <tr>
                <td className="text-gray-400">Draft / rejected</td>
                <td className="font-semibold text-gray-300">
                  {loading
                    ? "..."
                    : events.filter(
                        (e) =>
                          e.status === "Draft" || e.status === "Rejected"
                      ).length}
                </td>
              </tr>
              <tr>
                <td className="text-gray-400">Avg. order value</td>
                <td className="font-semibold text-rose-400">
                  {loading || tickets.length === 0
                    ? "..."
                    : formatRevenue(totalRevenue / tickets.length)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

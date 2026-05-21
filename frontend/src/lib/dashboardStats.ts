import type { EventItem } from "../store/slices/eventSlice";
import type { TicketItem } from "../store/slices/ticketSlice";

export const DAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatRevenue = (amount: number) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${Math.round(amount)}`;
};

export const ticketAmount = (ticket: TicketItem) =>
  ticket.price * ticket.quantity;

export const buildRevenueChart = (
  tickets: TicketItem[],
  tab: "weekly" | "monthly"
) => {
  if (tab === "weekly") {
    const buckets = Array(7).fill(0);
    const now = new Date();

    tickets.forEach((ticket) => {
      const purchaseDate = new Date(ticket.purchaseDate);
      const diffDays = Math.floor(
        (now.getTime() - purchaseDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (diffDays >= 0 && diffDays < 7) {
        const dayIndex =
          (purchaseDate.getDay() + 7 - diffDays) % 7;
        buckets[dayIndex] += ticketAmount(ticket);
      }
    });

    return {
      labels: DAY_LABELS,
      datasets: [
        {
          label: "Revenue (₹)",
          data: buckets,
          backgroundColor: "rgba(139, 92, 246, 0.6)",
          borderRadius: 6,
        },
      ],
    };
  }

  const buckets = Array(6).fill(0);
  const now = new Date();

  tickets.forEach((ticket) => {
    const purchaseDate = new Date(ticket.purchaseDate);
    const monthDiff =
      (now.getFullYear() - purchaseDate.getFullYear()) * 12 +
      (now.getMonth() - purchaseDate.getMonth());

    if (monthDiff >= 0 && monthDiff < 6) {
      const index = 5 - monthDiff;
      buckets[index] += ticketAmount(ticket);
    }
  });

  return {
    labels: MONTH_LABELS.slice(-6),
    datasets: [
      {
        label: "Revenue (₹)",
        data: buckets,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderRadius: 6,
      },
    ],
  };
};

export const buildCategoryChart = (events: EventItem[]) => {
  const counts: Record<string, number> = {};

  events.forEach((event) => {
    const category = event.category || "Other";
    counts[category] = (counts[category] || 0) + 1;
  });

  const labels = Object.keys(counts);

  return {
    labels: labels.length ? labels : ["No events"],
    datasets: [
      {
        label: "Events",
        data: labels.length
          ? labels.map((label) => counts[label])
          : [1],
        backgroundColor: [
          "rgb(139, 92, 246)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(255, 99, 132)",
          "rgb(16, 185, 129)",
          "rgb(244, 114, 182)",
        ],
        hoverOffset: 4,
      },
    ],
  };
};

export const buildAttendanceChart = (tickets: TicketItem[]) => {
  const counts = {
    Booked: 0,
    Attended: 0,
    "Not Arrived": 0,
  };

  tickets.forEach((ticket) => {
    const status = ticket.attendanceStatus || "Booked";
    if (status in counts) {
      counts[status as keyof typeof counts] += 1;
    } else {
      counts.Booked += 1;
    }
  });

  return {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Attendance",
        data: Object.values(counts),
        backgroundColor: [
          "rgb(255, 205, 86)",
          "rgb(16, 185, 129)",
          "rgb(255, 99, 132)",
        ],
        hoverOffset: 4,
      },
    ],
  };
};

export const buildEventStatusChart = (events: EventItem[]) => {
  const counts: Record<string, number> = {
    Open: 0,
    Pending: 0,
    Draft: 0,
    Rejected: 0,
  };

  events.forEach((event) => {
    if (event.status in counts) {
      counts[event.status] += 1;
    }
  });

  return {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Events",
        data: Object.values(counts),
        backgroundColor: [
          "rgb(16, 185, 129)",
          "rgb(255, 205, 86)",
          "rgb(148, 163, 184)",
          "rgb(255, 99, 132)",
        ],
        hoverOffset: 4,
      },
    ],
  };
};

export const buildTopEventsChart = (
  tickets: TicketItem[],
  events: EventItem[]
) => {
  const salesByEvent: Record<string, number> = {};

  tickets.forEach((ticket) => {
    const key = ticket.eventName || ticket.eventId;
    salesByEvent[key] =
      (salesByEvent[key] || 0) + ticket.quantity;
  });

  const sorted = Object.entries(salesByEvent)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (sorted.length === 0) {
    const openEvents = events
      .filter((e) => e.status === "Open")
      .slice(0, 5);

    return {
      labels: openEvents.map((e) => e.title),
      datasets: [
        {
          label: "Tickets sold",
          data: openEvents.map((e) => e.sold || 0),
          backgroundColor: "rgba(244, 114, 182, 0.6)",
          borderRadius: 6,
        },
      ],
    };
  }

  return {
    labels: sorted.map(([name]) => name),
    datasets: [
      {
        label: "Tickets sold",
        data: sorted.map(([, qty]) => qty),
        backgroundColor: "rgba(244, 114, 182, 0.6)",
        borderRadius: 6,
      },
    ],
  };
};

export const getUpcomingOpenEvents = (events: EventItem[], limit = 5) =>
  [...events]
    .filter(
      (event) =>
        event.status === "Open" &&
        new Date(event.eventDateTime).getTime() >= Date.now()
    )
    .sort(
      (a, b) =>
        new Date(a.eventDateTime).getTime() -
        new Date(b.eventDateTime).getTime()
    )
    .slice(0, limit);

export const getUserUpcomingTickets = (
  tickets: TicketItem[],
  events: EventItem[]
) => {
  const now = Date.now();

  return tickets
    .map((ticket) => {
      const event = events.find((e) => e._id === ticket.eventId);
      return { ticket, event };
    })
    .filter(
      ({ event }) =>
        event?.eventDateTime &&
        new Date(event.eventDateTime).getTime() >= now
    )
    .sort(
      (a, b) =>
        new Date(a.event!.eventDateTime).getTime() -
        new Date(b.event!.eventDateTime).getTime()
    );
};

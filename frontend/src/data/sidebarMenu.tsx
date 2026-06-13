const adminRoles = ["Admin"];
const organizerRoles = ["Admin", "Event Organizer"];
const allRoles = ["Admin", "Event Organizer", "User"];
const userRoles = ["User"];
const browseRoles = ["Event Organizer", "User"];

export const menuSections = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", path: "/", icon: "📊", roles: allRoles },
      {
        name: "Analytics",
        path: "/analytics",
        icon: "📈",
        roles: organizerRoles,
      },
    ],
  },
  {
    title: "Events",
    items: [
      {
        name: "Browse Events",
        path: "/events",
        icon: "🎉",
        roles: browseRoles,
      },
      {
        name: "Create Event",
        path: "/create",
        icon: "✨",
        roles: organizerRoles,
      },
      {
        name: "Manage Schedules",
        path: "/schedule",
        icon: "📅",
        roles: organizerRoles,
      },
    ],
  },
  {
    title: "Commerce",
    items: [
      {
        name: "Buy Tickets",
        path: "/buyTickets",
        icon: "🎟️",
        roles: userRoles,
      },
      {
        name: "My Tickets",
        path: "/myTickets",
        icon: "🎫",
        roles: userRoles,
      },
      {
        name: "My Schedule",
        path: "/my-schedule",
        icon: "📅",
        roles: userRoles,
      },
      {
        name: "Attendees",
        path: "/attendees",
        icon: "👥",
        roles: organizerRoles,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        name: "User Details",
        path: "/user-details",
        icon: "👤",
        roles: allRoles,
      },
    ],
  },
  {
    title: "Admin",
    items: [
      // {
      //   name: "Admin Overview",
      //   path: "/admin",
      //   icon: "⚙️",
      //   roles: adminRoles,
      // },
      {
        name: "Event Approvals",
        path: "/admin/approvals",
        icon: "✅",
        roles: adminRoles,
      },
      {
        name: "Manage Events",
        path: "/admin/events",
        icon: "📅",
        roles: adminRoles,
      },
      {
        name: "Manage Users",
        path: "/admin/users",
        icon: "👤",
        roles: adminRoles,
      },
      {
        name: "Manage Bookings",
        path: "/admin/bookings",
        icon: "🎫",
        roles: adminRoles,
      },
    ],
  },
];

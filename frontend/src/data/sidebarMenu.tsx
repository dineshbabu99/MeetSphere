const adminRoles = [
  "Admin",
];

const organizerRoles = [
  "Admin",
  "Event Organizer",
];

const allRoles = [
  "Admin",
  "Event Organizer",
  "User",
];

const userRoles = [
  "User",
];

export const menuSections = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/",
         icon: "📊",
        roles: allRoles,
      },
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
         icon: "🎭",
        roles: allRoles,
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
        icon: "📋",
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
        badge: "3",
        roles: userRoles,
      },
      {
        name: "My Tickets",
        path: "/myTickets",
        icon: "🪪",
        roles: userRoles,
      },
      {
        name: "My Schedule",
        path: "/my-schedule",
        icon: "🗓️",
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
       icon: "⚙️",
        roles: allRoles,
      },
    ],
  },

  {
    title: "Admin",
    items: [
      {
        name: "Admin Panel",
        path: "/admin",
        icon: "⚙️",
        roles: adminRoles,
      },
    ],
  },
];

const adminRoles = [
  "SuperAdmin",
  "Admin",
];

const allRoles = [
  "SuperAdmin",
  "Admin",
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
        roles: adminRoles,
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
        roles: adminRoles,
      },
      {
        name: "Schedules",
        path: "/schedule",
        icon: "🗓️",
        roles: adminRoles,
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
        roles: allRoles,
      },
      {
        name: "My Tickets",
        path: "/myTickets",
        icon: "🪪",
        roles: allRoles,
      },
      {
        name: "Attendees",
        path: "/attendees",
        icon: "👥",
        roles: adminRoles,
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

const stats = [
  {
    title: "Pending Approvals",
    value: "7",
    sub: "⚠ Needs review",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    title: "Active Events",
    value: "18",
    sub: "↑ 3 this week",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Total Users",
    value: "3,241",
    sub: "↑ 89 new",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    title: "Support Tickets",
    value: "12",
    sub: "↓ 3 opened today",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
];

const approvals = [
  {
    event: "DJ Night Rooftop",
    organizer: "K. Park",
    requested: "2h ago",
  },
  {
    event: "Yoga Retreat 2025",
    organizer: "M. Gupta",
    requested: "5h ago",
  },
  {
    event: "Comedy Open Mic",
    organizer: "T. Brown",
    requested: "1d ago",
  },
  {
    event: "Web3 Hackathon",
    organizer: "A. Smith",
    requested: "2d ago",
  },
];

const users = [
  {
    name: "Sarah Chen",
    role: "Organizer",
    events: 12,
    status: "Active",
  },
  {
    name: "Tom Wilson",
    role: "Attendee",
    events: 3,
    status: "Active",
  },
  {
    name: "K. Park",
    role: "Organizer",
    events: 7,
    status: "Pending",
  },
  {
    name: "Priya Sharma",
    role: "Attendee",
    events: 8,
    status: "Suspended",
  },
];

const transactions = [
  {
    id: "#TXN-48291",
    user: "Sarah Chen",
    event: "TechSummit VIP",
    amount: "$349",
    method: "💳 Card",
    date: "Jan 6",
    status: "Success",
  },
  {
    id: "#TXN-48290",
    user: "Tom Wilson",
    event: "Music Fest GA",
    amount: "$89",
    method: "🍎 Apple Pay",
    date: "Jan 6",
    status: "Success",
  },
  {
    id: "#TXN-48289",
    user: "Jamie R.",
    event: "Startup Night",
    amount: "$49",
    method: "🅿️ PayPal",
    date: "Jan 5",
    status: "Pending",
  },
  {
    id: "#TXN-48288",
    user: "Marcus Lee",
    event: "Design Workshop",
    amount: "$75",
    method: "💳 Card",
    date: "Jan 4",
    status: "Refunded",
  },
];

export default function AdminDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
      case "Active":
        return "bg-green-500/20 text-green-400";

      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "Refunded":
      case "Suspended":
        return "bg-rose-500/20 text-rose-400";

      default:
        return "bg-white/10 text-white";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-400">
          Manage events, users, approvals,
          and platform health
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`rounded-2xl border border-white/10 p-6 ${stat.bg}`}
          >
            <p className="text-sm text-gray-400">
              {stat.title}
            </p>

            <h2
              className={`mt-3 text-4xl font-bold ${stat.color}`}
            >
              {stat.value}
            </h2>

            <p className="mt-3 text-sm text-gray-300">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Approvals */}
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
          
          <h2 className="mb-5 text-2xl font-bold text-white">
            ⏳ Pending Event Approvals
          </h2>

          <div className="overflow-x-auto">
            
            <table className="w-full">
              
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="pb-4">Event</th>
                  <th className="pb-4">Organizer</th>
                  <th className="pb-4">Requested</th>
                  <th className="pb-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {approvals.map((item) => (
                  <tr
                    key={item.event}
                    className="border-b border-white/5"
                  >
                    <td className="py-4 text-white">
                      {item.event}
                    </td>

                    <td className="py-4 text-gray-300">
                      {item.organizer}
                    </td>

                    <td className="py-4 text-gray-400">
                      {item.requested}
                    </td>

                    <td className="py-4">
                      
                      <div className="flex gap-2">
                        
                        <button className="rounded-lg bg-green-500/20 px-3 py-2 text-green-400 transition-all hover:bg-green-500/30">
                          ✓
                        </button>

                        <button className="rounded-lg bg-rose-500/20 px-3 py-2 text-rose-400 transition-all hover:bg-rose-500/30">
                          ✗
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users */}
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
          
          <h2 className="mb-5 text-2xl font-bold text-white">
            👥 User Management
          </h2>

          <div className="overflow-x-auto">
            
            <table className="w-full">
              
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="pb-4">User</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4">Events</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.name}
                    className="border-b border-white/5"
                  >
                    <td className="py-4 font-medium text-white">
                      {user.name}
                    </td>

                    <td className="py-4">
                      
                      <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-400">
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4 text-gray-300">
                      {user.events}
                    </td>

                    <td className="py-4">
                      
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="py-4">
                      
                      <button className="rounded-lg border border-white/10 bg-[var(--bg3)] px-3 py-2 text-sm text-gray-300 hover:bg-white/5">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
        
        <h2 className="mb-5 text-2xl font-bold text-white">
          💳 Payment Transactions Monitor
        </h2>

        <div className="overflow-x-auto">
          
          <table className="w-full">
            
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                <th className="pb-4">
                  Transaction ID
                </th>

                <th className="pb-4">User</th>

                <th className="pb-4">Event</th>

                <th className="pb-4">Amount</th>

                <th className="pb-4">Method</th>

                <th className="pb-4">Date</th>

                <th className="pb-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-white/5"
                >
                  <td className="py-4 text-xs text-gray-500">
                    {txn.id}
                  </td>

                  <td className="py-4 text-white">
                    {txn.user}
                  </td>

                  <td className="py-4 text-gray-300">
                    {txn.event}
                  </td>

                  <td className="py-4 font-semibold text-green-400">
                    {txn.amount}
                  </td>

                  <td className="py-4 text-gray-300">
                    {txn.method}
                  </td>

                  <td className="py-4 text-gray-400">
                    {txn.date}
                  </td>

                  <td className="py-4">
                    
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${getStatusColor(
                        txn.status
                      )}`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
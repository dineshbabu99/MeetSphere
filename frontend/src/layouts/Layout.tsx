import { Outlet, Link } from "react-router-dom";

export function Layout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-white">
      
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--bg2)]">
        
        <div className="border-b border-[var(--border)] px-6 py-6">
          <h1 className="text-3xl font-bold text-[var(--accent)]">
            MeetSphere
          </h1>
        </div>

        <nav className="mt-8 px-3">
          
          <p className="px-3 text-xs font-semibold uppercase tracking-[3px] text-gray-500">
            Overview
          </p>

          <ul className="mt-4 space-y-2">

            {/* Active */}
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 border-l-4 border-[var(--accent)] bg-[var(--bg3)] px-4 py-3 text-[var(--accent3)] transition-all"
              >
                📊 Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/analytics"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-all hover:bg-[var(--bg3)] hover:text-white"
              >
                📈 Analytics
              </Link>
            </li>

            <li>
              <Link
                to="/events"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-all hover:bg-[var(--bg3)] hover:text-white"
              >
                📅 Events
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        
        <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg2)] px-8 py-5">
          
          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-[var(--accent)]"></div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
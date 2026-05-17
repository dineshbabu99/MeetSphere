import { useLocation } from "react-router-dom";
import { sidebarMenu } from "../../data/sidebarMenu";

export default function Header() {
  const location = useLocation();

  const currentPage = sidebarMenu.find(
    (item) => item.path === location.pathname
  );

  return (
    <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg2)] px-8">
      
      <h2 className="text-3xl font-bold">
        {currentPage?.name || "MeetSphere"}
      </h2>

      <div className="flex items-center gap-3">
        
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="rounded-xl bg-[var(--bg3)] px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/5"
        >
          Logout
        </button>

        <div className="h-11 w-11 rounded-full bg-[var(--accent)]"></div>
      </div>
    </header>
  );
}
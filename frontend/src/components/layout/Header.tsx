import { useLocation } from "react-router-dom";

import { menuSections } from "../../data/sidebarMenu";

import { useAppDispatch } from "../../store/hooks";

import { logout } from "../../store/slices/authSlice";

export default function Header() {

  const location = useLocation();

  const dispatch = useAppDispatch();

  // Flatten menu items
  const allMenuItems =
    menuSections.flatMap(
      (section) => section.items
    );

  const currentPage =
    allMenuItems.find(
      (item) =>
        item.path ===
        location.pathname
    );

  const handleLogout = () => {

    dispatch(logout());

    window.location.href =
      "/login";
  };

  return (
    <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg2)] px-8">

      <h2 className="text-3xl font-bold text-white">
        {currentPage?.name ||
          "MeetSphere"}
      </h2>

      <div className="flex items-center gap-4">

        <button
          onClick={handleLogout}
          className="rounded-xl bg-[var(--bg3)] px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/5"
        >
          Logout
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
          MS
        </div>
      </div>
    </header>
  );
}
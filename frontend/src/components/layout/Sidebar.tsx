import { NavLink } from "react-router-dom";
import {menuSections} from "../../data/sidebarMenu"
import { useAppSelector } from "../../store/hooks";





export default function Sidebar() {
  const user = useAppSelector(
  (state) => state.auth.user 
);
  return (
    <aside className="w-64 overflow-y-auto border-r border-[#1c1c35] bg-[#070714]">
      
      <div className="border-b border-[#1c1c35] px-6 py-6">
        <h1 className="text-3xl font-bold text-violet-400">
          MeetSphere
        </h1>
      </div>

      {/* Sections */}
      <div className="space-y-10 px-4 py-8">
        
      {menuSections.map((section) => {
        // console.log(user);
  const filteredItems =
    section.items.filter((item) =>
      item.roles.includes(
        user?.role || "User"
      )
    );

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <div key={section.title}>

      <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[2px] text-violet-300/50">
        {section.title}
      </p>

      <ul className="space-y-2">

        {filteredItems.map((item) => (
          <li key={item.path}>

            <NavLink
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                  isActive
                    ? "border-l-4 border-violet-500 bg-violet-500/15 text-violet-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3">

                <span className="text-lg">
                  {item.icon}
                </span>

                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </div>

              {/* Badge */}
              {/* {item.badge && (
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-violet-500 px-2 text-xs font-bold text-white">
                  {item.badge}
                </span>
              )} */}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
})}
      </div>
    </aside>
  );
}
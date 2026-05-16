import { NavLink, Outlet } from "react-router-dom";
import { SETTINGS_NAV } from "../data/constants";

export default function SettingsLayout() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <aside className="lg:w-56 lg:shrink-0">
        <h2 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">Settings</h2>
        <p className="mb-4 text-sm text-slate-500">Manage your account, channels, and preferences.</p>
        <nav className="flex flex-row gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {SETTINGS_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.key}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex min-w-[140px] flex-col rounded-lg px-3 py-2.5 transition lg:min-w-0 ${
                    isActive
                      ? "bg-white shadow-card ring-1 ring-slate-200/90 dark:bg-slate-900 dark:ring-slate-700"
                      : "hover:bg-white/60 dark:hover:bg-slate-900/60"
                  }`
                }
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  <Icon size={16} className="text-slate-500" />
                  {item.label}
                </span>
                <span className="mt-0.5 hidden pl-6 text-xs text-slate-500 lg:block">{item.description}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}

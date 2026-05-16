import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, LogOut, Plus, Settings } from "lucide-react";
import { MAIN_NAV } from "../data/constants";
import { SOCIAL_PLATFORM_CONFIGS } from "../data/socialPlatforms";
import { useApp } from "../context/AppContext";

export default function Sidebar({ open, onClose, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { connectedAccounts } = useApp();

  const connectedChannels = connectedAccounts
    .filter((account) => account.isConnected)
    .map((account) => {
      const platformConfig = SOCIAL_PLATFORM_CONFIGS.find((p) => p.key === account.platform);
      const Icon = platformConfig?.icon;
      return {
        key: account.platform,
        label: platformConfig?.label || account.platform,
        path: `/connected-platforms/${account.platform}`,
        profileImage: account.profileImage,
        Icon,
      };
    });

  const settingsActive = location.pathname.startsWith("/settings");

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-sidebar flex-col border-r border-slate-200/90 bg-white shadow-sidebar transition-transform dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-slate-200/90 px-4 dark:border-slate-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-buffer-600 text-sm font-bold text-white">
            A
          </span>
          <span className="flex-1 text-base font-bold tracking-tight text-slate-900 dark:text-white">AntiSocial</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="border-b border-slate-200/90 p-3 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              navigate("/create-post");
              onClose?.();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-buffer-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-buffer-700"
          >
            <Plus size={18} strokeWidth={2.5} />
            Create post
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Menu</p>
          <ul className="space-y-0.5">
            {MAIN_NAV.map((route) => {
              const Icon = route.icon;
              return (
                <li key={route.key}>
                  <NavLink
                    to={route.path}
                    onClick={onClose}
                    className={({ isActive }) => `buffer-nav-item ${isActive ? "buffer-nav-active" : ""}`}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={18} strokeWidth={isActive ? 2.25 : 2} className="shrink-0 opacity-80" />
                        {route.label}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {connectedChannels.length > 0 ? (
            <div className="mt-6">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Your channels
              </p>
              <ul className="space-y-0.5">
                {connectedChannels.map((channel) => {
                  const Icon = channel.Icon;
                  return (
                    <li key={channel.key}>
                      <NavLink
                        to={channel.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                            isActive
                              ? "bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-white"
                              : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60"
                          }`
                        }
                      >
                        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                          {channel.profileImage ? (
                            <img src={channel.profileImage} alt="" className="h-full w-full object-cover" />
                          ) : Icon ? (
                            <Icon size={14} className="text-slate-600 dark:text-slate-300" />
                          ) : (
                            channel.label[0]
                          )}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{channel.label}</span>
                        <ChevronRight size={14} className="shrink-0 opacity-0 transition group-hover:opacity-50" />
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
              <NavLink
                to="/connected-platforms"
                onClick={onClose}
                className="mt-2 block px-3 text-xs font-medium text-buffer-700 hover:text-buffer-800 dark:text-buffer-400"
              >
                Manage all platforms
              </NavLink>
            </div>
          ) : (
            <div className="mx-1 mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/40">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">No channels yet</p>
              <p className="mt-1 text-[11px] text-slate-500">Connect accounts to publish everywhere.</p>
              <NavLink
                to="/connected-platforms"
                onClick={onClose}
                className="mt-2 inline-block text-xs font-semibold text-buffer-700 dark:text-buffer-400"
              >
                Connect platforms →
              </NavLink>
            </div>
          )}
        </nav>

        <div className="border-t border-slate-200/90 p-3 dark:border-slate-800">
          <NavLink
            to="/settings/account"
            onClick={onClose}
            className={`buffer-nav-item mb-1 ${settingsActive ? "buffer-nav-active" : ""}`}
          >
            <Settings size={18} className="shrink-0 opacity-80" />
            Settings
          </NavLink>
          <button type="button" onClick={onLogout} className="buffer-nav-item w-full text-left text-slate-500">
            <LogOut size={18} className="shrink-0 opacity-80" />
            Log out
          </button>
        </div>
      </aside>
      {open ? (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close overlay"
        />
      ) : null}
    </>
  );
}

import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, Moon, Plus, Sun, User } from "lucide-react";
import { getPageTitle } from "../data/constants";
import { useApp } from "../context/AppContext";

export default function Topbar({ onOpenSidebar }) {
  const { toggleTheme, theme } = useApp();
  const location = useLocation();
  const title = useMemo(() => getPageTitle(location.pathname), [location.pathname]);
  const showCreate = !location.pathname.startsWith("/create-post");
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {showCreate ? (
            <Link
              to="/create-post"
              className="hidden items-center gap-1.5 rounded-lg bg-buffer-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-buffer-700 sm:inline-flex"
            >
              <Plus size={16} strokeWidth={2.5} />
              New post
            </Link>
          ) : null}
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-buffer-500" />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <ThemeIcon size={18} />
          </button>
          <Link
            to="/settings/account"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Account settings"
          >
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}

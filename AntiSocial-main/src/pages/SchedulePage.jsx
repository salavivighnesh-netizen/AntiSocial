import { Link } from "react-router-dom";
import { CalendarDays, Filter, List, LayoutGrid } from "lucide-react";

const rows = [
  ["Spring launch - hero video", "Instagram, Facebook", "Apr 3, 2026 - 10:00 AM UTC", "scheduled"],
  ["Community question thread", "X, Threads", "Apr 4, 2026 - 9:00 AM UTC", "scheduled"],
  ["Hiring: Senior designer", "LinkedIn", "Apr 5, 2026 - 8:30 AM UTC", "published"],
  ["Weekend promo - 20% off", "X, Telegram", "Apr 6, 2026 - 6:00 PM UTC", "publishing"],
  ["April location update", "Google Business", "Apr 7, 2026 - 1:00 PM UTC", "failed"],
];

const statusClass = {
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  scheduled: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  publishing: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  published: "bg-buffer-50 text-buffer-800 dark:bg-buffer-500/15 dark:text-buffer-300",
  failed: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  "partially published": "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
};

export default function SchedulePage() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Queue</h2>
          <p className="text-sm text-slate-500">All scheduled posts across your connected channels.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
          >
            <Filter size={14} />
            All channels
          </button>
          <div className="flex rounded-lg border border-slate-300 p-0.5 dark:border-slate-600">
            <button type="button" className="rounded-md bg-slate-100 p-2 dark:bg-slate-800" aria-label="List view">
              <List size={14} />
            </button>
            <button type="button" className="rounded-md p-2 text-slate-400" aria-label="Calendar view">
              <LayoutGrid size={14} />
            </button>
          </div>
          <Link
            to="/create-post"
            className="inline-flex items-center gap-1.5 rounded-lg bg-buffer-600 px-3 py-2 text-xs font-semibold text-white hover:bg-buffer-700"
          >
            <CalendarDays size={14} />
            Schedule post
          </Link>
        </div>
      </div>

      <article className="buffer-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                <th className="p-4 font-semibold">Post</th>
                <th className="p-4 font-semibold">Channels</th>
                <th className="p-4 font-semibold">Scheduled</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="border-b border-slate-100 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/30">
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{row[0]}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{row[1]}</td>
                  <td className="p-4 text-slate-500">{row[2]}</td>
                  <td className="p-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClass[row[3]] || ""}`}>
                      {row[3]}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button type="button" className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                      Edit
                    </button>
                    <button type="button" className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

import { Link } from "react-router-dom";
import { CalendarDays, PenSquare, Radio, ArrowRight, Clock3, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

const queuePreview = [
  { title: "Spring launch — hero video", channels: "Instagram, Facebook", time: "Today, 10:00 AM", status: "scheduled" },
  { title: "Community question thread", channels: "X, Threads", time: "Tomorrow, 9:00 AM", status: "scheduled" },
  { title: "Hiring: Senior designer", channels: "LinkedIn", time: "Apr 5, 8:30 AM", status: "draft" },
];

const statusStyles = {
  scheduled: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  published: "bg-buffer-50 text-buffer-800 dark:bg-buffer-500/15 dark:text-buffer-300",
};

export default function DashboardPage() {
  const { connectedAccounts, user } = useApp();
  const connectedCount = connectedAccounts.filter((a) => a.isConnected).length;
  const firstName = (user.name || "there").split(" ")[0];

  return (
    <div className="space-y-8">
      <header className="buffer-card p-6 sm:p-8">
        <p className="text-sm font-medium text-buffer-700 dark:text-buffer-400">Welcome back</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">Hi {firstName}, plan your week</h2>
        <p className="mt-2 max-w-xl text-sm text-slate-500">
          Buffer-style home: see your queue, connect channels, and jump into publishing.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/create-post"
            className="inline-flex items-center gap-2 rounded-lg bg-buffer-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-buffer-700"
          >
            <PenSquare size={16} />
            Create
          </Link>
          <Link
            to="/channels"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Radio size={16} />
            {connectedCount > 0 ? "Manage channels" : "Connect channels"}
          </Link>
        </div>
      </header>

      <section aria-label="Overview stats" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Connected channels", value: connectedCount, icon: Radio, to: "/channels" },
          { label: "Scheduled this week", value: "12", icon: CalendarDays, to: "/schedule" },
          { label: "Posts published", value: "48", icon: CheckCircle2, to: "/schedule" },
          { label: "In queue", value: "3", icon: Clock3, to: "/schedule" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.to} className="buffer-card group p-4 transition hover:ring-2 hover:ring-buffer-200 dark:hover:ring-buffer-500/30">
              <div className="flex items-center justify-between">
                <Icon size={18} className="text-slate-400 group-hover:text-buffer-600" />
                <ArrowRight size={14} className="text-slate-300 opacity-0 transition group-hover:opacity-100" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            </Link>
          );
        })}
      </section>

      <section aria-label="Queue and actions" className="grid gap-6 lg:grid-cols-5">
        <article className="buffer-card lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Publishing queue</h3>
              <p className="text-xs text-slate-500">Upcoming posts across all channels</p>
            </div>
            <Link to="/schedule" className="text-xs font-semibold text-buffer-700 hover:text-buffer-800 dark:text-buffer-400">
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {queuePreview.map((post) => (
              <li key={post.title} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{post.title}</p>
                  <p className="text-xs text-slate-500">{post.channels}</p>
                </div>
                <span className="text-xs text-slate-500">{post.time}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusStyles[post.status]}`}>
                  {post.status}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="buffer-card lg:col-span-2">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">Quick actions</h3>
          </div>
          <ul className="p-3 space-y-1">
            {[
              { label: "Create post", desc: "Compose and publish to multiple channels", to: "/create-post", icon: PenSquare },
              { label: "Schedule post", desc: "Queue content for later", to: "/schedule/new", icon: CalendarDays },
              { label: "View scheduled", desc: "Your scheduled queue", to: "/schedule", icon: CalendarDays },
              { label: "Channel settings", desc: "Connections and OAuth", to: "/settings/channels", icon: Radio },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </span>
                    <ArrowRight size={14} className="shrink-0 text-slate-400" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </article>
      </section>

      {connectedCount === 0 ? (
        <div className="buffer-card flex flex-col items-start gap-3 border-buffer-200 bg-buffer-50/40 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-buffer-500/20 dark:bg-buffer-500/5">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Connect your first channel</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Link Instagram, LinkedIn, X, and more to start scheduling from one place.
            </p>
          </div>
          <Link
            to="/channels"
            className="inline-flex items-center gap-2 rounded-lg bg-buffer-600 px-4 py-2 text-sm font-semibold text-white hover:bg-buffer-700"
          >
            Connect channels
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

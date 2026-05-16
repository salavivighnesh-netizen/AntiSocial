import { ChevronRight, CheckCircle2 } from "lucide-react";
import ConnectionStatusBadge from "./ConnectionStatusBadge";

const PLATFORM_ACCENTS = {
  facebook: "from-blue-600/20 to-blue-900/40 ring-blue-500/30",
  instagram: "from-fuchsia-600/20 to-purple-900/40 ring-fuchsia-500/30",
  threads: "from-slate-500/20 to-slate-900/40 ring-slate-400/30",
  linkedin: "from-sky-600/20 to-blue-900/40 ring-sky-500/30",
  youtube: "from-red-600/20 to-red-900/40 ring-red-500/30",
  x: "from-slate-600/20 to-slate-900/40 ring-slate-400/30",
  reddit: "from-orange-600/20 to-orange-900/40 ring-orange-500/30",
  pinterest: "from-rose-600/20 to-rose-900/40 ring-rose-500/30",
  telegram: "from-cyan-600/20 to-cyan-900/40 ring-cyan-500/30",
  discord: "from-indigo-600/20 to-indigo-900/40 ring-indigo-500/30",
  googleBusiness: "from-emerald-600/20 to-emerald-900/40 ring-emerald-500/30",
};

export default function ConnectedChannelProfileCard({ platformConfig, account, onOpen, onDisconnect }) {
  const Icon = platformConfig?.icon;
  const platformKey = platformConfig?.key || account.platform;
  const accent = PLATFORM_ACCENTS[platformKey] || PLATFORM_ACCENTS.threads;
  const displayName = account?.accountName || account?.username || platformConfig?.label || "Connected";
  const handle = account?.username ? `@${account.username.replace(/^@/, "")}` : null;
  const profileImage = account?.profileImage || `https://placehold.co/160x160/1e293b/94a3b8?text=${encodeURIComponent((displayName[0] || "?").toUpperCase())}`;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-b ${accent} p-4 shadow-lg ring-1 transition hover:-translate-y-1 hover:shadow-xl hover:ring-white/20`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full flex-col items-center text-center outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 rounded-xl"
      >
        <div className="relative mb-3">
          <img
            src={profileImage}
            alt={displayName}
            className="h-20 w-20 rounded-full border-2 border-white/20 object-cover shadow-md ring-2 ring-white/10"
          />
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-blue-300 shadow">
            {Icon ? <Icon size={14} /> : null}
          </span>
          {account?.isConnected ? (
            <span className="absolute -left-0.5 -top-0.5 rounded-full bg-emerald-500 p-0.5 text-white shadow">
              <CheckCircle2 size={12} strokeWidth={2.5} />
            </span>
          ) : null}
        </div>

        <p className="line-clamp-1 w-full text-sm font-semibold text-white">{displayName}</p>
        {handle ? <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{handle}</p> : null}
        <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">{platformConfig?.label}</p>

        <div className="mt-3 flex items-center gap-1">
          <ConnectionStatusBadge isConnected />
        </div>

        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-300 opacity-80 transition group-hover:opacity-100">
          View profile
          <ChevronRight size={14} className="transition group-hover:translate-x-0.5" />
        </span>
      </button>

      {typeof onDisconnect === "function" ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDisconnect();
          }}
          className="absolute right-2 top-2 rounded-md border border-slate-600/80 bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-slate-400 opacity-0 transition hover:border-red-500/50 hover:text-red-300 group-hover:opacity-100"
        >
          Disconnect
        </button>
      ) : null}
    </article>
  );
}

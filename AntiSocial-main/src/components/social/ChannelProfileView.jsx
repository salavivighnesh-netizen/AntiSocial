import { useMemo } from "react";
import { Building2, Calendar, CheckCircle2, Link2, User, Video, AlertTriangle } from "lucide-react";
import { SOCIAL_PLATFORM_CONFIGS } from "../../data/socialPlatforms";
import ConnectionStatusBadge from "./ConnectionStatusBadge";
import TokenExpiryWarning from "./TokenExpiryWarning";
import AccountSyncInfo from "./AccountSyncInfo";

const PLATFORM_COVER = {
  instagram: "from-fuchsia-600/40 via-purple-900/60 to-slate-900",
  facebook: "from-blue-600/40 via-blue-900/60 to-slate-900",
  threads: "from-slate-500/30 via-slate-800/80 to-slate-900",
  linkedin: "from-sky-600/40 via-blue-900/60 to-slate-900",
  youtube: "from-red-600/40 via-red-950/60 to-slate-900",
  x: "from-slate-600/40 via-slate-900 to-black",
  telegram: "from-cyan-600/30 via-slate-900 to-slate-950",
  discord: "from-indigo-600/40 via-indigo-950/60 to-slate-900",
  googleBusiness: "from-emerald-600/30 via-slate-900 to-slate-950",
  pinterest: "from-rose-600/30 via-slate-900 to-slate-950",
  reddit: "from-orange-600/30 via-slate-900 to-slate-950",
};

function entityIcon(type) {
  if (type === "page" || type === "organization") return Building2;
  if (type === "channel") return Video;
  return User;
}

function pickBio(account) {
  const m = account?.metadata || {};
  return m.biography || m.bio || m.description || m.threads_biography || m.about || "";
}

export default function ChannelProfileView({ account, platformKey, capabilities = [], postCount = null }) {
  const platformConfig = SOCIAL_PLATFORM_CONFIGS.find((p) => p.key === platformKey);
  const Icon = platformConfig?.icon;
  const cover = PLATFORM_COVER[platformKey] || PLATFORM_COVER.threads;
  const displayName = account?.accountName || account?.username || platformConfig?.label || "Profile";
  const handle = account?.username ? `@${String(account.username).replace(/^@/, "")}` : null;
  const profileImage =
    account?.profileImage ||
    `https://placehold.co/200x200/1e293b/94a3b8?text=${encodeURIComponent((displayName[0] || "?").toUpperCase())}`;
  const bio = pickBio(account);
  const entities = Array.isArray(account?.entities) ? account.entities : [];
  const connectedSince = account?.createdAt || account?.lastSyncedAt;

  const stats = useMemo(
    () => [
      { label: "Posts", value: postCount != null ? String(postCount) : "—" },
      { label: "Targets", value: String(entities.length || 1) },
      {
        label: "Type",
        value: account?.entityType ? account.entityType.charAt(0).toUpperCase() + account.entityType.slice(1) : "Profile",
      },
    ],
    [postCount, entities.length, account?.entityType]
  );

  return (
    <div className="space-y-5">
      <article className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/80 shadow-xl">
        <div className={`relative h-32 bg-gradient-to-r sm:h-40 ${cover}`} />
        <div className="relative px-5 pb-5">
          <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative shrink-0">
                <img
                  src={profileImage}
                  alt={displayName}
                  className="h-24 w-24 rounded-2xl border-4 border-slate-900 object-cover shadow-lg sm:h-28 sm:w-28"
                />
                {Icon ? (
                  <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-blue-300 shadow">
                    <Icon size={16} />
                  </span>
                ) : null}
              </div>
              <div className="min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-bold text-white sm:text-2xl">{displayName}</h2>
                  <ConnectionStatusBadge isConnected />
                </div>
                {handle ? <p className="text-sm text-slate-400">{handle}</p> : null}
                <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {platformConfig?.label}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {capabilities.slice(0, 3).map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-slate-600 bg-slate-950/60 px-2.5 py-1 text-[10px] font-semibold text-slate-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {bio ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">{bio}</p> : null}

          <div className="mt-5 grid grid-cols-3 gap-3 border-y border-slate-700/80 py-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2 text-sm text-slate-400 md:grid-cols-2">
            <p className="flex items-center gap-2">
              <Link2 size={14} className="shrink-0 text-slate-500" />
              <span>
                <span className="text-slate-500">ID </span>
                {account?.platformUserId || "—"}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Calendar size={14} className="shrink-0 text-slate-500" />
              <span>
                {connectedSince
                  ? `Synced ${new Date(account.lastSyncedAt || connectedSince).toLocaleDateString()}`
                  : "Sync date unknown"}
              </span>
            </p>
          </div>

          <div className="mt-3 space-y-1">
            <TokenExpiryWarning account={account} />
            <AccountSyncInfo account={account} />
          </div>
        </div>
      </article>

      {entities.length > 0 ? (
        <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
          <h3 className="text-sm font-semibold text-white">Linked accounts & pages</h3>
          <p className="mt-1 text-xs text-slate-500">Profiles, pages, and channels available for posting</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entities.map((entity) => {
              const EIcon = entityIcon(entity.entityType);
              return (
                <li
                  key={entity.entityId || entity.id || entity.accountName}
                  className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-950/50 p-3"
                >
                  <img
                    src={entity.profileImage || profileImage}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-lg border border-slate-600 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-slate-100">
                      <EIcon size={12} className="shrink-0 text-slate-500" />
                      {entity.accountName || entity.name || entity.username || "Untitled"}
                    </p>
                    <p className="truncate text-xs text-slate-500 capitalize">{entity.entityType || "account"}</p>
                  </div>
                  {entity.isConnected !== false ? (
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                  ) : (
                    <AlertTriangle size={16} className="shrink-0 text-amber-400" />
                  )}
                </li>
              );
            })}
          </ul>
        </article>
      ) : null}

      <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
        <h3 className="text-sm font-semibold text-white">Connection details</h3>
        <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="mt-0.5 text-slate-200">{account?.email || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Entity ID</dt>
            <dd className="mt-0.5 break-all text-slate-200">{account?.entityId || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Scopes</dt>
            <dd className="mt-0.5 text-slate-200">
              {Array.isArray(account?.scopes) && account.scopes.length ? account.scopes.join(", ") : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Last updated</dt>
            <dd className="mt-0.5 text-slate-200">
              {account?.updatedAt ? new Date(account.updatedAt).toLocaleString() : "—"}
            </dd>
          </div>
        </dl>
      </article>
    </div>
  );
}

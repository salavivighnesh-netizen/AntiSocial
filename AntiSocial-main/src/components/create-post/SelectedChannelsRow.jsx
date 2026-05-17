import { SOCIAL_PLATFORM_CONFIGS } from "../../data/socialPlatforms";

const PLATFORM_AVATAR_RING = {
  instagram: "ring-pink-500",
  threads: "ring-slate-900 dark:ring-slate-300",
  linkedin: "ring-[#0a66c2]",
  facebook: "ring-[#1877f2]",
  x: "ring-slate-900 dark:ring-slate-200",
  youtube: "ring-red-600",
  pinterest: "ring-red-700",
  tiktok: "ring-slate-900 dark:ring-slate-200",
};

function ChannelAvatar({ platformKey, account }) {
  const platformConfig = SOCIAL_PLATFORM_CONFIGS.find((c) => c.key === platformKey);
  const Icon = platformConfig?.icon;
  const displayName = account?.accountName || account?.username || platformConfig?.label || "?";
  const profileImage =
    account?.profileImage ||
    `https://placehold.co/80x80/1e293b/94a3b8?text=${encodeURIComponent((displayName[0] || "?").toUpperCase())}`;
  const ringClass = PLATFORM_AVATAR_RING[platformKey] || "ring-buffer-500";

  return (
    <span
      title={`${displayName} · ${platformConfig?.label || platformKey}`}
      className="relative shrink-0"
    >
      <img
        src={profileImage}
        alt=""
        className={`h-11 w-11 rounded-xl object-cover ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ${ringClass}`}
      />
      {Icon ? (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white dark:border-slate-900">
          <Icon size={11} />
        </span>
      ) : null}
    </span>
  );
}

export default function SelectedChannelsRow({
  selectedChannelKeys,
  connectedByPlatform,
  variant = "default",
}) {
  if (!selectedChannelKeys.length) return null;

  const isHeader = variant === "header";

  return (
    <div
      className={
        isHeader
          ? "flex flex-wrap items-center gap-1 px-5 py-3"
          : "flex flex-wrap items-center border-b border-slate-100 px-5 py-4 dark:border-slate-800"
      }
    >
      {selectedChannelKeys.map((key, index) => (
        <span
          key={key}
          className={`inline-flex ${index > 0 ? "-ml-1.5" : ""}`}
          style={{ zIndex: selectedChannelKeys.length - index }}
        >
          <ChannelAvatar platformKey={key} account={connectedByPlatform[key]} />
        </span>
      ))}
    </div>
  );
}

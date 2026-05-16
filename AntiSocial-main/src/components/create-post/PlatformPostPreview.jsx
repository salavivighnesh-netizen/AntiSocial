import { useEffect, useMemo } from "react";
import { Info } from "lucide-react";
import { SOCIAL_PLATFORM_CONFIGS } from "../../data/socialPlatforms";
import { getPlatformComposerConfig } from "../../data/platformComposerConfig";

const PREVIEW_THEMES = {
  x: {
    card: "rounded-2xl",
    header: "pb-0",
    caption: "text-[15px] leading-snug",
    media: "rounded-2xl border border-slate-200 dark:border-slate-700",
  },
  instagram: {
    media: "aspect-square",
    caption: "text-xs",
  },
  linkedin: {
    card: "rounded-lg",
    caption: "text-sm leading-relaxed",
  },
  youtube: {
    media: "aspect-video rounded-lg",
    caption: "text-xs text-slate-500",
  },
  threads: {
    card: "rounded-xl",
    caption: "text-sm",
  },
};

function getPreviewTheme(platformKey) {
  return PREVIEW_THEMES[platformKey] || {};
}

export default function PlatformPostPreview({ platformKey, account, draft }) {
  const platformConfig = SOCIAL_PLATFORM_CONFIGS.find((c) => c.key === platformKey);
  const composerConfig = getPlatformComposerConfig(platformKey);
  const theme = getPreviewTheme(platformKey);
  const displayName = account?.accountName || account?.username || platformConfig?.label || "Channel";
  const profileImage =
    account?.profileImage ||
    `https://placehold.co/48x48/1e293b/94a3b8?text=${encodeURIComponent((displayName[0] || "?").toUpperCase())}`;

  const mediaPreviewUrl = useMemo(() => (draft?.file ? URL.createObjectURL(draft.file) : null), [draft?.file]);

  useEffect(() => {
    return () => {
      if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    };
  }, [mediaPreviewUrl]);

  const caption = draft?.caption?.trim() || "";
  const mediaUrl = draft?.mediaUrl?.trim() || "";
  const hasMedia = Boolean(mediaPreviewUrl || mediaUrl);
  const hasContent = Boolean(caption || hasMedia || draft?.youtubeTitle?.trim() || draft?.linkUrl?.trim());
  const isVideo =
    draft?.file?.type?.startsWith("video/") || /\.(mp4|mov|webm|m4v)(\?|#|$)/i.test(mediaUrl);

  const cardClass = theme.card || "rounded-xl";
  const mediaClass = theme.media || "aspect-square";

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-xl bg-slate-100/80 p-5 dark:bg-slate-950/60">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {platformConfig?.label || platformKey} preview
        <Info size={14} className="text-slate-400" title="Approximate layout on this platform" />
      </h3>

      <article
        className={`mx-auto w-full max-w-xs overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 ${cardClass} ${
          hasContent ? "" : "opacity-95"
        }`}
      >
        <div className={`flex items-center gap-2 border-b border-slate-100 px-3 py-2.5 dark:border-slate-800 ${theme.header || ""}`}>
          <img src={profileImage} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">{displayName}</p>
            <p className="text-[10px] text-slate-500">{platformConfig?.label}</p>
          </div>
        </div>

        {platformKey === "youtube" && draft?.youtubeTitle?.trim() ? (
          <p className="border-b border-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
            {draft.youtubeTitle}
          </p>
        ) : null}

        {hasMedia ? (
          <div className={`bg-slate-100 dark:bg-slate-800 ${mediaClass}`}>
            {mediaPreviewUrl && isVideo ? (
              <video src={mediaPreviewUrl} className="h-full w-full object-cover" muted playsInline controls />
            ) : mediaPreviewUrl ? (
              <img src={mediaPreviewUrl} alt="" className="h-full w-full object-cover" />
            ) : isVideo ? (
              <video src={mediaUrl} className="h-full w-full object-cover" muted playsInline controls />
            ) : (
              <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
            )}
          </div>
        ) : !hasContent ? (
          <div className={`mx-3 mt-3 ${mediaClass} rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900`} />
        ) : null}

        {caption ? (
          <p className={`whitespace-pre-wrap px-3 py-2.5 text-slate-800 dark:text-slate-100 ${theme.caption || "text-xs"}`}>
            {caption}
          </p>
        ) : !hasContent ? (
          <p className="px-3 py-3 text-center text-xs text-slate-400">
            Your {platformConfig?.label || "post"} will appear here as you write
          </p>
        ) : (
          <p className="px-3 pb-2 text-[10px] text-slate-400">Add a caption in the composer</p>
        )}

        {draft?.linkUrl?.trim() && platformKey === "facebook" ? (
          <div className="mx-3 mb-3 truncate rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] text-buffer-700 dark:border-slate-700 dark:bg-slate-950">
            {draft.linkUrl}
          </div>
        ) : null}

        {draft?.firstComment?.trim() && composerConfig.showFirstComment ? (
          <p className="border-t border-slate-100 px-3 py-2 text-[10px] text-slate-500 dark:border-slate-800">
            First comment: {draft.firstComment}
          </p>
        ) : null}
      </article>

      {!hasContent ? (
        <p className="mt-3 text-center text-xs text-slate-500">
          Select a channel and add text or media to see a live preview
        </p>
      ) : null}
    </div>
  );
}



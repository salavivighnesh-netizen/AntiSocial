import { useEffect, useMemo } from "react";
import { Info } from "lucide-react";
import { SOCIAL_PLATFORM_CONFIGS } from "../../data/socialPlatforms";

export default function PlatformPostPreview({ platformKey, account, draft }) {
  const platformConfig = SOCIAL_PLATFORM_CONFIGS.find((c) => c.key === platformKey);
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

  const hasContent = Boolean(draft?.caption?.trim() || draft?.file || draft?.mediaUrl?.trim());

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-xl bg-slate-100/80 p-5 dark:bg-slate-950/60">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {platformConfig?.label || platformKey} preview
        <Info size={14} className="text-slate-400" />
      </h3>

      {!hasContent ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-4 w-32 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-2 h-20 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-1.5">
              <div className="h-2 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-2 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
          <p className="text-sm text-slate-500">See your post&apos;s preview here</p>
        </div>
      ) : (
        <article className="mx-auto w-full max-w-xs overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 dark:border-slate-800">
            <img src={profileImage} alt="" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-xs font-semibold text-slate-900 dark:text-white">{displayName}</span>
          </div>
          {(mediaPreviewUrl || draft.mediaUrl) && (
            <div className="aspect-square bg-slate-100 dark:bg-slate-800">
              {mediaPreviewUrl && draft.file?.type?.startsWith("video/") ? (
                <video src={mediaPreviewUrl} className="h-full w-full object-cover" muted playsInline />
              ) : mediaPreviewUrl ? (
                <img src={mediaPreviewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <img src={draft.mediaUrl} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          )}
          {draft.caption?.trim() ? (
            <p className="whitespace-pre-wrap px-3 py-2 text-xs text-slate-800 dark:text-slate-100">{draft.caption}</p>
          ) : null}
        </article>
      )}
    </div>
  );
}

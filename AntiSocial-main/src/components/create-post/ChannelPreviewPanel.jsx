import { useMemo } from "react";
import { SOCIAL_PLATFORM_CONFIGS } from "../../data/socialPlatforms";
import { buildDraftFromShared } from "../../utils/sharedPostSync";
import PlatformPostPreview from "./PlatformPostPreview";

export default function ChannelPreviewPanel({
  selectedChannelKeys,
  previewChannelKey,
  onPreviewChannelChange,
  connectedByPlatform,
  sharedCaption = "",
  sharedFile = null,
  drafts = {},
  className = "",
}) {
  const activeKey =
    previewChannelKey && selectedChannelKeys.includes(previewChannelKey)
      ? previewChannelKey
      : selectedChannelKeys[0] || "";

  const previewDraft = useMemo(() => {
    if (!activeKey) return null;
    const channelDraft = drafts[activeKey];
    return buildDraftFromShared(activeKey, {
      caption: sharedCaption || channelDraft?.caption || "",
      file: sharedFile || channelDraft?.file || null,
      mediaUrl: channelDraft?.mediaUrl || "",
    });
  }, [activeKey, sharedCaption, sharedFile, drafts]);

  if (!selectedChannelKeys.length || !activeKey) return null;

  return (
    <aside className={`flex min-h-[320px] flex-col ${className}`}>
      {selectedChannelKeys.length > 1 ? (
        <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Preview channel">
          {selectedChannelKeys.map((key) => {
            const config = SOCIAL_PLATFORM_CONFIGS.find((c) => c.key === key);
            const Icon = config?.icon;
            const isActive = key === activeKey;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onPreviewChannelChange?.(key)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "border-buffer-400 bg-buffer-50 text-buffer-800 dark:border-buffer-500/50 dark:bg-buffer-500/15 dark:text-buffer-200"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {Icon ? <Icon size={14} /> : null}
                {config?.label || key}
              </button>
            );
          })}
        </div>
      ) : null}

      <PlatformPostPreview
        platformKey={activeKey}
        account={connectedByPlatform[activeKey]}
        draft={previewDraft}
      />
    </aside>
  );
}

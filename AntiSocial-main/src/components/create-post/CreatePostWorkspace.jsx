import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SOCIAL_PLATFORM_CONFIGS } from "../../data/socialPlatforms";
import { createEmptyChannelDraft } from "../../data/platformComposerConfig";
import { getSharedCaptionLimit, syncSharedToAllDrafts } from "../../utils/sharedPostSync";
import { publishToAllChannels } from "../../utils/publishAllChannels";
import PlatformComposerCard from "./PlatformComposerCard";
import PlatformPostPreview from "./PlatformPostPreview";
import PostIdeasPanel from "./PostIdeasPanel";
import SharedPostComposer from "./SharedPostComposer";

export default function CreatePostWorkspace({
  selectedChannelKeys,
  connectedByPlatform,
  drafts,
  onDraftChange,
  onSetDrafts,
  onRemoveChannel,
  onBack,
}) {
  const navigate = useNavigate();
  const { setToast, refreshConnectedAccounts } = useApp();
  const [activeChannel, setActiveChannel] = useState(selectedChannelKeys[0] || "");
  const [showPreview, setShowPreview] = useState(true);
  const [showPerChannel, setShowPerChannel] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [ideaTopic, setIdeaTopic] = useState("");
  const [sharedCaption, setSharedCaption] = useState("");
  const [sharedFile, setSharedFile] = useState(null);
  const [publishResults, setPublishResults] = useState(null);

  const captionLimit = getSharedCaptionLimit(selectedChannelKeys);
  const activeDraft = drafts[activeChannel];
  const activeAccount = connectedByPlatform[activeChannel];

  const applyCaption = (text) => {
    setSharedCaption((text || "").slice(0, captionLimit));
    if (activeChannel) {
      onDraftChange(activeChannel, { caption: (text || "").slice(0, captionLimit), error: "" });
    }
  };

  const handlePostToAll = async () => {
    if (!sharedCaption.trim() && !sharedFile) {
      setToast({ message: "Add a caption or media before posting.", error: true });
      return;
    }

    setPublishing(true);
    setPublishResults(null);

    const shared = { caption: sharedCaption, file: sharedFile, mediaUrl: "" };
    const synced = syncSharedToAllDrafts(selectedChannelKeys, shared);
    onSetDrafts(synced);

    try {
      const { ok, failed, skipped } = await publishToAllChannels(selectedChannelKeys, shared);

      setPublishResults({ ok, failed, skipped });
      failed.forEach(({ platformKey, message }) => {
        onDraftChange(platformKey, { error: message });
      });

      if (ok.length) {
        setSharedCaption("");
        setSharedFile(null);
        const labels = ok
          .map(({ platformKey }) => SOCIAL_PLATFORM_CONFIGS.find((c) => c.key === platformKey)?.label || platformKey)
          .join(", ");
        setToast({
          message:
            ok.length === selectedChannelKeys.length
              ? `Posted to all ${ok.length} channel(s): ${labels}.`
              : `Posted to ${ok.length} channel(s): ${labels}.`,
        });
        try {
          await refreshConnectedAccounts();
        } catch {
          /* non-fatal */
        }
        const cleared = {};
        selectedChannelKeys.forEach((key) => {
          cleared[key] = createEmptyChannelDraft(key);
        });
        onSetDrafts(cleared);
      }

      if (failed.length && !ok.length) {
        setToast({ message: "Could not post to any channel. See errors below.", error: true });
      } else if (failed.length) {
        setToast({
          message: `${failed.length} channel(s) failed. Expand per-channel cards to review.`,
          error: true,
        });
      }

      if (skipped.length && !ok.length && !failed.length) {
        setToast({ message: "Selected channels are not supported for one-click post yet.", error: true });
      }
    } catch (err) {
      setToast({ message: err?.message || "One-click publish failed.", error: true });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-8rem)] flex-col">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={16} />
            Channels
          </button>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create post</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium ${
            showPreview
              ? "border-buffer-300 bg-buffer-50 text-buffer-800 dark:border-buffer-500/40 dark:bg-buffer-500/10 dark:text-buffer-300"
              : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
          }`}
        >
          {showPreview ? <Eye size={16} /> : <EyeOff size={16} />}
          Preview
        </button>
      </header>

      <div className={`grid flex-1 gap-5 ${showPreview ? "xl:grid-cols-[1fr_280px_320px]" : "xl:grid-cols-[1fr_280px]"}`}>
        <div className="space-y-4">
          <SharedPostComposer
            caption={sharedCaption}
            file={sharedFile}
            captionLimit={captionLimit}
            selectedChannelKeys={selectedChannelKeys}
            publishing={publishing}
            onCaptionChange={setSharedCaption}
            onFileChange={setSharedFile}
            onPostToAll={handlePostToAll}
          />

          {publishResults && (publishResults.failed.length > 0 || publishResults.skipped.length > 0) ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
              {publishResults.failed.length > 0 ? (
                <ul className="list-inside list-disc space-y-1">
                  {publishResults.failed.map(({ platformKey, message }) => (
                    <li key={platformKey}>
                      <strong>{SOCIAL_PLATFORM_CONFIGS.find((c) => c.key === platformKey)?.label || platformKey}:</strong>{" "}
                      {message}
                    </li>
                  ))}
                </ul>
              ) : null}
              {publishResults.skipped.length > 0 ? (
                <p className="mt-2 text-xs opacity-90">
                  Skipped: {publishResults.skipped.map((s) => s.platformKey).join(", ")} (use channel page).
                </p>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setShowPerChannel((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Customize per channel (optional)
            {showPerChannel ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showPerChannel
            ? selectedChannelKeys.map((platformKey) => (
                <PlatformComposerCard
                  key={platformKey}
                  platformKey={platformKey}
                  account={connectedByPlatform[platformKey]}
                  draft={drafts[platformKey] || createEmptyChannelDraft(platformKey)}
                  isActive={activeChannel === platformKey}
                  onFocus={() => setActiveChannel(platformKey)}
                  onChange={(patch) => onDraftChange(platformKey, patch)}
                  onRemove={() => onRemoveChannel(platformKey)}
                />
              ))
            : null}
        </div>

        <PostIdeasPanel
          caption={sharedCaption || activeDraft?.caption || ""}
          onApplyCaption={applyCaption}
          selectedPlatform={activeChannel}
          topic={ideaTopic}
          onTopicChange={setIdeaTopic}
        />

        {showPreview && activeChannel ? (
          <PlatformPostPreview
            platformKey={activeChannel}
            account={activeAccount}
            draft={{
              ...(drafts[activeChannel] || createEmptyChannelDraft(activeChannel)),
              caption: sharedCaption || drafts[activeChannel]?.caption,
              file: sharedFile || drafts[activeChannel]?.file,
            }}
          />
        ) : null}
      </div>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <p className="text-xs text-slate-500">One upload · parallel publish to every selected channel</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("/schedule")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-600"
          >
            <CalendarDays size={16} />
            Schedule
          </button>
        </div>
      </footer>
    </section>
  );
}

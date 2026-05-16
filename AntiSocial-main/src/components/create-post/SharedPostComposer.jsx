import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, Send, Sparkles } from "lucide-react";
import { SOCIAL_PLATFORM_CONFIGS } from "../../data/socialPlatforms";

export default function SharedPostComposer({
  caption,
  file,
  captionLimit,
  selectedChannelKeys,
  publishing,
  onCaptionChange,
  onFileChange,
  onPostToAll,
}) {
  const fileInputRef = useRef(null);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const channelLabels = selectedChannelKeys
    .map((key) => SOCIAL_PLATFORM_CONFIGS.find((c) => c.key === key)?.label || key)
    .join(", ");

  const canPost = Boolean(caption.trim() || file);

  return (
    <article className="buffer-card overflow-hidden border-2 border-buffer-200 dark:border-buffer-500/30">
      <div className="border-b border-buffer-100 bg-buffer-50/60 px-4 py-3 dark:border-buffer-500/20 dark:bg-buffer-500/5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-buffer-600 dark:text-buffer-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Write once, post everywhere</h3>
              <p className="text-xs text-slate-500">
                {selectedChannelKeys.length} channel{selectedChannelKeys.length === 1 ? "" : "s"}: {channelLabels}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={publishing || !canPost || !selectedChannelKeys.length}
            onClick={onPostToAll}
            className="inline-flex items-center gap-2 rounded-lg bg-buffer-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-buffer-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
            {publishing ? "Posting…" : `Post to all (${selectedChannelKeys.length})`}
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <textarea
          rows={4}
          maxLength={captionLimit}
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Write your post once — we'll adapt it for each channel"
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-buffer-500 focus:ring-2 focus:ring-buffer-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Caption is trimmed per channel (e.g. 280 on X, 500 on Threads)</span>
          <span>
            {caption.length} / {captionLimit}
          </span>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/80 py-6 transition hover:border-buffer-400 dark:border-slate-700 dark:bg-slate-950/50"
        >
          {previewUrl && file ? (
            file.type?.startsWith("video/") ? (
              <video src={previewUrl} className="max-h-36 w-full rounded-md object-contain" controls muted />
            ) : (
              <img src={previewUrl} alt="" className="max-h-36 w-full rounded-md object-contain" />
            )
          ) : (
            <>
              <ImagePlus size={26} className="text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Add photo or video (shared across channels)</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
        </div>
        {file ? (
          <button type="button" onClick={() => onFileChange(null)} className="text-xs font-medium text-slate-500 hover:text-slate-700">
            Remove media
          </button>
        ) : null}
      </div>
    </article>
  );
}

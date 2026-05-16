import { Check } from "lucide-react";
import ChannelPreviewPanel from "./ChannelPreviewPanel";

export default function ChannelPickerStep({
  connectedPlatformConfigs,
  connectedByPlatform,
  selectedKeys,
  previewChannelKey,
  onPreviewChannelChange,
  onToggle,
  onSelectAll,
  onClearAll,
  onContinue,
}) {
  const canContinue = selectedKeys.length > 0;
  const allSelected = connectedPlatformConfigs.length > 0 && selectedKeys.length === connectedPlatformConfigs.length;

  return (
    <section className={`mx-auto space-y-6 ${selectedKeys.length ? "max-w-6xl" : "max-w-3xl"}`}>
      <header>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Create post</h2>
        <p className="mt-1 text-sm text-slate-500">
          Select channels, then write once and post to all with one click.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            disabled={allSelected}
            className="text-xs font-semibold text-buffer-700 hover:text-buffer-800 disabled:opacity-50 dark:text-buffer-400"
          >
            Select all
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={onClearAll}
            disabled={!selectedKeys.length}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </header>

      <motion className={`grid gap-5 ${selectedKeys.length ? "lg:grid-cols-[1fr_320px]" : ""}`}>
        <motion>
      <div className="grid gap-3 sm:grid-cols-2">
        {connectedPlatformConfigs.map((platformConfig) => {
          const Icon = platformConfig.icon;
          const isSelected = selectedKeys.includes(platformConfig.key);
          return (
            <button
              key={platformConfig.key}
              type="button"
              onClick={() => {
                onPreviewChannelChange?.(platformConfig.key);
                onToggle(platformConfig.key);
              }}
              className={`buffer-card flex items-center gap-4 p-4 text-left transition ring-2 ${
                isSelected
                  ? "border-buffer-400 ring-buffer-200 dark:border-buffer-500/50 dark:ring-buffer-500/30"
                  : "ring-transparent hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  isSelected ? "bg-buffer-100 text-buffer-700 dark:bg-buffer-500/20 dark:text-buffer-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                }`}
              >
                <Icon size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">{platformConfig.label}</p>
                <p className="text-xs text-slate-500">{platformConfig.hint}</p>
              </span>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  isSelected ? "border-buffer-600 bg-buffer-600 text-white" : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {isSelected ? <Check size={14} /> : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="rounded-lg bg-buffer-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-buffer-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue ({selectedKeys.length} channel{selectedKeys.length === 1 ? "" : "s"})
        </button>
      </div>
    </section>
  );
}

import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PlatformBrandIcon from "./PlatformBrandIcon";
import { isPlatformConnectTemporarilyDisabled } from "../../data/socialPlatforms";

export default function ConnectChannelModal({
  open,
  onClose,
  platforms = [],
  connectedKeys = new Set(),
  processingPlatform = "",
  onSelectPlatform,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="connect-channel-title"
            className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700/80 dark:bg-[#1a1a1a]"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <header className="relative border-b border-slate-100 px-6 py-5 dark:border-slate-800">
              <h2
                id="connect-channel-title"
                className="text-center text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
              >
                Connect a New Channel
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </header>

            <div className="max-h-[min(70vh,520px)] overflow-y-auto px-5 py-6 sm:px-6">
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {platforms.map((platform) => {
                  const isConnected = connectedKeys.has(platform.key);
                  const isDisabled = isPlatformConnectTemporarilyDisabled(platform.key);
                  const isProcessing = processingPlatform === platform.key;
                  const subtitle = platform.connectSubtitle || platform.hint;

                  return (
                    <button
                      key={platform.key}
                      type="button"
                      disabled={isConnected || isDisabled || Boolean(processingPlatform)}
                      onClick={() => onSelectPlatform?.(platform.key)}
                      className={`group flex flex-col items-center gap-2.5 rounded-xl px-2 py-4 text-center transition ${
                        isConnected || isDisabled
                          ? "cursor-not-allowed opacity-45"
                          : "hover:bg-slate-50 dark:hover:bg-white/5"
                      } ${isProcessing ? "ring-2 ring-buffer-500/50" : ""}`}
                    >
                      <span className="relative">
                        <PlatformBrandIcon platformKey={platform.key} size="lg" />
                        {isProcessing ? (
                          <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
                            <Loader2 size={22} className="animate-spin text-white" />
                          </span>
                        ) : null}
                      </span>
                      <span className="w-full min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {platform.label.replace(/ \(Twitter\)/, "")}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                          {isConnected ? "Connected" : isDisabled ? "Coming soon" : subtitle}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

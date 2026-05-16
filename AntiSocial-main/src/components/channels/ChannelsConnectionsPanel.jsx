import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import SocialAccountCard from "../social/SocialAccountCard";
import ConnectedChannelProfileCard from "../social/ConnectedChannelProfileCard";
import DisconnectConfirmationDialog from "../social/DisconnectConfirmationDialog";
import { useSocialConnections } from "../../hooks/useSocialConnections";
import { useApp } from "../../context/AppContext";
import { SOCIAL_PLATFORM_CONFIGS } from "../../data/socialPlatforms";

export default function ChannelsConnectionsPanel({ variant = "channels", showHeader = true }) {
  const navigate = useNavigate();
  const { setToast, refreshConnectedAccounts } = useApp();
  const {
    accounts,
    accountsByPlatform,
    availablePlatforms,
    temporarilyDisabledPlatforms,
    summary,
    loadingAccounts,
    processingPlatform,
    disconnectDialog,
    setDisconnectDialog,
    oauthBanner,
    connectPlatform,
    reconnectPlatform,
    disconnectPlatform,
  } = useSocialConnections({ setToast, refreshConnectedAccounts });

  const openDetails = (platformKey) => navigate(`/connected-platforms/${platformKey}`);

  const connectedForGrid = useMemo(
    () =>
      accounts
        .filter((item) => item.isConnected)
        .map((account) => ({
          account,
          platformConfig: SOCIAL_PLATFORM_CONFIGS.find((p) => p.key === account.platform),
        }))
        .filter((item) => item.platformConfig),
    [accounts]
  );

  const platformsToConnect = useMemo(
    () => availablePlatforms.filter((p) => !accountsByPlatform[p.key]?.isConnected),
    [availablePlatforms, accountsByPlatform]
  );

  return (
    <section className="space-y-6">
      {showHeader ? (
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {variant === "settings" ? "Channels & connections" : "Channels"}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Connect social profiles and manage publishing access. Each channel syncs posts, analytics, and scheduling.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-buffer-50 px-3 py-1 text-xs font-semibold text-buffer-700 dark:bg-buffer-500/15 dark:text-buffer-300">
              {summary.totalConnected} connected
            </span>
            {summary.reconnectRequired > 0 ? (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                {summary.reconnectRequired} need reconnect
              </span>
            ) : null}
          </div>
        </header>
      ) : null}

      {oauthBanner ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            oauthBanner.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
          }`}
        >
          {oauthBanner.message}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Connected</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{summary.totalConnected}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Available to add</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{summary.pendingPlatforms}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Action needed</p>
          <p className="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400">{summary.reconnectRequired}</p>
        </div>
      </div>

      {!loadingAccounts && connectedForGrid.length > 0 ? (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">Your connected channels</h2>
          <p className="mb-4 text-xs text-slate-500">Profile view — click to manage</p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {connectedForGrid.map(({ account, platformConfig }) => (
              <ConnectedChannelProfileCard
                key={platformConfig.key}
                platformConfig={platformConfig}
                account={account}
                onOpen={() => openDetails(platformConfig.key)}
                onDisconnect={() => setDisconnectDialog({ open: true, platform: platformConfig.key })}
              />
            ))}
          </div>
        </article>
      ) : null}

      {platformsToConnect.length > 0 ? (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Available channels</h2>
              <p className="mt-0.5 text-xs text-slate-500">OAuth and bot-based connections supported per platform.</p>
            </div>
            <Plus size={18} className="text-buffer-600" />
          </div>
          {loadingAccounts ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-44 animate-pulse rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {platformsToConnect.map((platform) => (
                <SocialAccountCard
                  key={platform.key}
                  variant="buffer"
                  platformConfig={platform}
                  account={accountsByPlatform[platform.key] || { platform: platform.key, isConnected: false }}
                  isProcessing={processingPlatform === platform.key}
                  onConnect={() => connectPlatform(platform.key)}
                  onReconnect={() => reconnectPlatform(platform.key)}
                  onDisconnect={() => setDisconnectDialog({ open: true, platform: platform.key })}
                  onOpenDetails={() => openDetails(platform.key)}
                />
              ))}
            </div>
          )}
        </article>
      ) : null}

      {temporarilyDisabledPlatforms.length > 0 ? (
        <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-900/50">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Temporarily unavailable</h2>
          <p className="mb-4 mt-1 text-xs text-slate-500">New connections are paused for these platforms.</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {temporarilyDisabledPlatforms.map((platform) => (
              <SocialAccountCard
                key={platform.key}
                variant="buffer"
                platformConfig={platform}
                account={accountsByPlatform[platform.key] || { platform: platform.key, isConnected: false }}
                isProcessing={processingPlatform === platform.key}
                connectTemporarilyDisabled
                onConnect={() => connectPlatform(platform.key)}
                onReconnect={() => reconnectPlatform(platform.key)}
                onDisconnect={() => setDisconnectDialog({ open: true, platform: platform.key })}
                onOpenDetails={() => openDetails(platform.key)}
              />
            ))}
          </div>
        </article>
      ) : null}

      {!loadingAccounts && !accounts.some((item) => item.isConnected) ? (
        <div className="flex items-start gap-3 rounded-xl border border-buffer-200 bg-buffer-50/50 p-4 dark:border-buffer-500/20 dark:bg-buffer-500/5">
          <AlertCircle className="mt-0.5 shrink-0 text-buffer-600" size={18} />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">No channels connected yet</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Connect at least one channel to publish, schedule, and view analytics.
            </p>
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        <DisconnectConfirmationDialog
          open={disconnectDialog.open}
          platformLabel={disconnectDialog.platform}
          loading={!!processingPlatform}
          onCancel={() => setDisconnectDialog({ open: false, platform: "" })}
          onConfirm={disconnectPlatform}
        />
      </AnimatePresence>
    </section>
  );
}

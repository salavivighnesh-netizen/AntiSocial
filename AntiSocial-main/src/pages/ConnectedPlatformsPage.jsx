import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Plus } from "lucide-react";
import {
  SOCIAL_PLATFORM_CONFIGS,
  PLATFORM_CAPABILITY_MATRIX,
  isPlatformConnectTemporarilyDisabled,
} from "../data/socialPlatforms";
import {
  disconnectSocial,
  getSocialOAuthErrorMessage,
  manualConnectSocial,
  refreshSocial,
  startSocialConnect,
} from "../services/socialApi";
import SocialAccountCard from "../components/social/SocialAccountCard";
import ConnectedChannelProfileCard from "../components/social/ConnectedChannelProfileCard";
import DisconnectConfirmationDialog from "../components/social/DisconnectConfirmationDialog";
import { useApp } from "../context/AppContext";

export default function ConnectedPlatformsPage() {
  const navigate = useNavigate();
  const { setToast, refreshConnectedAccounts } = useApp();
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [processingPlatform, setProcessingPlatform] = useState("");
  const [disconnectDialog, setDisconnectDialog] = useState({ open: false, platform: "" });

  const accountsByPlatform = useMemo(
    () => accounts.reduce((acc, item) => ({ ...acc, [item.platform]: item }), {}),
    [accounts]
  );

  const connectedChannels = useMemo(() => {
    return accounts
      .filter((item) => item.isConnected)
      .map((account) => ({
        account,
        platformConfig: SOCIAL_PLATFORM_CONFIGS.find((p) => p.key === account.platform),
      }))
      .filter((item) => item.platformConfig);
  }, [accounts]);

  const { availablePlatforms, temporarilyDisabledPlatforms } = useMemo(() => {
    const available = [];
    const disabled = [];
    for (const platform of SOCIAL_PLATFORM_CONFIGS) {
      if (isPlatformConnectTemporarilyDisabled(platform.key)) disabled.push(platform);
      else available.push(platform);
    }
    return { availablePlatforms: available, temporarilyDisabledPlatforms: disabled };
  }, []);

  const platformsToConnect = useMemo(
    () => availablePlatforms.filter((p) => !accountsByPlatform[p.key]?.isConnected),
    [availablePlatforms, accountsByPlatform]
  );

  const disabledStillConnected = useMemo(
    () =>
      temporarilyDisabledPlatforms
        .filter((p) => accountsByPlatform[p.key]?.isConnected)
        .map((platformConfig) => ({
          account: accountsByPlatform[platformConfig.key],
          platformConfig,
        })),
    [temporarilyDisabledPlatforms, accountsByPlatform]
  );

  const allConnectedForGrid = useMemo(
    () => [...connectedChannels, ...disabledStillConnected],
    [connectedChannels, disabledStillConnected]
  );

  async function loadAccounts() {
    setLoadingAccounts(true);
    try {
      const data = await refreshConnectedAccounts();
      setAccounts(data);
    } catch (error) {
      setToast({ message: error.message || "Unable to load connected accounts.", error: true });
    } finally {
      setLoadingAccounts(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  const connectPlatform = async (platform) => {
    if (isPlatformConnectTemporarilyDisabled(platform)) {
      setToast({ message: "Connecting to this platform is temporarily unavailable.", error: true });
      return;
    }
    const capability = PLATFORM_CAPABILITY_MATRIX[platform];
    setProcessingPlatform(platform);
    try {
      if (capability?.oauth === false) {
        await manualConnectSocial(platform);
        await loadAccounts();
        setToast({ message: `${platform} connected via manual bot setup.` });
        return;
      }
      const data = await startSocialConnect(platform);
      window.location.href = data.url;
    } catch (error) {
      setToast({ message: error.message || `Failed to connect ${platform}.`, error: true });
    } finally {
      setProcessingPlatform("");
    }
  };

  const reconnectPlatform = async (platform) => {
    if (isPlatformConnectTemporarilyDisabled(platform)) {
      setToast({ message: "Reconnect is temporarily unavailable for this platform.", error: true });
      return;
    }
    setProcessingPlatform(platform);
    try {
      const result = await refreshSocial(platform);
      if (!result.refreshed) {
        await connectPlatform(platform);
        return;
      }
      await loadAccounts();
      setToast({ message: `${platform} token refreshed.` });
    } catch {
      await connectPlatform(platform);
    } finally {
      setProcessingPlatform("");
    }
  };

  const disconnectPlatform = async () => {
    const platform = disconnectDialog.platform;
    setProcessingPlatform(platform);
    try {
      await disconnectSocial(platform);
      await loadAccounts();
      setToast({ message: `${platform} disconnected.` });
    } catch (error) {
      setToast({ message: error.message || `Failed to disconnect ${platform}.`, error: true });
    } finally {
      setDisconnectDialog({ open: false, platform: "" });
      setProcessingPlatform("");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const platform = params.get("social_platform");
    const status = params.get("social_status");
    const reason = params.get("reason");
    if (!platform || !status) return;
    if (status === "connected") {
      setToast({ message: `${platform} connected successfully.` });
      loadAccounts();
    } else {
      setToast({ message: getSocialOAuthErrorMessage(reason, platform), error: true });
    }
    params.delete("social_platform");
    params.delete("social_status");
    params.delete("reason");
    window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }, [setToast]);

  return (
    <section className="space-y-6">
      <article className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-slate-900/90 via-slate-900 to-blue-950/60 p-5 shadow-2xl backdrop-blur-xl">
        <h1 className="text-xl font-semibold text-white">Connected Platforms</h1>
        <p className="mt-1 text-sm text-slate-300">
          {allConnectedForGrid.length > 0
            ? `${allConnectedForGrid.length} channel${allConnectedForGrid.length === 1 ? "" : "s"} connected`
            : "Link your social profiles to publish and schedule from one place."}
        </p>
      </article>

      {loadingAccounts ? (
        <article className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Your channels</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-44 animate-pulse rounded-2xl border border-slate-700 bg-slate-900/60" />
            ))}
          </div>
        </article>
      ) : allConnectedForGrid.length > 0 ? (
        <article className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-white">Your connected channels</h2>
              <p className="mt-0.5 text-xs text-slate-400">Profile view — click a card to manage or post</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              {allConnectedForGrid.length} active
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {allConnectedForGrid.map(({ account, platformConfig }) => (
              <ConnectedChannelProfileCard
                key={platformConfig.key}
                platformConfig={platformConfig}
                account={account}
                onOpen={() => navigate(`/connected-platforms/${platformConfig.key}`)}
                onDisconnect={() => setDisconnectDialog({ open: true, platform: platformConfig.key })}
              />
            ))}
          </div>
        </article>
      ) : null}

      {!loadingAccounts && platformsToConnect.length > 0 ? (
        <article className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-white">Add a channel</h2>
              <p className="mt-0.5 text-xs text-slate-400">Connect more platforms to expand your reach</p>
            </div>
            <Plus size={18} className="text-blue-400" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {platformsToConnect.map((platform) => (
              <SocialAccountCard
                key={platform.key}
                platformConfig={platform}
                account={accountsByPlatform[platform.key] || { platform: platform.key, isConnected: false }}
                isProcessing={processingPlatform === platform.key}
                onConnect={() => connectPlatform(platform.key)}
                onReconnect={() => reconnectPlatform(platform.key)}
                onDisconnect={() => setDisconnectDialog({ open: true, platform: platform.key })}
                onOpenDetails={() => navigate(`/connected-platforms/${platform.key}`)}
              />
            ))}
          </div>
        </article>
      ) : null}

      {!loadingAccounts && temporarilyDisabledPlatforms.some((p) => !accountsByPlatform[p.key]?.isConnected) ? (
        <article className="rounded-2xl border border-slate-600/50 bg-slate-900/50 p-5">
          <h2 className="text-sm font-semibold text-slate-200">Temporarily unavailable</h2>
          <p className="mb-4 mt-1 text-xs text-slate-500">New connections are disabled for these platforms for now.</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {temporarilyDisabledPlatforms
              .filter((p) => !accountsByPlatform[p.key]?.isConnected)
              .map((platform) => (
                <SocialAccountCard
                  key={platform.key}
                  platformConfig={platform}
                  account={accountsByPlatform[platform.key] || { platform: platform.key, isConnected: false }}
                  isProcessing={processingPlatform === platform.key}
                  connectTemporarilyDisabled
                  onConnect={() => connectPlatform(platform.key)}
                  onReconnect={() => reconnectPlatform(platform.key)}
                  onDisconnect={() => setDisconnectDialog({ open: true, platform: platform.key })}
                  onOpenDetails={() => navigate(`/connected-platforms/${platform.key}`)}
                />
              ))}
          </div>
        </article>
      ) : null}

      {!loadingAccounts && !accounts.some((item) => item.isConnected) ? (
        <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <AlertCircle className="text-slate-300" size={18} />
          <p className="text-sm text-slate-300">No channels connected yet. Pick a platform below to connect your first profile.</p>
        </div>
      ) : null}

      <DisconnectConfirmationDialog
        open={disconnectDialog.open}
        platformLabel={disconnectDialog.platform}
        loading={!!processingPlatform}
        onCancel={() => setDisconnectDialog({ open: false, platform: "" })}
        onConfirm={disconnectPlatform}
      />
    </section>
  );
}

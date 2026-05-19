import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PLATFORM_CAPABILITY_MATRIX,
  SOCIAL_PLATFORM_CONFIGS,
  isPlatformConnectTemporarilyDisabled,
} from "../data/socialPlatforms";
import {
  disconnectSocial,
  getSocialAccounts,
  getSocialOAuthErrorMessage,
  manualConnectSocial,
  refreshSocial,
  startSocialConnect,
} from "../services/socialApi";
import { stripOAuthRedirectFragment } from "../utils/oauthReturnUrl";

export function useSocialConnections({ setToast, refreshConnectedAccounts, onOAuthSuccess } = {}) {
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [processingPlatform, setProcessingPlatform] = useState("");
  const [disconnectDialog, setDisconnectDialog] = useState({ open: false, platform: "" });
  const [oauthBanner, setOauthBanner] = useState(null);

  const accountsByPlatform = useMemo(
    () =>
      accounts.reduce((acc, item) => {
        acc[item.platform] = item;
        return acc;
      }, {}),
    [accounts]
  );

  const { availablePlatforms, temporarilyDisabledPlatforms } = useMemo(() => {
    const available = [];
    const disabled = [];
    for (const platform of SOCIAL_PLATFORM_CONFIGS) {
      if (isPlatformConnectTemporarilyDisabled(platform.key)) disabled.push(platform);
      else available.push(platform);
    }
    return { availablePlatforms: available, temporarilyDisabledPlatforms: disabled };
  }, []);

  const summary = useMemo(() => {
    const connected = accounts.filter((item) => item.isConnected).length;
    const reconnectRequired = accounts.filter((item) => item.isConnected && item.isTokenExpired).length;
    const pendingPlatforms = SOCIAL_PLATFORM_CONFIGS.filter(
      (platform) =>
        !isPlatformConnectTemporarilyDisabled(platform.key) && !accountsByPlatform[platform.key]?.isConnected
    ).length;
    return {
      totalConnected: connected,
      reconnectRequired,
      pendingPlatforms,
    };
  }, [accounts, accountsByPlatform]);

  const loadAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    try {
      if (refreshConnectedAccounts) {
        setAccounts(await refreshConnectedAccounts());
      } else {
        setAccounts(await getSocialAccounts());
      }
    } catch (error) {
      setToast?.({ message: error.message || "Unable to load connected accounts.", error: true });
    } finally {
      setLoadingAccounts(false);
    }
  }, [refreshConnectedAccounts, setToast]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    stripOAuthRedirectFragment();
    const params = new URLSearchParams(window.location.search);
    const platform = params.get("social_platform");
    const status = params.get("social_status");
    const reason = params.get("reason");
    if (!platform || !status) return;

    if (status === "connected") {
      setToast?.({ message: `${platform} connected successfully.` });
      setOauthBanner({ type: "success", message: `${platform} account connected.` });
      onOAuthSuccess?.(platform);
      void (async () => {
        await loadAccounts();
        if (refreshConnectedAccounts) await refreshConnectedAccounts();
      })();
    } else {
      const message = getSocialOAuthErrorMessage(reason, platform);
      setToast?.({ message, error: true });
      setOauthBanner({ type: "error", message });
    }

    params.delete("social_platform");
    params.delete("social_status");
    params.delete("reason");
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`
    );
  }, [loadAccounts, onOAuthSuccess, setToast]);

  const connectPlatform = async (platform) => {
    if (isPlatformConnectTemporarilyDisabled(platform)) {
      setToast?.({ message: "Connecting to this platform is temporarily unavailable.", error: true });
      return;
    }
    setProcessingPlatform(platform);
    try {
      if (PLATFORM_CAPABILITY_MATRIX[platform]?.oauth === false) {
        await manualConnectSocial(platform);
        await loadAccounts();
        setToast?.({ message: `${platform} connected via manual bot setup.` });
        return;
      }
      const data = await startSocialConnect(platform);
      window.location.href = data.url;
    } catch (error) {
      setToast?.({ message: error.message || `Failed to connect ${platform}.`, error: true });
    } finally {
      setProcessingPlatform("");
    }
  };

  const reconnectPlatform = async (platform) => {
    if (isPlatformConnectTemporarilyDisabled(platform)) {
      setToast?.({ message: "Reconnect is temporarily unavailable for this platform.", error: true });
      return;
    }
    setProcessingPlatform(platform);
    try {
      const result = await refreshSocial(platform);
      if (result.refreshed) {
        setToast?.({ message: `${platform} token refreshed.` });
        await loadAccounts();
      } else {
        await connectPlatform(platform);
      }
    } catch {
      await connectPlatform(platform);
    } finally {
      setProcessingPlatform("");
    }
  };

  const disconnectPlatform = async () => {
    const platform = disconnectDialog.platform;
    setProcessingPlatform(platform);
    const current = [...accounts];
    setAccounts((prev) => prev.map((item) => (item.platform === platform ? { ...item, isConnected: false } : item)));
    try {
      await disconnectSocial(platform);
      setToast?.({ message: `${platform} disconnected.` });
      await loadAccounts();
    } catch (error) {
      setAccounts(current);
      setToast?.({ message: error.message || `Failed to disconnect ${platform}.`, error: true });
    } finally {
      setDisconnectDialog({ open: false, platform: "" });
      setProcessingPlatform("");
    }
  };

  return {
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
    loadAccounts,
    connectPlatform,
    reconnectPlatform,
    disconnectPlatform,
  };
}

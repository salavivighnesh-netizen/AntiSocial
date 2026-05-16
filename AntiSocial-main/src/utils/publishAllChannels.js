import { uploadSocialPublicMediaFile } from "../services/socialApi";
import { SOCIAL_PLATFORM_CONFIGS } from "../data/socialPlatforms";
import { buildDraftFromShared } from "./sharedPostSync";
import { publishChannelDraft, validateChannelDraft } from "./publishChannelDraft";

export const ONE_CLICK_PUBLISHABLE = new Set(["instagram", "facebook", "threads", "x", "linkedin"]);

function platformLabel(key) {
  return SOCIAL_PLATFORM_CONFIGS.find((c) => c.key === key)?.label || key;
}

/**
 * One-click publish: upload media once, then post to all selected channels in parallel.
 */
export async function publishToAllChannels(channelKeys, shared) {
  const publishable = channelKeys.filter((k) => ONE_CLICK_PUBLISHABLE.has(k));
  const skipped = channelKeys.filter((k) => !ONE_CLICK_PUBLISHABLE.has(k));

  if (!publishable.length) {
    return {
      ok: [],
      failed: [],
      skipped: skipped.map((k) => ({ platformKey: k, reason: "Not supported in one-click publish yet." })),
    };
  }

  let preUploadedMediaUrl = (shared.mediaUrl || "").trim();
  if (shared.file && !preUploadedMediaUrl) {
    preUploadedMediaUrl = await uploadSocialPublicMediaFile(shared.file);
    if (!preUploadedMediaUrl) throw new Error("Media upload failed.");
  }

  const tasks = publishable.map(async (platformKey) => {
    const draft = buildDraftFromShared(platformKey, shared, preUploadedMediaUrl);
    if (draft.error) {
      return { platformKey, ok: false, message: draft.error };
    }
    const validationError = validateChannelDraft(platformKey, draft);
    if (validationError) {
      return { platformKey, ok: false, message: validationError };
    }
    try {
      const message = await publishChannelDraft(platformKey, draft, { preUploadedMediaUrl });
      return { platformKey, ok: true, message };
    } catch (err) {
      return { platformKey, ok: false, message: err?.message || "Publish failed." };
    }
  });

  const settled = await Promise.all(tasks);
  const ok = settled.filter((r) => r.ok).map((r) => ({ platformKey: r.platformKey, message: r.message }));
  const failed = settled.filter((r) => !r.ok).map((r) => ({ platformKey: r.platformKey, message: r.message }));
  const skippedList = skipped.map((k) => ({
    platformKey: k,
    reason: `Use ${platformLabel(k)} page to publish.`,
  }));

  return { ok, failed, skipped: skippedList };
}

import {
  postToFacebook,
  postToLinkedIn,
  postToThreads,
  postToX,
  publishInstagramPost,
  uploadSocialPublicMedia,
  uploadSocialPublicMediaFile,
} from "../services/socialApi";
import { getActivePostTypeConfig } from "../data/platformComposerConfig";

function inferThreadsMediaTypeFromUrl(url) {
  const u = (url || "").toLowerCase();
  if (/\.(mp4|mov|webm|m4v)(\?|#|$)/i.test(u)) return "VIDEO";
  return "IMAGE";
}

export function validateChannelDraft(platformKey, draft) {
  const typeConfig = getActivePostTypeConfig(platformKey, draft.postType);
  const caption = (draft.caption || "").trim();
  const mediaUrl = (draft.mediaUrl || "").trim();
  const linkUrl = (draft.linkUrl || "").trim();

  if (platformKey === "instagram") {
    if (typeConfig?.disabled) return typeConfig.hint || "This post type is not supported.";
    if (!draft.file && !mediaUrl) return "Add a photo or video for Instagram.";
    return null;
  }

  if (platformKey === "facebook") {
    const mediaType = typeConfig?.mediaType || "TEXT";
    if (mediaType === "TEXT" && !caption) return "Enter post text.";
    if (mediaType === "LINK" && !linkUrl) return "Enter a link URL.";
    if ((mediaType === "IMAGE" || mediaType === "VIDEO") && !draft.file && !mediaUrl) {
      return "Add media or a public media URL.";
    }
    return null;
  }

  if (platformKey === "threads") {
    const mediaType = typeConfig?.mediaType || "TEXT";
    if (mediaType === "TEXT" && !caption) return "Enter post text.";
    if (mediaType !== "TEXT" && !draft.file && !mediaUrl) return "Add media or a public URL.";
    if (draft.file && mediaUrl) return "Use either a file upload or a URL—not both.";
    return null;
  }

  if (platformKey === "x") {
    if (!caption) return "Post content is required.";
    if (caption.length > 280) return "Post cannot exceed 280 characters.";
    return null;
  }

  if (platformKey === "linkedin") {
    const mediaType = typeConfig?.mediaType || "TEXT";
    if (mediaType === "TEXT" && !caption) return "Enter post text.";
    if ((mediaType === "IMAGE" || mediaType === "VIDEO") && !draft.file && !mediaUrl) {
      return "Add media for this post type.";
    }
    return null;
  }

  if (!caption && !draft.file && !mediaUrl) return "Add a caption or media.";
  return null;
}

export async function publishChannelDraft(platformKey, draft, options = {}) {
  const typeConfig = getActivePostTypeConfig(platformKey, draft.postType);
  const caption = (draft.caption || "").trim();
  const mediaUrl = (draft.mediaUrl || "").trim();
  const linkUrl = (draft.linkUrl || "").trim();
  const preUploadedMediaUrl = (options.preUploadedMediaUrl || "").trim();

  if (platformKey === "instagram") {
    const mediaType = typeConfig?.mediaType || "IMAGE";
    let url = preUploadedMediaUrl || mediaUrl;
    if (!url && draft.file) {
      url = await uploadSocialPublicMediaFile(draft.file);
      if (!url) throw new Error("Upload did not return a URL.");
    }
    const result = await publishInstagramPost({
      mediaType,
      mediaUrl: url,
      caption: caption || undefined,
    });
    if (!result?.success) throw new Error(result?.message || "Instagram publishing failed.");
    return result.message || "Published to Instagram.";
  }

  if (platformKey === "facebook") {
    const mediaType = typeConfig?.mediaType || "TEXT";
    let resolvedMediaUrl = preUploadedMediaUrl || mediaUrl;
    if (!resolvedMediaUrl && draft.file && (mediaType === "IMAGE" || mediaType === "VIDEO")) {
      resolvedMediaUrl = await uploadSocialPublicMedia(draft.file);
    }
    const result = await postToFacebook({
      message: caption,
      mediaType,
      mediaUrl: resolvedMediaUrl || undefined,
      linkUrl: mediaType === "LINK" ? linkUrl : undefined,
    });
    return result?.message || "Published to Facebook.";
  }

  if (platformKey === "threads") {
    const mediaType = typeConfig?.mediaType || "TEXT";
    let resolvedUrl = "";
    let apiMediaType = "TEXT";
    if (mediaType === "TEXT") {
      apiMediaType = "TEXT";
    } else if (preUploadedMediaUrl || draft.file) {
      resolvedUrl = preUploadedMediaUrl || (await uploadSocialPublicMedia(draft.file));
      apiMediaType =
        preUploadedMediaUrl && inferThreadsMediaTypeFromUrl(preUploadedMediaUrl) === "VIDEO"
          ? "VIDEO"
          : (draft.file?.type || "").startsWith("video/")
            ? "VIDEO"
            : "IMAGE";
    } else if (mediaUrl) {
      resolvedUrl = mediaUrl;
      apiMediaType = inferThreadsMediaTypeFromUrl(mediaUrl);
    }
    const result = await postToThreads({ text: caption, mediaUrl: resolvedUrl, mediaType: apiMediaType });
    return result?.message || "Published to Threads.";
  }

  if (platformKey === "x") {
    await postToX(caption);
    return "Published to X.";
  }

  if (platformKey === "linkedin") {
    const mediaType = typeConfig?.mediaType || "TEXT";
    const payload = {
      content: caption,
      targetType: "profile",
      organizationId: null,
      mediaType,
      mediaUrl: mediaUrl || "",
      linkUrl: "",
    };
    const result = await postToLinkedIn(payload, draft.file || null);
    return result?.message || "Published to LinkedIn.";
  }

  throw new Error(`Publishing from the composer is not wired for ${platformKey} yet. Use the channel page.`);
}

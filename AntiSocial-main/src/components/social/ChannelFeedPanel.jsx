import { useCallback, useEffect, useState } from "react";
import { Heart, Loader2, MessageCircle, PenSquare, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getPostHistory } from "../../services/socialApi";
import { SOCIAL_PLATFORM_CONFIGS } from "../../data/socialPlatforms";

function isLikelyVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url.trim());
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function FeedPost({ record, account, platformLabel }) {
  const mediaUrl = record.mediaUrl || "";
  const profileImage =
    account?.profileImage ||
    `https://placehold.co/48x48/1e293b/94a3b8?text=${encodeURIComponent((platformLabel[0] || "P").toUpperCase())}`;
  const authorName = record.platformAccountName || account?.accountName || account?.username || platformLabel;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/60 shadow-lg">
      <header className="flex items-center gap-3 border-b border-slate-700/60 px-4 py-3">
        <img src={profileImage} alt="" className="h-10 w-10 rounded-full border border-slate-600 object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{authorName}</p>
          <p className="text-xs text-slate-500">
            {timeAgo(record.publishedAt)} · {record.mediaType || "POST"}
            {record.targetName ? ` · ${record.targetName}` : ""}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
          Published
        </span>
      </header>

      {record.content?.trim() ? (
        <p className="whitespace-pre-wrap px-4 pt-3 text-sm leading-relaxed text-slate-200">{record.content}</p>
      ) : null}

      {mediaUrl ? (
        <div className="mt-3 border-y border-slate-800 bg-black/30">
          {isLikelyVideoUrl(mediaUrl) ? (
            <video src={mediaUrl} controls className="max-h-96 w-full object-contain" preload="metadata" />
          ) : (
            <img src={mediaUrl} alt="" className="max-h-96 w-full object-cover" loading="lazy" />
          )}
        </div>
      ) : null}

      {record.linkUrl ? (
        <a
          href={record.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-4 mt-3 block truncate rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2 text-xs text-sky-300 hover:border-brand-500/40"
        >
          {record.linkUrl}
        </a>
      ) : null}

      <footer className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-4 text-slate-500">
          <span className="inline-flex items-center gap-1 text-xs">
            <Heart size={14} /> —
          </span>
          <span className="inline-flex items-center gap-1 text-xs">
            <MessageCircle size={14} /> —
          </span>
          <span className="inline-flex items-center gap-1 text-xs">
            <Share2 size={14} /> —
          </span>
        </div>
        {record.externalPostUrl ? (
          <a
            href={record.externalPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300"
          >
            Open on platform →
          </a>
        ) : null}
      </footer>
    </article>
  );
}

export default function ChannelFeedPanel({ platformKey, account, refreshKey = 0, onPostCount }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const platformLabel = SOCIAL_PLATFORM_CONFIGS.find((p) => p.key === platformKey)?.label || platformKey;

  const fetchFeed = useCallback(
    async (pageNum) => {
      setLoading(true);
      setLoadError(false);
      try {
        const { records: rows, pagination } = await getPostHistory({
          platform: platformKey,
          page: pageNum,
          limit: 10,
        });
        setRecords(rows);
        setPage(pagination.page || pageNum);
        setTotalPages(pagination.totalPages || 0);
        const t = pagination.total ?? rows.length;
        setTotal(t);
        onPostCount?.(t);
      } catch {
        setLoadError(true);
        setRecords([]);
        onPostCount?.(0);
      } finally {
        setLoading(false);
      }
    },
    [platformKey, onPostCount]
  );

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed, refreshKey]);

  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Feed</h2>
          <p className="text-xs text-slate-400">Posts published through AntiSocial for {platformLabel}</p>
        </div>
        <Link
          to={`/create-post?platform=${encodeURIComponent(platformKey)}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-600"
        >
          <PenSquare size={14} />
          New post
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-400">
          <Loader2 className="animate-spin" size={20} />
          Loading feed…
        </div>
      ) : null}

      {!loading && loadError ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-8 text-center text-sm text-rose-100">
          Could not load feed. Make sure the API server is running.
        </div>
      ) : null}

      {!loading && !loadError && !records.length ? (
        <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/50 px-6 py-16 text-center">
          <p className="text-sm font-medium text-slate-300">No posts in your feed yet</p>
          <p className="mt-2 text-xs text-slate-500">Publish your first post to see it here.</p>
          <Link
            to={`/create-post?platform=${encodeURIComponent(platformKey)}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            <PenSquare size={16} />
            Create post
          </Link>
        </div>
      ) : null}

      {!loading && !loadError && records.length > 0 ? (
        <ul className="space-y-5">
          {records.map((record) => (
            <li key={record._id}>
              <FeedPost record={record} account={account} platformLabel={platformLabel} />
            </li>
          ))}
        </ul>
      ) : null}

      {!loading && !loadError && totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-slate-700 pt-4 text-xs text-slate-400">
          <p>
            {total} post{total === 1 ? "" : "s"} · page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => fetchFeed(page - 1)}
              className="rounded-md border border-slate-600 px-3 py-1.5 font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-40"
            >
              Newer
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => fetchFeed(page + 1)}
              className="rounded-md border border-slate-600 px-3 py-1.5 font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-40"
            >
              Older
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

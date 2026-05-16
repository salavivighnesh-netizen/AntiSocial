import { useMemo, useState } from "react";
import { Sparkles, LayoutTemplate, Wand2, Hash, Minimize2, MessageCircle, Loader2 } from "lucide-react";
import {
  POST_TEMPLATE_CATEGORIES,
  AI_TONE_OPTIONS,
  AI_GOAL_OPTIONS,
} from "../../data/postIdeasTemplates";
import { applyTemplate, getTemplatesForPlatform, improveCaption } from "../../utils/aiPostGenerator";
import { generateAiCaptions } from "../../services/aiApi";

export default function PostIdeasPanel({ caption, onApplyCaption, selectedPlatform, topic: topicProp, onTopicChange }) {
  const [tab, setTab] = useState("templates");
  const [category, setCategory] = useState("all");
  const [topic, setTopic] = useState(topicProp || "");
  const [tone, setTone] = useState("casual");
  const [goal, setGoal] = useState("engage");
  const [generating, setGenerating] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [lastSource, setLastSource] = useState("");

  const templates = useMemo(
    () => getTemplatesForPlatform(selectedPlatform, category),
    [selectedPlatform, category]
  );

  const handleTopicChange = (value) => {
    setTopic(value);
    onTopicChange?.(value);
  };

  const runGenerate = async () => {
    setGenerating(true);
    try {
      const results = await generateAiCaptions({
        topic,
        tone,
        goal,
        platform: selectedPlatform,
      });
      setAiResults(results);
      setLastSource(results[0]?.source || "local");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <article className="buffer-card flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Sparkles size={16} className="text-buffer-600" />
          Ideas & AI
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">Templates and AI-assisted captions</p>
        <div className="mt-3 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setTab("templates")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition ${
              tab === "templates"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                : "text-slate-500"
            }`}
          >
            <LayoutTemplate size={14} />
            Templates
          </button>
          <button
            type="button"
            onClick={() => setTab("ai")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition ${
              tab === "ai" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white" : "text-slate-500"
            }`}
          >
            <Wand2 size={14} />
            AI
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "templates" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {POST_TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    category === cat.id
                      ? "bg-buffer-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {templates.length === 0 ? (
                <p className="text-xs text-slate-500">No templates for this filter. Try &quot;All&quot; or another platform.</p>
              ) : (
                templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => onApplyCaption(applyTemplate(tpl, { topic }))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-left transition hover:border-buffer-300 hover:bg-buffer-50/50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-buffer-500/40"
                  >
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{tpl.title}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] text-slate-500">{tpl.caption.split("\n")[0]}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Topic / product</span>
              <input
                value={topic}
                onChange={(e) => handleTopicChange(e.target.value)}
                placeholder="e.g. spring sale, new feature, hiring"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-buffer-500 focus:ring-2 focus:ring-buffer-500/20 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Tone</span>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  {AI_TONE_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Goal</span>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  {AI_GOAL_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              disabled={generating}
              onClick={runGenerate}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-buffer-600 py-2.5 text-sm font-semibold text-white hover:bg-buffer-700 disabled:opacity-60"
            >
              {generating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              {generating ? "Generating…" : "Generate captions"}
            </button>
            {lastSource ? (
              <p className="text-center text-[10px] text-slate-400">
                {lastSource === "openai" ? "Powered by OpenAI" : "Smart suggestions (add OPENAI_API_KEY for GPT)"}
              </p>
            ) : null}
            {aiResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Pick a variant</p>
                {aiResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onApplyCaption(item.caption)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-left text-xs text-slate-700 transition hover:border-buffer-400 dark:border-slate-700 dark:text-slate-200"
                  >
                    <p className="line-clamp-4 whitespace-pre-wrap">{item.caption}</p>
                  </button>
                ))}
              </div>
            ) : null}
            {caption.trim() ? (
              <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">Improve current caption</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "hashtags", label: "Hashtags", icon: Hash },
                    { id: "shorten", label: "Shorter", icon: Minimize2 },
                    { id: "cta", label: "Add CTA", icon: MessageCircle },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onApplyCaption(improveCaption(caption, id))}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}

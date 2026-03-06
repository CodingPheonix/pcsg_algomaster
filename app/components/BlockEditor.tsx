import { TutorialBlock } from "../admin/topic/page";
import { RemoveBtn } from "./RemoveBtn";

export const BlockEditor = ({
  block,
  preview,
  onUpdate,
  onUpdateCode,
  onRemove,
}: {
  block: TutorialBlock;
  preview: boolean;
  onUpdate: (u: Partial<TutorialBlock>) => void;
  onUpdateCode: (lang: string, code: string) => void;
  onRemove: () => void;
}) => {
  if (block.type === "heading") {
    return preview ? (
      <h2 className="text-2xl font-bold font-mono text-foreground">{block.content || "Untitled"}</h2>
    ) : (
      <div className="relative">
        <input
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Heading..."
          className="w-full bg-transparent text-2xl font-bold font-mono text-foreground placeholder:text-muted-foreground outline-none pr-8"
        />
        <RemoveBtn onClick={onRemove} />
      </div>
    );
  }

  if (block.type === "subheading") {
    return preview ? (
      <h3 className="text-xl font-semibold font-mono text-foreground">{block.content || "Untitled"}</h3>
    ) : (
      <div className="relative">
        <input
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Subheading..."
          className="w-full bg-transparent text-xl font-semibold font-mono text-foreground placeholder:text-muted-foreground outline-none pr-8"
        />
        <RemoveBtn onClick={onRemove} />
      </div>
    );
  }

  if (block.type === "text") {
    return preview ? (
      <p className="text-sm leading-relaxed text-secondary-foreground whitespace-pre-wrap">{block.content}</p>
    ) : (
      <div className="relative">
        <textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Write your paragraph..."
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-colors pr-8"
        />
        <RemoveBtn onClick={onRemove} />
      </div>
    );
  }

  if (block.type === "highlight") {
    return preview ? (
      <div className="rounded-lg border-l-4 border-primary bg-primary/10 px-4 py-3">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{block.content}</p>
      </div>
    ) : (
      <div className="relative">
        <textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Highlighted callout text..."
          rows={2}
          className="w-full resize-none rounded-lg border-l-4 border-primary bg-primary/10 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none pr-8"
        />
        <RemoveBtn onClick={onRemove} />
      </div>
    );
  }

  if (block.type === "code") {
    const activeLang = block.activeLanguage || block.languages?.[0]?.lang || "";
    const activeCode = block.languages?.find((l) => l.lang === activeLang)?.code || "";

    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Language tabs */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-2">
          <div className="flex overflow-x-auto">
            {block.languages?.map((l) => (
              <button
                key={l.lang}
                onClick={() => onUpdate({ activeLanguage: l.lang })}
                className={`px-3 py-2 text-xs font-mono whitespace-nowrap transition-colors border-b-2 ${
                  l.lang === activeLang
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.lang}
              </button>
            ))}
          </div>
          {!preview && <RemoveBtn onClick={onRemove} />}
        </div>

        {/* Code area */}
        {preview ? (
          <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
            <code>{activeCode || "// No code yet"}</code>
          </pre>
        ) : (
          <textarea
            value={activeCode}
            onChange={(e) => onUpdateCode(activeLang, e.target.value)}
            placeholder={`Write ${activeLang} code here...`}
            rows={6}
            spellCheck={false}
            className="w-full resize-none bg-transparent p-4 text-xs font-mono text-foreground placeholder:text-muted-foreground outline-none leading-relaxed"
          />
        )}
      </div>
    );
  }

  return null;
};
"use client";

import { useState } from "react";
import {
  Type,
  Heading1,
  Heading2,
  Code,
  Highlighter,
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  Pencil,
  Send,
  MessageSquare,
  ArrowLeft,
  Upload,
} from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { BlockEditor } from "@/app/components/BlockEditor";
import { addTopicContent } from "@/app/db/operations/topics";
import { useSearchParams } from "next/navigation";

type BlockType = "text" | "heading" | "subheading" | "code" | "highlight";

interface CodeLanguage {
  lang: string;
  code: string;
}

export interface TutorialBlock {
  id: string;
  type: BlockType;
  content: string;
  languages?: CodeLanguage[];
  activeLanguage?: string;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: "heading", label: "Heading", icon: <Heading1 size={18} />, desc: "Section title" },
  { type: "subheading", label: "Subheading", icon: <Heading2 size={18} />, desc: "Subsection title" },
  { type: "text", label: "Paragraph", icon: <Type size={18} />, desc: "Body text" },
  { type: "code", label: "Code", icon: <Code size={18} />, desc: "Multi-language snippet" },
  { type: "highlight", label: "Highlight", icon: <Highlighter size={18} />, desc: "Callout text" },
];

const DEFAULT_LANGUAGES = ["JavaScript", "Python", "C++", "Java"];

const generateId = () => uuidv4();

const page = () => {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<TutorialBlock[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addMenuIndex, setAddMenuIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Alice",
      avatar: "A",
      text: "Great tutorial! The code examples really helped me understand the concept.",
      time: "2 hours ago",
    },
    {
      id: "2",
      author: "Bob",
      avatar: "B",
      text: "Could you add an example for Rust as well?",
      time: "45 minutes ago",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const searchParams = useSearchParams()
  const topicId = searchParams.get('sub')

  const createBlock = (type: BlockType): TutorialBlock => {
    const base = { id: generateId(), type, content: "" };
    if (type === "code") {
      return {
        ...base,
        languages: DEFAULT_LANGUAGES.map((lang) => ({ lang, code: "" })),
        activeLanguage: DEFAULT_LANGUAGES[0],
      };
    }
    return base;
  };

  const addBlock = (type: BlockType, atIndex?: number) => {
    const block = createBlock(type);
    setBlocks((prev) => {
      const copy = [...prev];
      const idx = atIndex !== undefined ? atIndex + 1 : copy.length;
      copy.splice(idx, 0, block);
      return copy;
    });
    setShowAddMenu(false);
    setAddMenuIndex(null);
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBlock = (id: string, updates: Partial<TutorialBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const updateCodeLang = (blockId: string, lang: string, code: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const languages = b.languages?.map((l) => (l.lang === lang ? { ...l, code } : l));
        return { ...b, languages };
      })
    );
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    setBlocks((prev) => {
      const copy = [...prev];
      [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
      return copy;
    });
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: generateId(),
        author: "You",
        avatar: "Y",
        text: newComment.trim(),
        time: "Just now",
      },
    ]);
    setNewComment("");
  };

  const openAddMenu = (index: number | null) => {
    setAddMenuIndex(index);
    setShowAddMenu(true);
  };

  const handleContentUpload = () => {
    if (topicId === null) return;

    console.log(blocks);
    console.log(title);

    addTopicContent(topicId as string, title, blocks)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-border bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-mono">Back</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-colors ${previewMode
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
            >
              {previewMode ? <Eye size={14} /> : <Pencil size={14} />}
              {previewMode ? "Preview" : "Edit"}
            </button>
            <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-mono font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Title */}
        {previewMode ? (
          <h1 className="text-3xl md:text-4xl font-bold font-mono mb-8 text-foreground">
            {title || "Untitled Tutorial"}
          </h1>
        ) : (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tutorial title..."
            className="w-full bg-transparent text-3xl md:text-4xl font-bold font-mono mb-8 text-foreground placeholder:text-muted-foreground outline-none border-none"
          />
        )}

        {/* Blocks */}
        <div className="space-y-4">
          {blocks.length === 0 && !previewMode && (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl">
              <div className="text-muted-foreground mb-4">
                <Plus size={32} className="opacity-40" />
              </div>
              <p className="text-sm text-muted-foreground mb-4 font-mono">Start building your tutorial</p>
              <div className="flex flex-wrap justify-center gap-2">
                {BLOCK_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => addBlock(opt.type)}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-mono text-secondary-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {blocks.map((block, index) => (
            <div key={block.id} className="group relative">
              {/* Edit mode block */}
              {!previewMode && (
                <div className="absolute -left-10 top-2 flex-col items-center gap-0.5 hidden group-hover:flex">
                  <button
                    onClick={() => moveBlock(index, "up")}
                    disabled={index === 0}
                    className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <GripVertical size={14} className="text-muted-foreground/40" />
                  <button
                    onClick={() => moveBlock(index, "down")}
                    disabled={index === blocks.length - 1}
                    className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              )}

              <BlockEditor
                block={block}
                preview={previewMode}
                onUpdate={(updates) => updateBlock(block.id, updates)}
                onUpdateCode={(lang, code) => updateCodeLang(block.id, lang, code)}
                onRemove={() => removeBlock(block.id)}
              />

              {/* Add block between */}
              {!previewMode && (
                <div className="flex justify-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openAddMenu(index)}
                    className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-[10px] font-mono text-muted-foreground hover:border-green-500 hover:text-green-500 transition-colors"
                  >
                    <Plus size={12} />
                    Add block
                  </button>
                </div>
              )}
            </div>
          ))}

          {blocks.length > 0 && !previewMode && (
            <div className="flex justify-center pt-2 gap-3">
              <button
                onClick={() => openAddMenu(null)}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-4 py-2.5 text-xs font-mono text-muted-foreground hover:border-green-500 hover:text-green-500 transition-colors"
              >
                <Plus size={14} />
                Add block
              </button>

              <button
                onClick={handleContentUpload}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-4 py-2.5 text-xs font-mono text-muted-foreground hover:border-green-500 hover:text-green-500 transition-colors"
              >
                <Upload size={14} />
                Upload
              </button>
            </div>
          )}
        </div>

        {/* Add block modal */}
        {showAddMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddMenu(false)}>
            <div
              className="w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <p className="text-xs font-mono text-muted-foreground mb-3">Choose a block type</p>
              <div className="space-y-1">
                {BLOCK_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => addBlock(opt.type, addMenuIndex ?? undefined)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-secondary transition-colors"
                  >
                    <span className="text-primary">{opt.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="my-12 border-t border-border" />

        {/* Comment Section */}
        <div className="pb-16">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={20} className="text-primary" />
            <h2 className="text-lg font-mono font-bold text-foreground">
              Comments <span className="text-muted-foreground font-normal">({comments.length})</span>
            </h2>
          </div>

          {/* Add comment */}
          <div className="mb-6 flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground font-mono">
              Y
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-mono font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={12} />
                  Post
                </button>
              </div>
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground font-mono">
                  {c.avatar}
                </div>
                <div className="flex-1 rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{c.author}</span>
                    <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-sm text-secondary-foreground leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Block Editor ─── */





export default page;

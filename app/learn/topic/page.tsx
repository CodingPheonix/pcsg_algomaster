'use client'

import { useState, Suspense } from "react";
import { ArrowLeft, Code, MessageSquare, Send } from "lucide-react";
import CodeBlockViewer from "@/app/components/CodeBlockViewer";
import { BlockRenderer } from "@/app/components/BlockRenderer";
import { Mixed } from "@/app/db/schema";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { fetchTopics } from "@/app/db/operations/topics";
import { useUserContext } from "@/app/context/userContext";
import { v4 as UUIDv4 } from "uuid";
import { fetchComments, uploadComment } from "@/app/db/operations/comments";

// Sample data for demonstration
const SAMPLE_DATA: Mixed[] = [
    { id: "1", type: "heading", content: "Content not Available" },
    {
        id: "2",
        type: "text",
        content:
            "The Content for the page is currently not available",
    },
    {
        id: "3",
        type: "highlight",
        content:
            "Contact your respective professor"
    }
];

interface Comment {
    id: string;
    username: string;
    message: string;
    time: Date;
}

const TopicPage = () => {
    // State list
    const [blocks, setBlocks] = useState<Mixed[]>(SAMPLE_DATA);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    // Hooks
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const userContext = useUserContext()
    const { user } = userContext

    // Functions
    const addComment = async () => {
        if (!newComment.trim()) return;

        const payload = {
            id: UUIDv4() as string,
            topic_id: id as string,
            username: user.username,
            message: newComment.trim(),
            time: new Date(Date.now()),
        }

        setComments((prev) => [
            ...prev, payload
        ]);

        // add comments to db
        await uploadComment(payload)

        setNewComment("");
    };

    function timeAgo(date: Date) {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        const intervals = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "day", seconds: 86400 },
            { label: "hr", seconds: 3600 },
            { label: "min", seconds: 60 },
            { label: "sec", seconds: 1 },
        ];

        for (const i of intervals) {
            const value = Math.floor(seconds / i.seconds);
            if (value >= 1) {
                return `${value} ${i.label}${value > 1 && i.label !== "hr" ? "s" : ""} ago`;
            }
        }

        return "just now";
    }

    // UseEffects
    useEffect(() => {
        const fetchtopics = async () => {
            if (!id) return;

            const topics = await fetchTopics(id as string)
            topics[0].content !== null && setBlocks(topics[0].content as unknown as Mixed[])
        }

        const fetchComment = async () => {
            if (!id) return;

            const all_comments = await fetchComments(id);
            setComments(all_comments as Comment[])
        }

        fetchtopics()
        fetchComment()
    }, [id])

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top bar */}
            <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-14 items-center px-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm font-mono">Back</span>
                    </button>
                </div>
            </div>

            <div className="container mx-auto max-w-3xl px-4 py-8">
                {/* Blocks */}
                <div className="space-y-5">
                    {blocks.map(
                        (block) =>
                            block && <BlockRenderer key={block.id} block={block} />
                    )}
                </div>

                {/* Divider */}
                <div className="my-12 border-t border-border" />

                {/* Comments */}
                <div className="pb-16">
                    <div className="flex items-center gap-2 mb-6">
                        <MessageSquare size={20} className="text-blue-500" />
                        <h2 className="text-lg font-mono font-bold text-foreground">
                            Comments{" "}
                            <span className="text-muted-foreground font-normal">
                                ({comments.length})
                            </span>
                        </h2>
                    </div>

                    <div className="mb-6 flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-blue-500-foreground font-mono">
                            {user.id && user.username[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                rows={2}
                                className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={addComment}
                                    disabled={!newComment.trim()}
                                    className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-mono font-medium text-blue-500-foreground hover:bg-blue-500/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={12} />
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {comments.map((c) => (
                            <div key={c.id} className="flex gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground font-mono">
                                    {c.username[0].toUpperCase()}
                                </div>
                                <div className="flex-1 rounded-lg border border-border bg-card p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-foreground">
                                            {c.username}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {timeAgo(c.time)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary-foreground leading-relaxed">
                                        {c.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TopicPage />
    </Suspense>
  );
}

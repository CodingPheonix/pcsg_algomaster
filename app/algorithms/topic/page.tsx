'use client'

import { useState } from "react";
import { ArrowLeft, Code, MessageSquare, Send } from "lucide-react";
import CodeBlockViewer from "@/app/components/CodeBlockViewer";
import { BlockRenderer } from "@/app/components/BlockRenderer";
import { Mixed } from "@/app/db/schema";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { fetchTopics } from "@/app/db/operations/topics";

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
    author: string;
    avatar: string;
    text: string;
    time: string;
}

const ViewTutorial = () => {
    // State list
    const [blocks, setBlocks] = useState<Mixed[]>(SAMPLE_DATA);
    const [comments, setComments] = useState<Comment[]>([
        {
            id: "1",
            author: "Alice",
            avatar: "A",
            text: "Great tutorial! The code examples really helped.",
            time: "2 hours ago",
        },
    ]);
    const [newComment, setNewComment] = useState("");

    // Hooks
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    // Functions
    const addComment = () => {
        if (!newComment.trim()) return;
        setComments((prev) => [
            ...prev,
            {
                id: Math.random().toString(36).slice(2, 10),
                author: "You",
                avatar: "Y",
                text: newComment.trim(),
                time: "Just now",
            },
        ]);
        setNewComment("");
    };

    // UseEffects
    useEffect(() => {
        const fetchtopics = async () => {
            if (!id) return;

            const topics = await fetchTopics(id as string)
            console.log(topics)
            topics[0].content !== null && setBlocks(topics[0].content as unknown as Mixed[])
        }
        fetchtopics()
    }, [])

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
                            Y
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
                                    {c.avatar}
                                </div>
                                <div className="flex-1 rounded-lg border border-border bg-card p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-foreground">
                                            {c.author}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {c.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary-foreground leading-relaxed">
                                        {c.text}
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

export default ViewTutorial;


import { Mixed } from "../db/schema";
import CodeBlockViewer from "./CodeBlockViewer";

export const BlockRenderer = ({ block }: { block: Mixed }) => {
    if (!block) return null;

    switch (block.type) {
        case "heading":
            return (
                <h2 className="text-2xl font-bold font-mono text-foreground">
                    {(block as any).content}
                </h2>
            );
        case "subheading":
            return (
                <h3 className="text-xl font-semibold font-mono text-foreground">
                    {(block as any).content}
                </h3>
            );
        case "text":
            return (
                <p className="text-sm leading-relaxed text-secondary-foreground whitespace-pre-wrap">
                    {(block as any).content}
                </p>
            );
        case "highlight":
            return (
                <div className="rounded-lg border-l-4 border-blue-500 bg-blue-500/10 px-4 py-3">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {(block as any).content}
                    </p>
                </div>
            );
        case "code":
            return <CodeBlockViewer languages={(block as any).languages} />;
        default:
            return null;
    }
};
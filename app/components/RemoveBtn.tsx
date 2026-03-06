import { Trash2 } from "lucide-react";

export const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-2 right-2 p-1 rounded text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
  >
    <Trash2 size={14} />
  </button>
);
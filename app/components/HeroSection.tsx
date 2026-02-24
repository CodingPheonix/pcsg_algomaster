import { ArrowRight, Code2, GitBranch, Layers } from "lucide-react";

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-black text-white">
            <div className="absolute inset-0 bg-linear-to-b from-green-500/10 via-transparent to-transparent" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-green-from-green-500/5 blur-[120px]" />

            <div className="container relative z-10 mx-auto px-4 py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 mb-8">
                        <span className="h-2 w-2 rounded-full bg-green-500 from-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-muted-foreground">Master DSA step by step</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                        Learn to{" "}
                        <span className="text-green-400">think</span>
                        <br />
                        like a programmer
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
                        Interactive lessons on algorithms and data structures. Build intuition, solve problems, and ace your interviews.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button className="flex items-center gap-2 px-8 py-3 rounded-lg bg-green-500 text-black font-mono text-sm font-medium hover:bg-green-600 transition-colors">
                            Start Learning <ArrowRight size={16} />
                        </button>
                        <button className="flex items-center gap-2 px-8 py-3 rounded-lg border border-border text-muted-foreground font-mono text-sm font-medium hover:text-foreground hover:bg-secondary transition-colors">
                            Browse Topics
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 max-w-3xl mx-auto">
                    <FeatureCard
                        icon={<Code2 size={20} />}
                        title="Algorithms"
                        description="Sorting, searching, graphs, dynamic programming & more"
                    />
                    <FeatureCard
                        icon={<Layers size={20} />}
                        title="Data Structures"
                        description="Arrays, trees, heaps, hash maps & linked lists"
                    />
                    <FeatureCard
                        icon={<GitBranch size={20} />}
                        title="Problem Solving"
                        description="Curated problems with step-by-step visual explanations"
                    />
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) => (
    <div className="group rounded-xl border border-border bg-card p-6 hover:border-green-from-green-500/30 hover:shadow-[0_0_30px_-5px_hsl(152_60%_52%/0.25)] transition-all duration-300 cursor-pointer">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-from-green-500/10 text-green-from-green-500 mb-4 group-hover:bg-green-from-green-500/20 transition-colors">
            {icon}
        </div>
        <h3 className="font-mono text-sm font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
);

export default HeroSection;

'use client'

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { getInstruction, VisualizerAction } from "./tools";
import { toast, Toaster } from "sonner";
import { mapping } from "./functions";

// interface BarState {
//     values: number[];
//     comparing?: number[];
//     swapping?: number[];
//     sorted?: number[];
//     activeLine?: number;
// }

export type Elements = {
    value: number;
    colour: string;
}

const Visualizer = () => {
    const [code, setCode] = useState("");
    const [algoSteps, setAlgoSteps] = useState<VisualizerAction[]>([]);
    const [arrayInput, setArrayInput] = useState("");
    const [currentArray, setCurrentArray] = useState<Elements[]>([]);
    const [steps, setSteps] = useState<VisualizerAction[]>([]);
    const [stepIndex, setStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed] = useState(400);
    const [showInstructions, setShowInstructions] = useState(false);
    const [textValue, setTextValue] = useState("")

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const currentStep: VisualizerAction | null = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
    const displayValues = currentArray;
    const maxVal = Math.max(...displayValues.map(values => values.value), 1);

    const syncArray = useCallback((value: string) => {
        try {
            const parsed = value
                .split(/[,\s]+/)
                .map(v => Number(v))
                .filter(v => !Number.isNaN(v));

            if (parsed.length === 0) return;

            setCurrentArray(
                parsed.map(num => ({
                    value: num,
                    colour: "#6c9eef"
                }))
            );

            setSteps([]);
            setStepIndex(-1);
            setIsPlaying(false);
        } catch {
            // ignore
        }
    }, []);

    const handleRun = () => {

        if (stepIndex >= steps.length) {
            handleReset();
        }

        setSteps(algoSteps);
        setStepIndex(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setStepIndex(-1);
        setSteps([]);
        syncArray(arrayInput);
        if (intervalRef.current) clearInterval(intervalRef.current);

        // setCurrentArray(arr =>
        //     arr.map(e => ({
        //         ...e,
        //         colour: '#6c9eef'
        //     }))
        // );
    };

    const handleStepForward = () => {
        if (steps.length === 0) {
            setSteps(algoSteps);
            setStepIndex(0);
            return;
        }
        if (stepIndex < steps.length - 1) {
            setStepIndex((i) => i + 1);
        }
    };

    useEffect(() => {
        if (isPlaying && steps.length > 0) {
            intervalRef.current = setInterval(() => {
                setStepIndex((prev) => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        return prev;
                    }
                    setCurrentArray(prevArr => {
                        const newArr = [...prevArr.map(e => ({ ...e, colour: '#6c9eef' }))]; // deep copy
                        mapping(prev, newArr, steps[prev]);
                        return newArr;
                    });
                    return prev + 1;
                });
            }, speed);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, steps.length, speed]);

    console.log("current step index is: ", stepIndex)
    console.log("updated array: ", currentArray)

    const codeLines = code.split("\n");

    // const getBarColor = (index: number) => {
    //     // if (currentStep?.action?.includes(index)) return "bg-primary";
    //     // if (currentStep?.action?.includes(index)) return "bg-streak";
    //     // if (currentStep?.action?.includes(index)) return "bg-accent";
    //     return "bg-blue-200";
    // };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Toaster />
            {/* Top bar */}
            <div className="sticky top-0 z-40 border-b border-blue-600 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-14 items-center justify-between px-4">
                    <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={18} />
                        <span className="text-sm font-mono">Back</span>
                    </a>
                    <h1 className="text-sm font-mono font-bold text-foreground">Algorithm Visualizer</h1>
                    <div className="w-20" />
                </div>
            </div>

            {/* Upper Section */}
            <div className="border-b border-blue-600">
                <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Code Editor */}
                    <div className="rounded-xl border border-blue-600 bg-card overflow-hidden flex flex-col">
                        <div className="px-4 py-2 border-b border-blue-600 bg-blue-500/80 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-yellow-300" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="ml-2 text-xs font-mono text-muted-foreground">code</span>
                        </div>
                        <div className="flex flex-1 overflow-hidden">
                            {/* Line numbers */}
                            <div className="py-3 px-2 text-right select-none border-r border-blue-600 bg-blue-200/30 min-w-12">
                                {codeLines.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`text-[11px] font-mono leading-5`}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                spellCheck={false}
                                placeholder="Enter your code here..."
                                className="flex-1 bg-transparent p-3 text-[12px] font-mono text-foreground leading-5 resize-none outline-none placeholder:text-muted-foreground"
                                rows={codeLines.length + 2}
                            />
                        </div>
                    </div>

                    {/* Right column: Instructions + inputs */}
                    <div className="flex flex-col gap-4">
                        {/* Instructions (collapsible) */}
                        <div className="rounded-xl border border-blue-600 bg-card overflow-hidden">
                            <button
                                onClick={() => setShowInstructions(!showInstructions)}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-200/30 transition-colors"
                            >
                                <span className="text-xs font-mono font-bold text-foreground">Instructions</span>
                                <div className="flex justify-between items-center gap-3">
                                    <span onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(getInstruction(code, currentArray.map((curr) => curr.value).toString())); toast("Copied!") }} ><Copy size={14} /></span>
                                    {showInstructions ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                                </div>
                            </button>
                            {showInstructions && (
                                <div className="px-4 pb-4 border-t border-blue-600">
                                    <pre className="text-xs font-mono text-blue-bg-blue-200-foreground leading-relaxed whitespace-pre-wrap pt-3 h-[45vh] overflow-y-scroll">
                                        {getInstruction(code, currentArray.map((curr) => curr.value).toString())}
                                    </pre>
                                </div>
                            )}
                        </div>

                        {/* JSON Array Input */}
                        <div className="rounded-xl border border-blue-600 bg-card p-4">
                            <label className="text-xs font-mono font-bold text-foreground mb-2 block">JSON Array Input</label>
                            <textarea
                                value={textValue}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setTextValue(value);

                                    try {
                                        const parsed = JSON.parse(value);
                                        setAlgoSteps(parsed); // update only if valid
                                    } catch {
                                        // ignore invalid JSON while typing
                                    }
                                }}
                                spellCheck={false}
                                rows={8}
                                placeholder='[
                                    {"action": "swap", "index_1": 1, "index_2": 2},
                                    {"action": "compare", "index_1": 2, "index_2": 3}
                                ]'
                                className="w-full bg-blue-200 rounded-lg border border-blue-600 px-3 py-2 text-xs font-mono text-black placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary resize-none transition-colors"
                            />
                        </div>

                        {/* Quick Array Input */}
                        <div className="rounded-xl border border-blue-600 bg-card p-4">
                            <label className="text-xs font-mono font-bold text-foreground mb-2 block">Quick Array Input</label>
                            <input
                                value={arrayInput}
                                onChange={(e) => {
                                    setArrayInput(e.target.value);
                                    syncArray(e.target.value);
                                }}
                                placeholder="5, 3, 8, 1, 2"
                                className="w-full bg-blue-200 rounded-lg border border-blue-600 px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-colors"
                            />
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {currentArray.map((v, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 rounded bg-primary/15 text-primary text-[11px] font-mono font-bold"
                                    >
                                        {v.value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* action buttons */}
            <div className="flex justify-around items-center w-[90%] mx-auto my-4">
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                    Upload
                </button>
            </div>

            {/* Controls */}
            <div className="border-b border-blue-600 bg-blue-200/30">
                <div className="container mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
                    <button
                        onClick={isPlaying ? () => setIsPlaying(false) : handleRun}
                        className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        {isPlaying ? "Pause" : "Run"}
                    </button>
                    <button
                        onClick={handleStepForward}
                        disabled={isPlaying}
                        className="flex items-center gap-1.5 rounded-lg border border-blue-600 bg-card px-4 py-2 text-xs font-mono text-foreground hover:bg-blue-200 transition-colors disabled:opacity-40"
                    >
                        <SkipForward size={14} />
                        Step
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 rounded-lg border border-blue-600 bg-card px-4 py-2 text-xs font-mono text-foreground hover:bg-blue-200 transition-colors"
                    >
                        <RotateCcw size={14} />
                        Reset
                    </button>
                    <div className="ml-auto text-[11px] font-mono text-muted-foreground">
                        {steps.length > 0 ? `Step ${stepIndex + 1} / ${steps.length}` : "Ready"}
                    </div>
                </div>
            </div>

            {/* Lower Section — Bar Visualization */}
            <div className="flex-1 container mx-auto px-4 py-8">
                <div className="rounded-xl border border-blue-600 bg-card p-6 min-h-75 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold text-foreground">Array Visualization</span>
                        <div className="flex items-center gap-4 text-[10px] font-mono">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-blue-200-foreground/40" />
                                <span className="text-muted-foreground">Default</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-accent" />
                                <span className="text-muted-foreground">Comparing</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-streak" />
                                <span className="text-muted-foreground">Swapping</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-primary" />
                                <span className="text-muted-foreground">Sorted</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end gap-1.5 justify-center">
                        {displayValues.map((val, i) => {
                            const heightPct = (val.value / maxVal) * 100;
                            return (
                                <div key={i} className="flex flex-col items-center gap-1 flex-1 max-w-16">
                                    <span className="text-[10px] font-mono text-muted-foreground font-bold">{val.value}</span>
                                    <div
                                        className={`w-full rounded-t-md transition-all duration-300`}
                                        style={{ height: `${Math.max(heightPct * 2.5, 8)}px`, backgroundColor: val.colour }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Visualizer;

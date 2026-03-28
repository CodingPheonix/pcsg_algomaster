'use client'

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, FileText, Play, Wand2, StickyNote, CheckCircle2, Circle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { SetWithProblems } from "./page";
import { useUserContext } from "../context/userContext";
import { fetchAllProblemStatus, updateAddProblemStatus, updateRemoveProblemStatus } from "../db/operations/userProblem";
import HintPopup from "../components/HintPopup";
import { verifySession } from "../lib/dal";

type Status = "not_started" | "in_progress" | "completed";

// interface Problem {
//     id: string;
//     name: string;
//     link: string;
//     difficulty: "Easy" | "Medium" | "Hard";
//     videoLink: string;
// }

// interface ProblemSection {
//     id: string;
//     name: string;
//     problems: Problem[];
// }

// const dummySections: ProblemSection[] = [
//     {
//         id: "1",
//         name: "Arrays",
//         problems: [
//             { id: "p1", name: "Two Sum", link: "https://leetcode.com/problems/two-sum", difficulty: "Easy", videoLink: "https://youtube.com/watch?v=example1" },
//             { id: "p2", name: "Best Time to Buy and Sell Stock", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock", difficulty: "Easy", videoLink: "https://youtube.com/watch?v=example2" },
//             { id: "p3", name: "Product of Array Except Self", link: "https://leetcode.com/problems/product-of-array-except-self", difficulty: "Medium", videoLink: "" },
//             { id: "p4", name: "Maximum Subarray", link: "https://leetcode.com/problems/maximum-subarray", difficulty: "Medium", videoLink: "https://youtube.com/watch?v=example4" },
//         ],
//     },
//     {
//         id: "2",
//         name: "Linked Lists",
//         problems: [
//             { id: "p5", name: "Reverse Linked List", link: "https://leetcode.com/problems/reverse-linked-list", difficulty: "Easy", videoLink: "https://youtube.com/watch?v=example5" },
//             { id: "p6", name: "Merge Two Sorted Lists", link: "https://leetcode.com/problems/merge-two-sorted-lists", difficulty: "Easy", videoLink: "" },
//             { id: "p7", name: "LRU Cache", link: "https://leetcode.com/problems/lru-cache", difficulty: "Hard", videoLink: "https://youtube.com/watch?v=example7" },
//         ],
//     },
//     {
//         id: "3",
//         name: "Trees",
//         problems: [
//             { id: "p8", name: "Binary Tree Inorder Traversal", link: "https://leetcode.com/problems/binary-tree-inorder-traversal", difficulty: "Easy", videoLink: "https://youtube.com/watch?v=example8" },
//             { id: "p9", name: "Validate Binary Search Tree", link: "https://leetcode.com/problems/validate-binary-search-tree", difficulty: "Medium", videoLink: "" },
//             { id: "p10", name: "Binary Tree Maximum Path Sum", link: "https://leetcode.com/problems/binary-tree-maximum-path-sum", difficulty: "Hard", videoLink: "https://youtube.com/watch?v=example10" },
//         ],
//     },
// ];

const ProblemSections = ({ allProblems, isVerified }: { allProblems: SetWithProblems[], isVerified: boolean }) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
        () => Object.fromEntries(allProblems.map((s) => [s.id, true]))
    );
    const [open, setOpen] = useState(false);
    const [problemStatusList, setProblemStatusList] = useState<string[]>([]);
    const [problemList, setProblemList] = useState<SetWithProblems[]>([]);
    const [displayedHints, setDisplayedHints] = useState<string[]>([])

    const { user } = useUserContext()
    const router = useRouter();

    const toggleSection = (id: string) => {
        setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const difficultyColor = (d: string) => {
        switch (d) {
            case "Easy":
                return "text-green-500";
            case "Normal":
                return "text-yellow-500";
            case "Hard":
                return "text-red-500";
            default:
                return "text-foreground";
        }
    };

    const getSectionProgress = (section: SetWithProblems) => {
        let completed = 0, total = 0

        section.problems.forEach((problem) => {
            if (problem.status === true) {
                completed += 1
            }
            total += 1
        })

        return { completed, total }
    };

    // const handleProblemStatusChange = async (problemId: string, isChecked: boolean) => {
    //     if (!problemId) return;

    //     allProblems.forEach((set) => set.problems.forEach((problem) => problem.id === problemId ? problem.status = isChecked : problem.status))

    //     isChecked ? await updateAddProblemStatus(user.id, problemId) : await updateRemoveProblemStatus(user.id, problemId);
    // }

    const handleProblemStatusChange = async (problemId: string, isChecked: boolean) => {
        if (!problemId) return;

        // ✅ Update UI state properly
        setProblemList(prev =>
            prev.map(set => ({
                ...set,
                problems: set.problems.map(problem =>
                    problem.id === problemId
                        ? { ...problem, status: isChecked }
                        : problem
                )
            }))
        )

        // ✅ Backend call
        if (isChecked) {
            await updateAddProblemStatus(user.id, problemId)
        } else {
            await updateRemoveProblemStatus(user.id, problemId)
        }
    }

    const showHints = async (hints: string[]) => {
        console.log(hints)

        setDisplayedHints(hints || [])
        setOpen(true)
    }


    useEffect(() => {
        const fetchProblemStatuses = async () => {
            const allProblemList = await fetchAllProblemStatus(user.id)
            console.log(allProblemList)

            if (!allProblemList || !allProblemList) {
                setProblemList(allProblems)
                return
            }

            const list = allProblemList as string[]

            // ✅ create new state immutably
            const updated = allProblems.map(set => ({
                ...set,
                problems: set.problems.map(problem => ({
                    ...problem,
                    status: list.includes(problem.id)
                }))
            }))

            setProblemList(updated)
        }

        fetchProblemStatuses()
    }, [user.id, allProblems])


    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Header */}
            <div className="border-b border-border bg-card mt-16 bg-blue-500 text-white">
                <div className="max-w-6xl mx-auto px-6 py-5">
                    <h1 className="text-2xl font-bold tracking-tight">Problem Sections</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Practice DSA problems organized by topic
                    </p>
                </div>
            </div>

            {/* Sections */}
            <div className="max-w-6xl mx-auto px-6 py-8 space-y-5">
                {problemList.map((section) => {
                    const { completed, total } = getSectionProgress(section);
                    const isExpanded = expandedSections[section.id];

                    return (
                        <div key={section.id} className="rounded-lg border border-border bg-card overflow-hidden">
                            {/* Section Header */}
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full flex items-center justify-between py-4 px-6 bg-blue-400 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {isExpanded ? (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    <h2 className="text-lg font-semibold">{section.title}</h2>
                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                        {total} problem{total !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-32 h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all duration-300"
                                            style={{ width: total > 0 ? `${(completed / total) * 100}%` : "0%" }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {completed}/{total}
                                    </span>
                                </div>
                            </button>

                            {/* Problems Table */}
                            {isExpanded && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border bg-blue-100">
                                                <th className="text-left px-6 py-3 font-medium text-muted-foreground w-10">#</th>
                                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Problem</th>
                                                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-24">Difficulty</th>
                                                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Resources</th>
                                                <th className="text-center px-4 py-3 font-medium text-muted-foreground w-24">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {section.problems.map((problem, idx) => {
                                                console.log(problem)
                                                return (
                                                    <tr
                                                        key={problem.id}
                                                        className="border-b border-border last:border-0 hover:bg-blue-100 transition-colors"
                                                    >
                                                        <td className="px-6 py-3 text-muted-foreground">{idx + 1}</td>
                                                        <td className="px-4 py-3">
                                                            <a
                                                                href={problem.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="font-medium text-blue-500 hover:underline inline-flex items-center gap-1.5"
                                                            >
                                                                {problem.title}
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                            </a>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`font-semibold text-xs ${difficultyColor(problem.difficulty)}`}>
                                                                {problem.difficulty}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="grid grid-cols-4 gap-2 justify-items-center" style={{ minWidth: '380px' }}>
                                                                <button
                                                                    onClick={() => router.push(`/practice/s?id=${problem.id}`)}
                                                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-input bg-background text-xs font-medium hover:bg-muted transition-colors w-full justify-center hover:bg-slate-100"
                                                                >
                                                                    <FileText className="h-3.5 w-3.5 shrink-0" />
                                                                    Solution
                                                                </button>
                                                                <div className="w-[85px] flex justify-center">
                                                                    {problem.video ? (
                                                                        <a
                                                                            href={problem.video}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-input bg-background text-xs font-medium hover:bg-muted transition-colors w-full justify-center hover:bg-slate-100"
                                                                        >
                                                                            <Play className="h-3.5 w-3.5 shrink-0" />
                                                                            Video
                                                                        </a>
                                                                    ) : (
                                                                        <span className="w-full" />
                                                                    )}
                                                                </div>
                                                                <div className="w-[85px] flex justify-center">
                                                                    {problem.visualsId ? (
                                                                        <button
                                                                            onClick={() => router.push(`practice/a?id=${problem.id}`)}
                                                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-input bg-background text-xs font-medium hover:bg-muted transition-colors w-full justify-center hover:bg-slate-100"
                                                                        >
                                                                            <Wand2 className="h-3.5 w-3.5 shrink-0" />
                                                                            Animation
                                                                        </button>
                                                                    ) : (
                                                                        <span className="w-full"></span>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    onClick={() => { showHints(problem.hints as string[]) }}
                                                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-input bg-background text-xs font-medium hover:bg-muted transition-colors w-[85px] justify-center hover:bg-slate-100"
                                                                >
                                                                    <StickyNote className="h-3.5 w-3.5 shrink-0" />
                                                                    Hints
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="flex justify-center items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-5 h-5"
                                                                    checked={problem.status === true}
                                                                    onChange={(e) => { isVerified && handleProblemStatusChange(problem.id, e.target.checked) }}
                                                                />
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}

                {open && (
                    <HintPopup hints={displayedHints} onClose={() => setOpen(false)} />
                )}
            </div>
        </div>
    );
};

export default ProblemSections;

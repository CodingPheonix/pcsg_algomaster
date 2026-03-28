'use client'

import React, { useEffect, useState } from "react";
import { Plus, Trash2, ExternalLink, FileText, Play, Wand2, ChevronDown, ChevronRight, FilePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteSetById, fetchSetWithProblemsById, insertSet } from "@/app/db/operations/set";
import { useUserContext } from "@/app/context/userContext";
import { toast, Toaster } from "sonner";
import { insertProblem, removeProblem, updateProblem } from "@/app/db/operations/problems";
// import { deleteSetProblem, insertSetProblem } from "@/app/db/operations/setProblem";
import { v4 } from "uuid";
import { deleteProblemDescription } from "@/app/db/operations/problemDescription";
import { deleteProblemVisuals } from "@/app/db/operations/problemVisuals";
import Navbar from "@/app/components/Navbar";

export interface Problem {
  id: string;
  name: string;
  link: string;
  difficulty: "Easy" | "Normal" | "Hard";
  videoLink: string;
}

interface ProblemSet {
  id: string;
  name: string;
  problems: Problem[];
  isExpanded: boolean;
}

const SetProblems = () => {
  // state list
  const [sets, setSets] = useState<ProblemSet[]>([]);
  const [newSetName, setNewSetName] = useState("");
  const [showCreateSet, setShowCreateSet] = useState(false);
  const [editingProblem, setEditingProblem] = useState<{ problemId: string, value: boolean }>({ problemId: "", value: false });
  const [formState, setFormState] = useState<Record<string, {
    name: string;
    link: string;
    difficulty: "Easy" | "Normal" | "Hard";
    videoLink: string;
    showForm: boolean;
  }>>({});

  // Contexts
  const router = useRouter();
  const { user } = useUserContext()

  // Functions
  const createSet = () => {
    if (!newSetName.trim()) return;

    const newSet: ProblemSet = {
      id: crypto.randomUUID(),
      name: newSetName.trim(),
      problems: [],
      isExpanded: true,
    };

    insertSet(newSet.id, newSet.name, user.id);

    setSets((prev) => [...prev, newSet]);
    setFormState((prev) => ({
      ...prev,
      [newSet.id]: { name: "", link: "", difficulty: "Easy", videoLink: "", showForm: false },
    }));

    setNewSetName("");
    setShowCreateSet(false);
  };

  const toggleSet = (setId: string) => {
    setSets((prev) =>
      prev.map((s) => (s.id === setId ? { ...s, isExpanded: !s.isExpanded } : s))
    );
  };

  const deleteSet = async (setId: string) => {
    
    // Delete all problems in a set from db
    for (const set of sets) {
      if (set.id === setId) {
        for (const problem of set.problems) {
          await deleteProblem(problem.id);
        }
      }
    }

    await deleteSetById(setId);

    setSets((prev) => prev.filter((s) => s.id !== setId));
    setFormState((prev) => {
      const copy = { ...prev };
      delete copy[setId];
      return copy;
    });

    toast("Set deleted");
  };

  const toggleForm = (setId: string, problem?: Problem) => {
    setFormState((prev) => ({
      ...prev,
      [setId]: {
        ...prev[setId],
        showForm: !prev[setId]?.showForm,
        name: problem?.name as string,
        difficulty: problem?.difficulty as "Easy" | "Normal" | "Hard",
        link: problem?.link as string,
        videoLink: problem?.videoLink as string
      },
    }));
  };

  // const toggleForm = (setId: string) => {
  //   setFormState(prev => ({
  //     ...prev,
  //     [setId]: prev[setId] ?? {
  //       name: "",
  //       link: "",
  //       difficulty: "Easy",
  //       videoLink: "",
  //       showForm: true
  //     }
  //   }));
  // };

  const updateForm = (setId: string, field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [setId]: { ...prev[setId], [field]: value },
    }));
  };

  const addProblem = async (setId: string) => {
    const form = formState[setId];
    if (!form?.name.trim() || !form?.link.trim()) {
      toast("Complete the fields");
      return;
    }
    const newProblem: Problem = {
      id: editingProblem.value ? editingProblem.problemId : v4(),
      name: form.name.trim(),
      link: form.link.trim(),
      difficulty: form.difficulty ?? "Easy",
      videoLink: form.videoLink?.trim() || "",
    };

    if (editingProblem.value) {

      await updateProblem(newProblem);

      setSets((prev) =>
        prev.map((s) =>
          s.id === setId
            ? {
              ...s,
              problems: s.problems.map((p) =>
                p.id === newProblem.id ? { ...p, ...newProblem } : p
              ),
            }
            : s
        )
      );

      setFormState((prev) => ({
        ...prev,
        [setId]: { name: "", link: "", difficulty: "Easy", videoLink: "", showForm: false },
      }));

      toast("Problem Updated")
    } else {
      await insertProblem(newProblem, user.id, setId);
      // await insertSetProblem(setId, newProblem.id);

      setSets((prev) =>
        prev.map((s) =>
          s.id === setId ? { ...s, problems: [...s.problems, newProblem] } : s
        )
      );

      setFormState((prev) => ({
        ...prev,
        [setId]: { name: "", link: "", difficulty: "Easy", videoLink: "", showForm: false },
      }));
    }
  };

  const deleteProblem = async (problemId: string, setId?: string) => {

    console.log("deleting...", problemId, setId)

    setId && setSets((prev) =>
      prev.map((s) =>
        s.id === setId
          ? { ...s, problems: s.problems.filter((p) => p.id !== problemId) }
          : s
      )
    );

    // await deleteSetProblem(problemId);
    await deleteProblemDescription(problemId);
    await deleteProblemVisuals(problemId);
    await removeProblem(problemId);

    setId && toast("Problem deleted!");
  };

  const difficultyColor = (d: string) => {
    switch (d) {
      case "Easy": return "text-green-500";
      case "Normal": return "text-yellow-500";
      case "Hard": return "text-red-500";
      default: return "text-foreground";
    }
  };

  // UseEffects
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSetWithProblemsById(user.id);

      setSets(
        data.map((set: { id: any; name: any; problems: any[]; }) => ({
          id: set.id,
          name: set.name,
          isExpanded: false,
          problems: set.problems.map(problem => ({
            id: problem.id as string,
            name: problem.name,
            link: problem.link,
            difficulty: problem.difficulty,
            videoLink: problem.videoLink || ""
          }))
        }))
      );
    }
    fetchData()
  }, [user.id])


  return (
    <div className="min-h-screen">
      <Toaster />
      <Navbar />

      {/* Header */}
      <div className="border-b border-border bg-blue-500 text-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Problem Sets</h1>
            <p className="text-sm text-blue-300bg-blue-300-foreground mt-1">
              Create and manage DSA problem sets for students
            </p>
          </div>
          {!showCreateSet ? (
            <button
              onClick={() => setShowCreateSet(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Set
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                placeholder="Set name (e.g. Arrays, Trees)"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createSet()}
                className="w-64 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-blue-300bg-blue-300-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              <button
                onClick={createSet}
                className="px-3 py-1.5 rounded-md bg-white text-blue-500 text-sm font-medium hover:text-blue-600  transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => { setShowCreateSet(false); setNewSetName(""); }}
                className="px-3 py-1.5 rounded-md text-sm hover:bg-white hover:text-blue-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {sets.length === 0 && (
          <div className="text-center py-20 text-blue-300bg-blue-300-foreground">
            <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No problem sets yet</p>
            <p className="text-sm mt-1">Click "Create Set" to get started</p>
          </div>
        )}

        {sets.map((set) => (
          <div key={set.id} className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            {/* Set Header */}
            <div
              className="cursor-pointer select-none flex items-center justify-between py-4 px-6 bg-blue-300 hover:bg-blue-300/90 transition-colors"
              onClick={() => toggleSet(set.id)}
            >
              <div className="flex items-center gap-3">
                {set.isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-blue-300bg-blue-300-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-blue-300bg-blue-300-foreground" />
                )}
                <h3 className="text-lg font-semibold">{set.name}</h3>
                <span className="text-xs text-blue-300bg-blue-300-foreground bg-blue-300 px-2 py-0.5 rounded-full">
                  {set.problems.length} problem{set.problems.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => { !set.isExpanded && toggleSet(set.id); toggleForm(set.id) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Problem
                </button>
                <button
                  onClick={() => deleteSet(set.id)}
                  className="p-2 rounded-md hover:text-destructive hover:bg-blue-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {set.isExpanded && (
              <div>
                {/* Add Problem Form */}
                {formState[set.id]?.showForm && (
                  <div className="border-b border-border bg-blue-300/10 px-6 py-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <input
                          placeholder="Problem name *"
                          value={formState[set.id]?.name || ""}
                          onChange={(e) => updateForm(set.id, "name", e.target.value)}
                          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />

                        <input
                          placeholder="Problem link *"
                          value={formState[set.id]?.link || ""}
                          onChange={(e) => updateForm(set.id, "link", e.target.value)}
                          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />

                        <select
                          value={formState[set.id]?.difficulty || "Easy"}
                          onChange={(e) => updateForm(set.id, "difficulty", e.target.value)}
                          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Normal">Normal</option>
                          <option value="Hard">Hard</option>
                        </select>

                        <input
                          placeholder="Video link (optional)"
                          value={formState[set.id]?.videoLink || ""}
                          onChange={(e) => updateForm(set.id, "videoLink", e.target.value)}
                          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => { toggleForm(set.id); editingProblem.value && setEditingProblem({ ...editingProblem, value: false }) }}
                        className="px-3 py-1.5 rounded-md text-sm text-blue-300bg-blue-300-foreground hover:bg-blue-300 hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => addProblem(set.id)}
                        className="px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-500/90 transition-colors"
                      >
                        {editingProblem.value ? 'Update Problem' : 'Add Problem'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Problems Table */}
                {set.problems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-blue-300/20">
                          <th className="text-left px-6 py-3 font-medium text-blue-300bg-blue-300-foreground w-8">#</th>
                          <th className="text-left px-4 py-3 font-medium text-blue-300bg-blue-300-foreground">Problem</th>
                          <th className="text-left px-4 py-3 font-medium text-blue-300bg-blue-300-foreground w-24">Difficulty</th>
                          <th className="text-center px-4 py-3 font-medium text-blue-300bg-blue-300-foreground w-64">Resources</th>
                          <th className="w-12" />
                        </tr>
                      </thead>
                      <tbody>
                        {set.problems.map((problem, idx) => (
                          <tr
                            key={problem.id}
                            className="border-b border-border last:border-0 hover:bg-blue-300/20 transition-colors"
                          >
                            <td className="px-6 py-3 text-blue-300bg-blue-300-foreground">{idx + 1}</td>
                            <td className="px-4 py-3">
                              <a
                                href={problem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-500 hover:underline inline-flex items-center gap-1.5"
                              >
                                {problem.name}
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`font-semibold text-xs ${difficultyColor(problem.difficulty)}`}>
                                {problem.difficulty}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => router.push(`/admin/problem/solution?title=${problem.name.split(" ").join("+")}&id=${problem.id}`)}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-input bg-background text-xs font-medium hover:bg-blue-300 transition-colors"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                  Solution
                                </button>
                                {problem.videoLink && (
                                  <a
                                    href={problem.videoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-input bg-background text-xs font-medium hover:bg-blue-300 transition-colors"
                                  >
                                    <Play className="h-3.5 w-3.5" />
                                    Video
                                  </a>
                                )}
                                <button
                                  onClick={() => router.push(`/admin/problem/animation?id=${problem.id}`)}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-input bg-background text-xs font-medium hover:bg-blue-300 transition-colors"
                                >
                                  <Wand2 className="h-3.5 w-3.5" />
                                  Animation
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 flex gap-3">
                              <button
                                onClick={() => { toggleForm(set.id, problem); setEditingProblem({ ...editingProblem, value: true, problemId: problem.id }) }}
                                className="p-1.5 rounded-md text-blue-300bg-blue-300-foreground hover:text-destructive hover:bg-blue-300 transition-colors"
                              >
                                <FilePen className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProblem(problem.id, set.id)}
                                className="p-1.5 rounded-md text-blue-300bg-blue-300-foreground hover:text-destructive hover:bg-blue-300 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  !formState[set.id]?.showForm && (
                    <div className="text-center py-8 text-blue-300bg-blue-300-foreground text-sm">
                      No problems yet. Click "Add Problem" to start.
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetProblems;

'use client'

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  FileText,
  ArrowLeft,
  Pencil,
  Check,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { addSubTopic, fetchTutorials, insertTutorial } from "@/app/db/operations/tutorials";
import { v4 as UUIDv4 } from "uuid";
import { useUserContext } from "@/app/context/userContext";
import { insertTopic } from "@/app/db/operations/topics";

interface SubTopic {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  name: string;
  subtopics: SubTopic[];
  expanded: boolean;
}

const generateId = () => UUIDv4();

const ManageTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState("");

  const router = useRouter();
  const userContext = useUserContext();
  const user = userContext.user

  const addTopic = () => {
    if (!newTopicName.trim()) return;
    setTopics((prev) => [
      ...prev,
      { id: generateId(), name: newTopicName.trim(), subtopics: [], expanded: true },
    ]);

    insertTutorial({
      id: UUIDv4(),
      title: newTopicName.trim(),
      subtopic: null,
      authorId: user?.id || "unknown", 
    })

    setNewTopicName("");
  };

  const removeTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleExpand = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t))
    );
  };

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingValue(currentName);
  };

  const confirmEdit = () => {
    if (!editingId || !editingValue.trim()) return;
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === editingId) return { ...t, name: editingValue.trim() };
        return {
          ...t,
          subtopics: t.subtopics.map((s) =>
            s.id === editingId ? { ...s, name: editingValue.trim() } : s
          ),
        };
      })
    );
    setEditingId(null);
    setEditingValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const addSubtopic = async (topicId: string) => {
    if (!newSubName.trim()) return;

    const subtopicId = generateId();

    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
            ...t,
            expanded: true,
            subtopics: [...t.subtopics, { id: subtopicId, name: newSubName.trim() }],
          }
          : t
      )
    );

    console.log(topicId)

    await addSubTopic(topicId, {id: subtopicId, name: newSubName.trim()});

    await insertTopic({
      id: subtopicId,
      tutorial_id: topicId
    })

    setNewSubName("");
    setAddingSubFor(null);
  };

  const removeSubtopic = (topicId: string, subId: string) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? { ...t, subtopics: t.subtopics.filter((s) => s.id !== subId) }
          : t
      )
    );
  };

  useEffect(() => {
    const fetch_tutorials = async () => {
      if (!user?.id) return;

      const tutorials = await fetchTutorials(user?.id);
      console.log(tutorials)
      setTopics(tutorials.map((t) => {


        return {
          id: t.id,
          name: t.title,
          subtopics: t.subtopic ? t.subtopic.map((s) => ({ id: s.id, name: s.name })) : [],
          expanded: false
        }
      }));
    }

    fetch_tutorials();
  }, [user?.id]);
  
  console.log("Topics state:", topics);

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <a
            href="/"
            className="flex items-center gap-2 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-mono">Back</span>
          </a>
          <h1 className="text-sm font-mono font-bold">Manage Topics</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Add topic input */}
        <div className="mb-8 flex gap-2">
          <input
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTopic()}
            placeholder="New topic name..."
            className="flex-1 rounded-lg border border-blue-600 px-3 py-2.5 text-sm font-mono outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <button
            onClick={addTopic}
            disabled={!newTopicName.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-mono font-medium text-white hover:bg-blue-500/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} />
            Add Topic
          </button>
        </div>

        {/* Empty state */}
        {topics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-600 rounded-xl">
            <FolderOpen size={40} className="text-white/70/40 mb-3" />
            <p className="text-sm text-white/70 font-mono">No topics yet</p>
            <p className="text-xs text-white/70/60 font-mono mt-1">
              Create your first topic above
            </p>
          </div>
        )}

        {/* Topics list */}
        <div className="space-y-3">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="rounded-xl border border-blue-600 bg-card overflow-hidden"
            >
              {/* Topic header */}
              <div className="flex items-center gap-2 px-4 py-3">
                <button
                  onClick={() => toggleExpand(topic.id)}
                  className="p-0.5 transition-colors"
                >
                  {topic.expanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                <FolderOpen size={16} className="text-blue-500 shrink-0" />

                {editingId === topic.id ? (
                  <div className="flex flex-1 items-center gap-1.5">
                    <input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                      className="flex-1 rounded px-2 py-1 text-sm font-mono outline-none border border-blue-500"
                    />
                    <button onClick={confirmEdit} className="p-1 text-blue-500 hover:text-blue-500/80">
                      <Check size={14} />
                    </button>
                    <button onClick={cancelEdit} className="p-1">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <span className="flex-1 text-sm font-mono font-medium">
                    {topic.name}
                  </span>
                )}

                <span className="text-[10px] font-mono">
                  {topic.subtopics.length} sub
                </span>

                {editingId !== topic.id && (
                  <>
                    <button
                      onClick={() => startEdit(topic.id, topic.name)}
                      className="p-1 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => {
                        setAddingSubFor(addingSubFor === topic.id ? null : topic.id);
                        setNewSubName("");
                      }}
                      className="p-1 hover:text-blue-500 transition-colors"
                      title="Add subtopic"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeTopic(topic.id)}
                      className="p-1 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>

              {/* Subtopics */}
              {topic.expanded && (
                <div className="px-4 pb-3">
                  {topic.subtopics.length === 0 && addingSubFor !== topic.id && (
                    <p className="py-3 pl-7 text-xs text-white/70/60 font-mono">
                      No subtopics — click + to add one
                    </p>
                  )}

                  {topic.subtopics.map((sub, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-2 py-2 pl-7 border-b border-slate-600/50 last:border-0"
                    >
                      <FileText size={14} className="text-white/70 shrink-0" />

                      {editingId === sub.id ? (
                        <div className="flex flex-1 items-center gap-1.5">
                          <input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") confirmEdit();
                              if (e.key === "Escape") cancelEdit();
                            }}
                            autoFocus
                            className="flex-1 rounded px-2 py-1 text-sm font-mono outline-none border border-blue-500bg-blue-500"
                          />
                          <button onClick={confirmEdit} className="p-1 text-blue-500 hover:text-blue-500/80">
                            <Check size={14} />
                          </button>
                          <button onClick={cancelEdit} className="p-1">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="flex-1 text-sm font-mono text-slate-950bg-slate-950-white">
                          {sub.name}
                        </span>
                      )}

                      {editingId !== sub.id && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                          onClick={() => {router.push(`/admin/topic?topic=${topic.id}&sub=${sub.id}`)}}
                          className="p-1 transition-colors">
                            <ArrowUpRight size={17} />
                          </button>
                          <button
                            onClick={() => startEdit(sub.id, sub.name)}
                            className="p-1 transition-colors"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => removeSubtopic(topic.id, sub.id)}
                            className="p-1 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add subtopic inline */}
                  {addingSubFor === topic.id && (
                    <div className="flex items-center gap-2 py-2 pl-7">
                      <FileText size={14} className="text-blue-500 shrink-0" />
                      <input
                        value={newSubName}
                        onChange={(e) => setNewSubName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addSubtopic(topic.id);
                          if (e.key === "Escape") {
                            setAddingSubFor(null);
                            setNewSubName("");
                          }
                        }}
                        placeholder="Subtopic name..."
                        autoFocus
                        className="flex-1 rounded-lg border border-slate-600 px-2.5 py-1.5 text-sm font-mono outline-none focus:ring-1 focus:ring-blue-500bg-blue-500"
                      />
                      <button
                        onClick={() => addSubtopic(topic.id)}
                        disabled={!newSubName.trim()}
                        className="p-1.5 rounded bg-blue-500 text-white hover:bg-blue-500/90 disabled:opacity-40 transition-colors"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setAddingSubFor(null);
                          setNewSubName("");
                        }}
                        className="p-1.5 text-white/70 hover:text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTopics;

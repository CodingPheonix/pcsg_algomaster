export type Compare = {
  action: "compare"
  index_1: number
  index_2: number
}

export type Swap = {
  action: "swap"
  index_1: number
  index_2: number
}

export type SetValue = {
  action: "set"
  index: number
  value: number
}

export type Access = {
  action: "access"
  index: number
}

export type MarkSorted = {
  action: "mark_sorted"
  index: number
}

export type MovePointer = {
  action: "move_pointer"
  pointer: string
  index: number
}

export type HighlightRange = {
  action: "highlight_range"
  start: number
  end: number
}

export type PushTemp = {
  action: "push_temp"
  value: number
}

export type PopTemp = {
  action: "pop_temp"
}

export type WriteBack = {
  action: "write_back"
  index: number
  value: number
}

export type VisitNode = {
  action: "visit_node"
  node: number
}

export type ExploreEdge = {
  action: "explore_edge"
  from: number
  to: number
}

export type AddToQueue = {
  action: "add_to_queue"
  node: number
}

export type RemoveFromQueue = {
  action: "remove_from_queue"
  node: number
}

export type CallFunction = {
  action: "call"
  function: string
  args: any[]
}

export type ReturnFunction = {
  action: "return"
  function: string
}

export type Log = {
  action: "log"
  message: string
}

export type Pause = {
  action: "pause"
  time: number
}

export type VisualizerAction =
  | Compare
  | Swap
  | SetValue
  | Access
  | MarkSorted
  | MovePointer
  | HighlightRange
  | PushTemp
  | PopTemp
  | WriteBack
  | VisitNode
  | ExploreEdge
  | AddToQueue
  | RemoveFromQueue
  | CallFunction
  | ReturnFunction
  | Log
  | Pause


// Static colors for visualization
export const ActionColors: Record<VisualizerAction["action"], string> = {
  compare: "#facc15",        // yellow
  swap: "#ef4444",           // red
  set: "#3b82f6",            // blue
  access: "#a78bfa",         // purple
  mark_sorted: "#22c55e",    // green
  move_pointer: "#fb923c",   // orange
  highlight_range: "#06b6d4",// cyan
  push_temp: "#8b5cf6",      // violet
  pop_temp: "#6366f1",       // indigo
  write_back: "#14b8a6",     // teal
  visit_node: "#10b981",     // emerald
  explore_edge: "#f97316",   // deep orange
  add_to_queue: "#84cc16",   // lime
  remove_from_queue: "#65a30d",
  call: "#e879f9",           // pink
  return: "#c084fc",         // light purple
  log: "#9ca3af",            // gray
  pause: "#6b7280"           // darker gray
}

export function getInstruction(code: string, inputArray: string) {
  const INSTRUCTIONS = `
You are an expert in determining steps of an algorithm, label them and create a json array of the steps.

You are given the following code snippet:
${code}

you are given the following array: ${inputArray}

you are to generate an intermediate code for the given code such that you can get the indivisual steps. given below are the steps. Use only the ones you require for this algorithm:
type Compare = {
  action: "compare"
  index_1: number
  index_2: number
}

type Swap = {
  action: "swap"
  index_1: number
  index_2: number
}

type SetValue = {
  action: "set"
  index: number
  value: number
}

type Access = {
  action: "access"
  index: number
}

type MarkSorted = {
  action: "mark_sorted"
  index: number
}

type MovePointer = {
  action: "move_pointer"
  pointer: string
  index: number
}

type HighlightRange = {
  action: "highlight_range"
  start: number
  end: number
}

type PushTemp = {
  action: "push_temp"
  value: number
}

type PopTemp = {
  action: "pop_temp"
}

type WriteBack = {
  action: "write_back"
  index: number
  value: number
}

type VisitNode = {
  action: "visit_node"
  node: number
}

type ExploreEdge = {
  action: "explore_edge"
  from: number
  to: number
}

type AddToQueue = {
  action: "add_to_queue"
  node: number
}

type RemoveFromQueue = {
  action: "remove_from_queue"
  node: number
}

type CallFunction = {
  action: "call"
  function: string
  args: any[]
}

type ReturnFunction = {
  action: "return"
  function: string
}

type Log = {
  action: "log"
  message: string
}

type Pause = {
  action: "pause"
  time: number
}

Generate only the array and nothing else
`;

  return INSTRUCTIONS;
}
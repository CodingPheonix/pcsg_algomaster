import { Elements } from "./page";
import { Access, AddToQueue, CallFunction, Compare, ExploreEdge, HighlightRange, Log, MarkSorted, MovePointer, Pause, PopTemp, PushTemp, RemoveFromQueue, ReturnFunction, SetValue, Swap, VisitNode, VisualizerAction, WriteBack } from "./tools";
import { ActionColors } from "./tools";

export function compare(arr: Elements[], task: Compare) {
    arr[task.index_1].colour = ActionColors[task.action]
    arr[task.index_2].colour = ActionColors[task.action]
}

export function swap(arr: Elements[], task: Swap) {
    console.log("before swap", arr)
    arr[task.index_1].colour = ActionColors[task.action]
    arr[task.index_2].colour = ActionColors[task.action]
    
    const temp = arr[task.index_1].value
    arr[task.index_1].value = arr[task.index_2].value
    arr[task.index_2].value = temp
    console.log("after swap", arr)
}

export function setValue(arr: Elements[], task: SetValue) {
    arr[task.index].colour = ActionColors[task.action];
    arr[task.index].value = task.value;
}

export function access(arr: Elements[], task: Access) {
    arr[task.index].colour = ActionColors[task.action];
}

export function markSorted(arr: Elements[], task: MarkSorted) {
    arr[task.index].colour = ActionColors[task.action];
}

export function movePointer(arr: Elements[], task: MovePointer, pointers: Record<string, number>) {
    arr[task.index].colour = ActionColors[task.action];
    pointers[task.pointer] = task.index;
}

export function highlightRange(arr: Elements[], task: HighlightRange) {
    for (let i = task.start; i <= task.end; i++) {
        arr[i].colour = ActionColors[task.action];
    }
}

export function pushTemp(arr: Elements[], task: PushTemp) {
    arr.push({ value: task.value, colour: ActionColors[task.action] });
}

export function popTemp(arr: Elements[]) {
    arr.pop();
}

export function writeBack(arr: Elements[], task: WriteBack) {
    arr[task.index].colour = ActionColors[task.action];
    arr[task.index].value = task.value;
}

export function visitNode(arr: Elements[], task: VisitNode) {
    arr[task.node].colour = ActionColors[task.action];
}

export function exploreEdge(edges: {from: number, to: number, colour: string}[], task: ExploreEdge) {
    // Example: edges could be visualized as objects with colour
    edges.push({ from: task.from, to: task.to, colour: ActionColors[task.action] });
}

export function addToQueue(arr: number[], task: AddToQueue) {
    arr.push(task.node);
}

export function removeFromQueue(arr: number[], task: RemoveFromQueue) {
    const index = arr.indexOf(task.node);
    if (index !== -1) arr.splice(index, 1);
}

export function callFunction(task: CallFunction) {
    console.log(`Calling function ${task.function} with args:`, task.args);
}

export function returnFunction(task: ReturnFunction) {
    console.log(`Returning from function ${task.function}`);
}

export function logMessage(task: Log) {
    console.log(task.message);
}

export function pause(task: Pause) {
    return new Promise((resolve) => setTimeout(resolve, task.time));
}

export const mapping = (index: number, arr: Elements[], task: VisualizerAction, pointers?: Record<string, number>) => {
    switch (task.action) {
        case "compare":
            compare(arr, task);
            break;
        case "swap":
            swap(arr, task);
            break;
        case "set":
            setValue(arr, task);
            break;
        case "access":
            access(arr, task);
            break;
        case "mark_sorted":
            markSorted(arr, task);
            break;
        case "move_pointer":
            if (pointers) movePointer(arr, task, pointers);
            break;
        case "highlight_range":
            highlightRange(arr, task);
            break;
        case "push_temp":
            pushTemp(arr, task);
            break;
        case "pop_temp":
            popTemp(arr);
            break;
        case "write_back":
            writeBack(arr, task);
            break;
        case "visit_node":
            visitNode(arr, task);
            break;
        case "explore_edge":
            exploreEdge(arr as any, task); // edges array passed as arr if needed
            break;
        case "add_to_queue":
            addToQueue(arr as any, task);
            break;
        case "remove_from_queue":
            removeFromQueue(arr as any, task);
            break;
        case "call":
            callFunction(task);
            break;
        case "return":
            returnFunction(task);
            break;
        case "log":
            logMessage(task);
            break;
        case "pause":
            return pause(task);
        default:
            break;
    }
}
import { commitDeletion, updateDOM } from "./dom.js";
import { fiberState } from "./state.js";
import { WorkUnit } from "./types.js";

export function commitRoot() {
    fiberState.deletions?.forEach(commitWork);
    if (fiberState.workInProgressRoot && fiberState.workInProgressRoot.child) {
        commitWork(fiberState.workInProgressRoot.child);
        fiberState.currentRoot = fiberState.workInProgressRoot;
    }
    fiberState.workInProgressRoot = null;
}

export function commitWork(fiber: WorkUnit | null | undefined) {
    if (fiber) {
        let domParentFiber = fiber.parent;
        while (domParentFiber && !domParentFiber.dom) {
            domParentFiber = domParentFiber.parent;
        }
        if (domParentFiber && domParentFiber.dom) {
            const domParent = domParentFiber.dom;

            if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
                domParent.appendChild(fiber.dom);
            } else if (fiber.effectTag === "DELETION" && fiber.dom) {
                commitDeletion(fiber, domParent);
            } else if (fiber.effectTag === "UPDATE" && fiber.dom && fiber.alternate) {
                updateDOM(fiber.dom, fiber.alternate.props, fiber.props);
            }
        }
        commitWork(fiber.child);
        commitWork(fiber.sibling);
    }
}
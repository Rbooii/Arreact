import { UpdateFunctionComponent } from "../hooks/useState.js";
import { fiberState } from "./state.js";
import { ArreactElement, WorkUnit } from "./types.js";
import { UpdateHostComponent } from "./dom.js";

export function reconcileChildren(fiber: WorkUnit, elements: ArreactElement[]) {
    let idx = 0;
    let oldFiber = fiber.alternate && fiber.alternate.child;
    let prevsib: WorkUnit | null = null;
    while (idx < elements.length || oldFiber != null) {
        const e = elements[idx];
        let newFiber: WorkUnit | null = null;
        const sameType = oldFiber && e && e.type === oldFiber.type;
        if (sameType && oldFiber) {
            newFiber = {
                type: oldFiber.type,
                props: e.props,
                dom: oldFiber.dom,
                parent: fiber,
                alternate: oldFiber,
                effectTag: "UPDATE",
            }
        }
        if (e && !sameType) {
            newFiber = {
                type: e.type,
                props: e.props,
                dom: null,
                parent: fiber,
                alternate: null,
                effectTag: "PLACEMENT",
            }
        }
        if (oldFiber && !sameType && fiberState.deletions) {
            oldFiber.effectTag = "DELETION";
            fiberState.deletions.push(oldFiber);
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }
        if (idx === 0) {
            fiber.child = newFiber
        } else if (e && prevsib) {
            prevsib.sibling = newFiber
        }
        prevsib = newFiber
        idx++
    }
}

export function performUnitofWork(fiber: WorkUnit) {
    const isFunc = fiber.type instanceof Function;

    if (isFunc) {
        UpdateFunctionComponent(fiber);
    } else {
        UpdateHostComponent(fiber);
    }

    if (fiber.child) {
        return fiber.child;
    }
    let nextFiber: WorkUnit | undefined = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
    return null;
}
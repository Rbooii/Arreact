import { commitDeletion, updateDOM } from "./dom.js";
import { fiberState } from "./state.js";
export function commitRoot() {
    fiberState.deletions?.forEach(commitWork);
    if (fiberState.workInProgressRoot && fiberState.workInProgressRoot.child) {
        commitWork(fiberState.workInProgressRoot.child);
        commitEffects(fiberState.workInProgressRoot.child);
        fiberState.currentRoot = fiberState.workInProgressRoot;
    }
    fiberState.workInProgressRoot = null;
    // Ada setState yang numpuk selagi render ini berlangsung — proses
    // sebagai satu render susulan sekarang bahwa currentRoot sudah fresh.
    if (fiberState.pendingRender && fiberState.currentRoot) {
        fiberState.pendingRender = false;
        fiberState.workInProgressRoot = {
            dom: fiberState.currentRoot.dom,
            props: fiberState.currentRoot.props,
            alternate: fiberState.currentRoot,
        };
        fiberState.nextUnitOfWork = fiberState.workInProgressRoot;
        fiberState.deletions = [];
    }
}
function commitEffects(fiber) {
    if (!fiber)
        return;
    if (fiber.effectHooks) {
        fiber.effectHooks.forEach((hook) => {
            if (hook.tag === "RUN") {
                hook.cleanup?.();
                hook.cleanup = hook.effect() ?? undefined;
            }
        });
    }
    commitEffects(fiber.child);
    commitEffects(fiber.sibling);
}
export function commitWork(fiber) {
    if (fiber) {
        let domParentFiber = fiber.parent;
        while (domParentFiber && !domParentFiber.dom) {
            domParentFiber = domParentFiber.parent;
        }
        if (domParentFiber && domParentFiber.dom) {
            const domParent = domParentFiber.dom;
            if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
                domParent.appendChild(fiber.dom);
            }
            else if (fiber.effectTag === "DELETION" && fiber.dom) {
                commitDeletion(fiber, domParent);
            }
            else if (fiber.effectTag === "UPDATE" && fiber.dom && fiber.alternate) {
                updateDOM(fiber.dom, fiber.alternate.props, fiber.props);
            }
        }
        commitWork(fiber.child);
        commitWork(fiber.sibling);
    }
}

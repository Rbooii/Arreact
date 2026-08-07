import { reconcileChildren } from "../utils/fiber.js";
import { fiberState } from "../utils/state.js";
import { WorkUnit } from "../utils/types.js";

export function UpdateFunctionComponent(fiber: WorkUnit) {
    if (fiber.type && fiber.type instanceof Function) {
        fiberState.wipFiber = fiber;
        fiberState.hookIndex = 0;
        fiberState.wipFiber.hooks = [];
        fiberState.wipFiber.effectHooks = [];
        fiberState.effectIndex = 0;
        const children = [fiber.type(fiber.props)]
        reconcileChildren(fiber, children);
    }
}

export function useState<T>(
    initial: T
): [T, (action: T | ((prev: T) => T)) => void] {
    const { wipFiber, hookIndex } = fiberState;
    if (wipFiber && hookIndex !== null) {
        const oldHook =
            wipFiber.alternate &&
            wipFiber.alternate.hooks &&
            wipFiber.alternate.hooks[hookIndex];

        // reuse objek hook lama supaya setState dari render sebelumnya
        // (stale closure) tetap menulis ke queue yang dibaca render berikutnya
        const hook: { state: T; queue: ((prev: T) => T)[] } = oldHook
            ? oldHook
            : { state: initial, queue: [] };

        const actions: ((prev: T) => T)[] = hook.queue;
        hook.queue = [];
        actions.forEach((action) => {
            hook.state = action(hook.state);
        });

        const setState = (action: T | ((prev: T) => T)) => {
            if (!fiberState.currentRoot) return;

            hook.queue.push(
                typeof action === "function"
                    ? (action as (prev: T) => T)
                    : () => action
            );

            // Ada render lain yang masih jalan (belum sempat commit) —
            // jangan timpa progressnya, cukup tandai ada update pending.
            // commitRoot() akan trigger render susulan setelah ini selesai.
            if (fiberState.workInProgressRoot) {
                fiberState.pendingRender = true;
                return;
            }

            fiberState.workInProgressRoot = {
                dom: fiberState.currentRoot.dom,
                props: fiberState.currentRoot.props,
                alternate: fiberState.currentRoot,
            };
            fiberState.nextUnitOfWork = fiberState.workInProgressRoot;
            fiberState.deletions = [];
        };

        wipFiber.hooks!.push(hook);
        fiberState.hookIndex = hookIndex + 1;
        return [hook.state, setState];
    }

    return [initial, () => {}];
}
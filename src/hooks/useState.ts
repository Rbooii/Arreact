import { reconcileChildren } from "../utils/fiber.js";
import { fiberState } from "../utils/state.js";
import { WorkUnit } from "../utils/types.js";

export function UpdateFunctionComponent(fiber: WorkUnit) {
    if (fiber.type && fiber.type instanceof Function) {
        fiberState.wipFiber = fiber;
        fiberState.hookIndex = 0;
        fiberState.wipFiber.hooks = [];
        const children = [fiber.type(fiber.props)]
        reconcileChildren(fiber, children);
    }
}

export function useState<T>(
    initial: T
): [T, (action: T | ((prev: T) => T)) => void] {
    const hook: { state: T; queue: ((prev: T) => T)[] } = {
        state: initial,
        queue: [],
    };

    const { wipFiber, hookIndex } = fiberState;
    if (wipFiber && hookIndex !== null) {
        const oldHook =
            wipFiber.alternate &&
            wipFiber.alternate.hooks &&
            wipFiber.alternate.hooks[hookIndex];

        hook.state = oldHook ? oldHook.state : initial;

        const actions: ((prev: T) => T)[] = oldHook ? oldHook.queue : [];
        actions.forEach((action) => {
            hook.state = action(hook.state);
        });

        const setState = (action: T | ((prev: T) => T)) => {
            if (fiberState.currentRoot) {
                hook.queue.push(
                    typeof action === "function"
                        ? (action as (prev: T) => T)
                        : () => action
                );
                fiberState.workInProgressRoot = {
                    dom: fiberState.currentRoot.dom,
                    props: fiberState.currentRoot.props,
                    alternate: fiberState.currentRoot,
                };
                fiberState.nextUnitOfWork = fiberState.workInProgressRoot;
                fiberState.deletions = [];
            }
        };

        wipFiber.hooks!.push(hook);
        fiberState.hookIndex = hookIndex + 1;
        return [hook.state, setState];
    }

    return [initial, () => {}];
}
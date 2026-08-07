import { fiberState } from "../utils/state.js";
export function useEffect(effect, deps) {
    const { wipFiber, effectIndex } = fiberState;
    if (!wipFiber)
        return;
    const oldHook = wipFiber.alternate?.effectHooks?.[effectIndex];
    const hasChanged = oldHook
        ? !deps || deps.some((dep, i) => dep !== oldHook.deps?.[i])
        : true;
    const hook = {
        effect,
        cleanup: oldHook?.cleanup,
        deps,
        tag: hasChanged ? "RUN" : "SKIP",
    };
    wipFiber.effectHooks = wipFiber.effectHooks ?? [];
    wipFiber.effectHooks.push(hook);
    fiberState.effectIndex++;
}

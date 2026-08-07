import { fiberState } from "../utils/state.js";
import { EffectHook } from "../utils/types.js";

export function useEffect(
    effect : () => (() => void) | void,
    deps ?: any[]
):void{
    const { wipFiber, effectIndex } = fiberState;
    if(!wipFiber) return;

    const oldHook = wipFiber.alternate?.effectHooks?.[effectIndex]
    const hasChanged = oldHook
        ? !deps || deps.some((dep, i) => dep !== oldHook.deps?.[i])
        : true;
    const hook: EffectHook = {
        effect,
        cleanup: oldHook?.cleanup, 
        deps,
        tag: hasChanged ? "RUN" : "SKIP",
    };

    wipFiber.effectHooks = wipFiber.effectHooks ?? [];
    wipFiber.effectHooks.push(hook);
    fiberState.effectIndex++;
}
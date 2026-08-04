type ComponentFunction<P = any> = (props: P) => ArreactElement;
export interface ArreactElement {
    type: string | ComponentFunction<any>;
    props: ArreactProps;
}
interface ArreactProps {
    [key: string]: any;
    children: ArreactElement[];
}
interface WorkUnit {
    type?: string | ComponentFunction;
    dom: Text | HTMLElement | null;
    props: ArreactProps;
    parent?: WorkUnit;
    child?: WorkUnit | null;
    sibling?: WorkUnit | null;
    alternate?: WorkUnit | null;
    effectTag?: string;
    hooks?: any;
}

//overload signatures
function createElement<P extends object>(
    type: ComponentFunction<P>,
    props: P | null,
    ...children: any[]
): ArreactElement;
function createElement(
    type: string,
    props: Record<string, any> | null,
    ...children: any[]
): ArreactElement;

function createElement(
    type: any,
    props: any,
    ...children: any[]
): ArreactElement {
    return {
        type,
        props: {
            ...props,
            children: children.map((c) =>
                typeof c === "object" ? c : createTextElement(c)
            ),
        },
    };
}

function createTextElement(t: string | number): ArreactElement {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: t,
            children: []
        }
    }
}

function createDOM(obj: WorkUnit) {
    let dom: Text | HTMLElement | null = null;
    if (obj.type && !(typeof obj.type === "function")) {
        dom = (obj.type === "TEXT_ELEMENT") ?
            document.createTextNode("") :
            document.createElement(obj.type!);
    }
    if (dom) {
        updateDOM(dom, { children: [] }, obj.props);
    }
    return dom;
}


let wipFiber: WorkUnit | null = null;
let hookIndex: number | null = null;

function UpdateFunctionComponent(fiber: WorkUnit) {
    if (fiber.type && fiber.type instanceof Function) {
        wipFiber = fiber;
        hookIndex = 0;
        wipFiber.hooks = [];
        const children = [fiber.type(fiber.props)]
        reconcileChildren(fiber, children);
    }
}
function useState<T>(
    initial: T
): [T, (action: T | ((prev: T) => T)) => void] {
    const hook: { state: T; queue: ((prev: T) => T)[] } = {
        state: initial,
        queue: [],
    };

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
            if (currentRoot) {
                hook.queue.push(
                    typeof action === "function"
                        ? (action as (prev: T) => T)
                        : () => action
                );
                workInProgressRoot = {
                    dom: currentRoot.dom,
                    props: currentRoot.props,
                    alternate: currentRoot,
                };
                nextUnitOfWork = workInProgressRoot;
                deletions = [];
            }
        };

        wipFiber.hooks!.push(hook);
        hookIndex++;
        return [hook.state, setState];
    }

    // fallback kalau dipanggil di luar render (jarang kejadian, tapi TS wajib punya return path)
    return [initial, () => {}];
}


function UpdateHostComponent(fiber: WorkUnit) {
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber);
    }
    reconcileChildren(fiber, fiber.props.children);
}

function performUnitofWork(fiber: WorkUnit) {
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

function reconcileChildren(fiber: WorkUnit, elements: ArreactElement[]) {
    let idx = 0;
    let oldFiber = fiber.alternate && fiber.alternate.child;
    let prevsib: WorkUnit | null = null;
    while (idx < elements.length || oldFiber != null) {
        const e = elements[idx];
        let newFiber: WorkUnit | null = null;
        //comparing oldFib to element
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
        if (oldFiber && !sameType && deletions) {
            // delete node
            oldFiber.effectTag = "DELETION";
            deletions.push(oldFiber);
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

requestIdleCallback(workLoop);

let nextUnitOfWork: WorkUnit | null = null;
let workInProgressRoot: WorkUnit | null = null;
let currentRoot: WorkUnit | null = null;
let deletions: WorkUnit[] | null = null;

function commitRoot() {
    deletions?.forEach(commitWork);
    if (workInProgressRoot && workInProgressRoot.child) {
        commitWork(workInProgressRoot.child);
        currentRoot = workInProgressRoot;
    }
    workInProgressRoot = null;
}

const isEvent = (key: string) => key.startsWith("on")
const isProperty = (key: string) => key !== "children" && !isEvent(key)
const isNew = (prev: ArreactProps, next: ArreactProps) => (key: string) => prev[key] !== next[key]
const isGone = (prev: ArreactProps, next: ArreactProps) => (key: string) => !(key in next)

function updateDOM(dom: Text | HTMLElement, prevProps: ArreactProps, nextProps: ArreactProps) {
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(
            key =>
                !(key in nextProps) ||
                isNew(prevProps, nextProps)(key)
        )
        .forEach(name => {
            const eventType = name
                .toLowerCase()
                .substring(2)
            dom.removeEventListener(
                eventType,
                prevProps[name]
            )
        })

    // Remove old properties
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(name => {
            (dom as any)[name] = ""
        })

    // Set new or changed properties
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
            (dom as any)[name] = nextProps[name]
        })

    // Add event listeners
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
            const eventType = name
                .toLowerCase()
                .substring(2)
            dom.addEventListener(
                eventType,
                nextProps[name]
            )
        })
}

function commitDeletion(fiber: WorkUnit | null | undefined, domParent: Text | HTMLElement) {
    if (!fiber) return;
    if (fiber.dom) {
        domParent.removeChild(fiber.dom);
    } else {
        commitDeletion(fiber.child, domParent);
    }
}

function commitWork(fiber: WorkUnit | null | undefined) {
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

function workLoop(deadline: IdleDeadline) {
    let shouldYield: boolean = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitofWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (!nextUnitOfWork && workInProgressRoot) {
        commitRoot();
    }
    requestIdleCallback(workLoop);
}

function render(container: HTMLElement | Text, obj: ArreactElement) {
    workInProgressRoot = {
        dom: container,
        props: {
            children: [obj]
        },
        alternate: currentRoot
    }
    deletions = [];
    nextUnitOfWork = workInProgressRoot;
}



export const Arreact = {
    createElement,
    createTextElement,
    render,
    useState
}

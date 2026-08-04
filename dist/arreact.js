function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((c) => (typeof c === "object" ? c : createTextElement(c)))
        }
    };
}
function createTextElement(t) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: t,
            children: []
        }
    };
}
function createDOM(obj) {
    let dom = null;
    if (obj.type) {
        dom = (obj.type === "TEXT_ELEMENT") ?
            document.createTextNode("") :
            document.createElement(obj.type);
    }
    if (dom) {
        updateDOM(dom, { children: [] }, obj.props);
    }
    return dom;
}
function performUnitofWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber);
    }
    // if(fiber.parent && fiber.parent.dom && fiber.dom){
    //     fiber.parent.dom.appendChild(fiber.dom);
    // }
    const elements = fiber.props.children;
    reconcileChildren(fiber, elements);
    if (fiber.child) {
        return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
    return null;
}
function reconcileChildren(fiber, elements) {
    let idx = 0;
    let oldFiber = fiber.alternate && fiber.alternate.child;
    let prevsib = null;
    while (idx < elements.length || oldFiber != null) {
        const e = elements[idx];
        let newFiber = null;
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
            };
        }
        if (e && !sameType) {
            newFiber = {
                type: e.type,
                props: e.props,
                dom: null,
                parent: fiber,
                alternate: null,
                effectTag: "PLACEMENT",
            };
        }
        if (oldFiber && !sameType && deletions) {
            // delete node
            oldFiber.effectTag = "DELETION";
            deletions.push(oldFiber);
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }
        if (idx === 0) {
            fiber.child = newFiber;
        }
        else if (e && prevsib) {
            prevsib.sibling = newFiber;
        }
        prevsib = newFiber;
        idx++;
    }
}
requestIdleCallback(workLoop);
let nextUnitOfWork = null;
let workInProgressRoot = null;
let currentRoot = null;
let deletions = null;
function commitRoot() {
    deletions?.forEach(commitWork);
    if (workInProgressRoot && workInProgressRoot.child) {
        commitWork(workInProgressRoot.child);
        currentRoot = workInProgressRoot;
    }
    workInProgressRoot = null;
}
const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);
function updateDOM(dom, prevProps, nextProps) {
    //Remove old or changed event listeners
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(key => !(key in nextProps) ||
        isNew(prevProps, nextProps)(key))
        .forEach(name => {
        const eventType = name
            .toLowerCase()
            .substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
    });
    // Remove old properties
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(name => {
        dom[name] = "";
    });
    // Set new or changed properties
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
        dom[name] = nextProps[name];
    });
    // Add event listeners
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
        const eventType = name
            .toLowerCase()
            .substring(2);
        dom.addEventListener(eventType, nextProps[name]);
    });
}
function commitWork(fiber) {
    if (fiber) {
        const domParent = fiber.parent?.dom;
        if (fiber.effectTag === "PLACEMENT" && fiber.dom && domParent) {
            domParent.appendChild(fiber.dom);
        }
        else if (fiber.effectTag === "DELETION" && fiber.dom && domParent) {
            domParent.removeChild(fiber.dom);
        }
        else if (fiber.effectTag === "UPDATE" && fiber.dom && fiber.alternate) {
            updateDOM(fiber.dom, fiber.alternate.props, fiber.props);
        }
        commitWork(fiber.child);
        commitWork(fiber.sibling);
    }
}
function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitofWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (!nextUnitOfWork && workInProgressRoot) {
        commitRoot();
    }
    requestIdleCallback(workLoop);
}
function render(container, obj) {
    workInProgressRoot = {
        dom: container,
        props: {
            children: [obj]
        },
        alternate: currentRoot
    };
    deletions = [];
    nextUnitOfWork = workInProgressRoot;
}
export const Arreact = {
    createElement,
    createTextElement,
    render
};

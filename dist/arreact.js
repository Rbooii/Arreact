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
    const isProperty = (key) => key !== "children";
    Object.keys(obj.props)
        .filter(isProperty)
        .forEach(x => {
        dom[x] = obj.props[x];
    });
    return dom;
}
function performUnitofWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber);
    }
    if (fiber.parent && fiber.parent.dom && fiber.dom) {
        fiber.parent.dom.appendChild(fiber.dom);
    }
    const elements = fiber.props.children;
    let idx = 0;
    let prevsib = null;
    while (idx < elements.length) {
        const e = elements[idx];
        const newFib = {
            type: e.type,
            dom: null,
            parent: fiber,
            props: e.props
        };
        if (idx === 0) {
            fiber.child = newFib;
        }
        else if (prevsib) {
            prevsib.sibling = newFib;
        }
        prevsib = newFib;
        idx++;
    }
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
requestIdleCallback(workLoop);
let nextUnitOfWork = null;
function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitofWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
}
function render(container, obj) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [obj]
        }
    };
}
export const Arreact = {
    createElement,
    createTextElement,
    render
};

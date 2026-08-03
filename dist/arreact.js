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
function render(container, obj) {
    const dom = (obj.type === "TEXT_ELEMENT") ?
        document.createTextNode("") :
        document.createElement(obj.type);
    const isProperty = (key) => key !== "children";
    Object.keys(obj.props)
        .filter(isProperty)
        .forEach(x => {
        dom[x] = obj.props[x];
    });
    for (let i = 0; i < obj.props.children.length; i++) {
        const child = obj.props.children[i];
        render(dom, child);
    }
    container.appendChild(dom);
}
let nextUnitOfWork = null;
function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitofWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);
function performUnitofWork(nextUnitOfWork) {
}
export const Arreact = {
    createElement,
    createTextElement,
    render
};

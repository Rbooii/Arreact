import { reconcileChildren } from "./fiber.js";
export function createDOM(obj) {
    let dom = null;
    if (obj.type && !(typeof obj.type === "function")) {
        dom = (obj.type === "TEXT_ELEMENT") ?
            document.createTextNode("") :
            document.createElement(obj.type);
    }
    if (dom) {
        updateDOM(dom, { children: [] }, obj.props);
    }
    return dom;
}
const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);
export function updateDOM(dom, prevProps, nextProps) {
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
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(name => {
        dom[name] = "";
    });
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
        dom[name] = nextProps[name];
    });
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
export function commitDeletion(fiber, domParent) {
    if (!fiber)
        return;
    if (fiber.dom) {
        const actualParent = fiber.dom.parentNode;
        if (actualParent) {
            actualParent.removeChild(fiber.dom);
        }
    }
    else {
        commitDeletion(fiber.child, domParent);
    }
}
export function UpdateHostComponent(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber);
    }
    reconcileChildren(fiber, fiber.props.children);
}

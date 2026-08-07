import { reconcileChildren } from "./fiber.js";
import { ArreactProps, WorkUnit } from "./types.js";

export function createDOM(obj: WorkUnit) {
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

const isEvent = (key: string) => key.startsWith("on")
const isProperty = (key: string) => key !== "children" && !isEvent(key)
const isNew = (prev: ArreactProps, next: ArreactProps) => (key: string) => prev[key] !== next[key]
const isGone = (prev: ArreactProps, next: ArreactProps) => (key: string) => !(key in next)

export function updateDOM(
  dom: Text | HTMLElement,
  prevProps: ArreactProps,
  nextProps: ArreactProps) {
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

    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(name => {
            (dom as any)[name] = ""
        })

    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
            (dom as any)[name] = nextProps[name]
        })

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

export function commitDeletion(fiber: WorkUnit | null | undefined, domParent: Text | HTMLElement) {
    if (!fiber) return;
    if (fiber.dom) {
        domParent.removeChild(fiber.dom);
    } else {
        commitDeletion(fiber.child, domParent);
    }
}

export function UpdateHostComponent(fiber: WorkUnit) {
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber);
    }
    reconcileChildren(fiber, fiber.props.children);
}
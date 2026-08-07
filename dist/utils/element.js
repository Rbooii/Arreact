export function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((c) => typeof c === "object" ? c : createTextElement(c)),
        },
    };
}
export function createTextElement(t) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: t,
            children: []
        }
    };
}

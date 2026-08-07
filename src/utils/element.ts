import { ArreactElement, ComponentFunction } from "./types.js";

//overload signatures
export function createElement<P extends object>(
    type: ComponentFunction<P>,
    props: P | null,
    ...children: any[]
): ArreactElement;
export function createElement(
    type: string,
    props: Record<string, any> | null,
    ...children: any[]
): ArreactElement;
export function createElement(
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

export function createTextElement(t: string | number): ArreactElement {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: t,
            children: []
        }
    }
}
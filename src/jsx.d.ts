import { ArreactElement } from "./utils/types.js";

type ArreactEventHandler<E extends Event, T extends EventTarget> = (
    this: T,
    event: E & { target: T }
) => void;


interface ArreactDOMAttributes<T extends EventTarget> {
    children?: any;
    onClick?: ArreactEventHandler<MouseEvent, T>;
    onDoubleClick?: ArreactEventHandler<MouseEvent, T>;
    onChange?: ArreactEventHandler<Event, T>;
    onInput?: ArreactEventHandler<Event, T>;
    onSubmit?: ArreactEventHandler<SubmitEvent, T>;
}

// 3. HTML Attributes standar
interface ArreactHTMLAttributes<T extends EventTarget> extends ArreactDOMAttributes<T> {
    className?: string; 
    id?: string;
    style?: Partial<CSSStyleDeclaration> | string;
    [key: string]: any; 
}
declare global {
    namespace JSX {
        interface Element extends ArreactElement {}

        interface ElementChildrenAttribute {
            children: {}; 
        }

        type EventHandler<E extends Event, T extends EventTarget> = (
            this: T,
            event: E & { target: T }
        ) => void;

        interface DOMAttributes<T extends EventTarget> {
            children?: any;
            onClick?: EventHandler<MouseEvent, T>;
            onDoubleClick?: EventHandler<MouseEvent, T>;
            onChange?: EventHandler<Event, T>;
            onInput?: EventHandler<Event, T>;
            onSubmit?: EventHandler<SubmitEvent, T>;
        }

        interface HTMLAttributes<T extends EventTarget> extends DOMAttributes<T> {
            className?: string;
            id?: string;
            style?: Partial<CSSStyleDeclaration> | string;
            [key: string]: any; 
        }

        interface IntrinsicElements {
            div: HTMLAttributes<HTMLDivElement>;
            h1: HTMLAttributes<HTMLHeadingElement>;
            h2: HTMLAttributes<HTMLHeadingElement>;
            p: HTMLAttributes<HTMLParagraphElement>;
            span: HTMLAttributes<HTMLSpanElement>;
            ul: HTMLAttributes<HTMLUListElement>;
            li: HTMLAttributes<HTMLLIElement>;
            button: HTMLAttributes<HTMLButtonElement> & { 
                disabled?: boolean;
                type?: 'submit' | 'reset' | 'button';
            };
            input: HTMLAttributes<HTMLInputElement> & { 
                type?: string; 
                value?: string | number; 
                placeholder?: string;
            };
        }
    }
}
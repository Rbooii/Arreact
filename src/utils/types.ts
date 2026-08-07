export type ComponentFunction<P = any> = (props: P) => ArreactElement;

export interface ArreactElement {
    type: string | ComponentFunction<any>;
    props: ArreactProps;
}
export interface ArreactProps {
    [key: string]: any;
    children: ArreactElement[];
}
export interface WorkUnit {
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
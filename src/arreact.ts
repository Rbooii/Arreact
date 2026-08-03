interface ArreactElement {
    type:string;
    props:ArreactProps;
}

interface ArreactProps {
    [key:string]:any;
    children:ArreactElement[];
}

function createElement(
    type:string,
    props: Record<string, any> | null,
    ...children: any[]
):ArreactElement{
    return {
        type,
        props: {
            ...props,
            children: children.map((c) => (
                typeof c === "object" ? c : createTextElement(c)
            ))
        }
    }
}

function createTextElement(t:string|number):ArreactElement
{
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue:t,
            children:[]
        }
    }
}

function render(container:HTMLElement|Text, obj:ArreactElement){
    const dom = (obj.type === "TEXT_ELEMENT") ? 
        document.createTextNode("") :
        document.createElement(obj.type);

    const isProperty = (key:string) => key !== "children";
    Object.keys(obj.props)
        .filter(isProperty)
        .forEach(x => {
            (dom as any)[x] = obj.props[x];
        })

    for(let i = 0; i < obj.props.children.length; i++){
        const child = obj.props.children[i];
        render(dom, child);
    }
    container.appendChild(dom);
}

let nextUnitOfWork = null;
function workLoop(deadline){
    let shouldYield:boolean = false;
    while(nextUnitOfWork && !shouldYield){
        nextUnitOfWork = performUnitofWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitofWork(nextUnitOfWork){

}

export const Arreact = {
    createElement,
    createTextElement,
    render
}

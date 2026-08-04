interface ArreactElement {
    type:string;
    props:ArreactProps;
}

interface ArreactProps {
    [key:string]:any;
    children:ArreactElement[];
}

interface WorkUnit {
    type ?: string;
    dom : Text|HTMLElement|null;
    props : ArreactProps;
    parent ?: WorkUnit;
    child ?: WorkUnit;
    sibling ?: WorkUnit;
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

function createDOM(obj:WorkUnit){
    let dom:Text|HTMLElement|null = null;
    if(obj.type){
        dom = (obj.type === "TEXT_ELEMENT") ? 
        document.createTextNode("") :
        document.createElement(obj.type!);
    }

    const isProperty = (key:string) => key !== "children";
    Object.keys(obj.props)
        .filter(isProperty)
        .forEach(x => {
            (dom as any)[x] = obj.props[x];
        })
    return dom;
}

function performUnitofWork(fiber:WorkUnit){
    if(!fiber.dom){
        fiber.dom = createDOM(fiber);
    }
    if(fiber.parent && fiber.parent.dom && fiber.dom){
        fiber.parent.dom.appendChild(fiber.dom);
    }
    const elements = fiber.props.children;
    let idx = 0;
    let prevsib:WorkUnit|null = null;
    while(idx < elements.length){
        const e = elements[idx];
        const newFib:WorkUnit = {
            type:e.type,
            dom:null,
            parent:fiber,
            props:e.props
        }
        if(idx === 0){
            fiber.child = newFib;
        }else if(prevsib){
            prevsib.sibling = newFib;
        }
        prevsib = newFib;
        idx++;
    }
    if(fiber.child){
        return fiber.child;
    }
    let nextFiber:WorkUnit|undefined = fiber;
    while(nextFiber){
        if(nextFiber.sibling){
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
    return null;
}

requestIdleCallback(workLoop);

let nextUnitOfWork:WorkUnit|null = null;
function workLoop(deadline:IdleDeadline){
    let shouldYield:boolean = false;
    while(nextUnitOfWork && !shouldYield){
        nextUnitOfWork = performUnitofWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
}

function render(container:HTMLElement|Text, obj:ArreactElement){
    nextUnitOfWork = {
        dom : container,
        props : {
            children : [obj]
        }
    }
}

export const Arreact = {
    createElement,
    createTextElement,
    render
}

import { Arreact } from "./arreact.js";
const root = document.getElementById("root") as HTMLElement;

function CounterComponent({ initial }: { initial: number }) {
    const [counter, setCounter] = Arreact.useState<number>(initial)
    return (
        <div className="counter-wrap">
            <p>UseState Counter</p>
            <h1>{counter}</h1>
            <div className="counter-btn-wrap">

                <button className="button" onClick={() => { setCounter(counter + 1) }}>Add</button>
                <button className="button" onClick={() => { setCounter(counter - 1) }}>Subtract</button>
            </div>
        </div>
    )
}

function Secondary({ x }: { x: string }) {
    return (
        <p>Hello from secondary message Component : {x}</p>
    )
}

function Main() {
    return (
        <div className="geist-normal p-10">
            <h1>Hello from Arreact!</h1>
            <Secondary x="test" />
            <CounterComponent initial={0} />
        </div>
    )
}

Arreact.render(root, <Main />);
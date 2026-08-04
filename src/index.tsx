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

function Secondary() {
    const [value, setValue] = Arreact.useState<string>("Hello, type something here!")
    return (
        <div className="wrap-input">
            <p>Live State: {value}</p>
            <input 
                className="input-field" 
                placeholder="Type your message..."
                value={value} 
                onInput={(e: any) => { setValue(e.target.value) }}
            />
        </div>
    )
}

function Main() {
    return (
        <div className="geist-normal p-10">
            <div className="demo-container">
                <div className="demo-header">
                    <h1>Arreact Framework</h1>
                    <p>A Custom React-like Engine</p>
                </div>         
                <Secondary />
                <CounterComponent initial={0} />
            </div>
        </div>
    )
}

Arreact.render(root, <Main />);
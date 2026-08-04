import { Arreact } from "./arreact.js";
const root = document.getElementById("root");
function CounterComponent({ initial }) {
    const [counter, setCounter] = Arreact.useState(initial);
    return (Arreact.createElement("div", { className: "counter-wrap" },
        Arreact.createElement("p", null, "UseState Counter"),
        Arreact.createElement("h1", null, counter),
        Arreact.createElement("div", { className: "counter-btn-wrap" },
            Arreact.createElement("button", { className: "button", onClick: () => { setCounter(counter + 1); } }, "Add"),
            Arreact.createElement("button", { className: "button", onClick: () => { setCounter(counter - 1); } }, "Subtract"))));
}
function Secondary({ x }) {
    return (Arreact.createElement("p", null,
        "Hello from secondary message Component : ",
        x));
}
function Main() {
    return (Arreact.createElement("div", { className: "geist-normal p-10" },
        Arreact.createElement("h1", null, "Hello from Arreact!"),
        Arreact.createElement(Secondary, { x: "test" }),
        Arreact.createElement(CounterComponent, { initial: 0 })));
}
Arreact.render(root, Arreact.createElement(Main, null));

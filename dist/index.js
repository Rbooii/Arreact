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
function Secondary() {
    const [value, setValue] = Arreact.useState("Hello, type something here!");
    return (Arreact.createElement("div", { className: "wrap-input" },
        Arreact.createElement("p", null,
            "Live State: ",
            value),
        Arreact.createElement("input", { className: "input-field", placeholder: "Type your message...", value: value, onInput: (e) => { setValue(e.target.value); } })));
}
function Main() {
    return (Arreact.createElement("div", { className: "geist-normal p-10" },
        Arreact.createElement("div", { className: "demo-container" },
            Arreact.createElement("div", { className: "demo-header" },
                Arreact.createElement("h1", null, "Arreact Framework"),
                Arreact.createElement("p", null, "A Custom React-like Engine")),
            Arreact.createElement(Secondary, null),
            Arreact.createElement(CounterComponent, { initial: 0 }))));
}
Arreact.render(root, Arreact.createElement(Main, null));

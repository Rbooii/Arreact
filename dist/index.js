import { Arreact } from "./arreact.js";
const root = document.getElementById("root");
function Secondary({ x }) {
    return (Arreact.createElement("h1", null,
        "Hello from secondary message : ",
        x));
}
function Main() {
    return (Arreact.createElement("div", { className: "geist-normal p-10" },
        Arreact.createElement("h1", null, "Hello from Arreact!"),
        Arreact.createElement(Secondary, { x: "test" })));
}
Arreact.render(root, Main());

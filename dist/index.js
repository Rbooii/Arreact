import { Arreact } from "./arreact.js";
const root = document.getElementById("root");
root.innerHTML = "<h1>Hello World!</h1>";
const liComp1 = Arreact.createElement("li", null, "ini 1");
const liComp2 = Arreact.createElement("li", null, "ini 2");
const ulComponent = Arreact.createElement("ul", {
    className: "text-3xl"
}, liComp1, liComp2);
console.log(ulComponent);
Arreact.render(root, ulComponent);

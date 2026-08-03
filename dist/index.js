import { Arreact } from "./arreact.js";
const root = document.getElementById("root");
const componenttest = (Arreact.createElement("div", null,
    Arreact.createElement("h1", null, "Ini title!"),
    Arreact.createElement("p", null, "halo ini description!")));
Arreact.render(root, componenttest);

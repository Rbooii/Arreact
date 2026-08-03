import { Arreact } from "./arreact.js";
const root = document.getElementById("root") as HTMLElement;

const componenttest = (
    <div>
        <h1>Ini title!</h1>
        <p>halo ini description!</p>
    </div>
)

Arreact.render(root, componenttest);
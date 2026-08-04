import { Arreact } from "./arreact.js";
const root = document.getElementById("root") as HTMLElement;

function Secondary({x}:{x:string}){
    return (
        <h1>Hello from secondary message : {x}</h1>
    )
}

function Main(){
    return (
        <div className="geist-normal p-10">
            <h1>Hello ini title!</h1>
            <p>ini paragraph!</p>
            <p>This is a very simple testtt</p>
            <button onClick={() => {console.log("hi")}}>test</button>
            <Secondary x="test"/>
        </div>
    )
}

Arreact.render(root, Main());
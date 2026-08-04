# okay so, yeah. this is `Arreact` haha get it Arco + React LOL.

just a 3rd semester CS student messing around with fiber architectures and virtual doms, and somehow i ended up writing my own mini framework. it's not meant to replace react (obviously), it's just a learning project that went a little too far. oh yeah one more thing before you deep dive into this junk of a code. i learn a lot from https://pomb.us/build-your-own-react/, basically i learn everything from there so thankyouu pomb for helping me understanding react.

I ported and rewrite majority of the code (my style my way) so it kinda differs a bit from the tutorial. also made in typescript rather than JS (cuz i can and i want)

but hey, it renders stuff to the DOM and the state actually updates. so that's a win.

### what's working so far (i think theese are still fragile anyway lmao)

* functional components: didn't even bother with class components, it's 2026.


* `useState` hook: fully working state queues and reconciliation.


* fiber rendering: concurrent-ish mode using `requestIdleCallback`.


* jsx support:  mapping standard tags directly to `createElement` and `createTextElement`.


* event listeners:  handles `onClick` and other native events without crashing.


###  how to run this thing

if you actually want to clone this and run it, you need to tell typescript to use `Arreact` for compiling jsx instead of the default react engine.

just update your `tsconfig.json` so it points to the custom pragma:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "Arreact.createElement",
    "jsxFragmentFactory": "Arreact.Fragment"
  }
}

```

### 💻 what the code looks like

it looks and feels pretty much exactly like real react. here is a working counter snippet from my test file:

```tsx
import { Arreact } from "./arreact.js";

function CounterComponent({ initial }: { initial: number }) {
    const [counter, setCounter] = Arreact.useState<number>(initial);
    
    return (
        <div className="counter-wrap">
            <p>UseState Counter</p>
            <h1>{counter}</h1>
            <div className="counter-btn-wrap">
                <button className="button" onClick={() => { setCounter(counter + 1) }}>Add</button>
                <button className="button" onClick={() => { setCounter(counter - 1) }}>Subtract</button>
            </div>
        </div>
    );
}

const root = document.getElementById("root") as HTMLElement;
Arreact.render(root, <CounterComponent initial={0} />);

```

### ⚠️ disclaimer

please for the love of god do not use this in production. it is a toy engine. if you use this to build a real client app, you're on your own when the tree reconciliation decides to nuke itself.
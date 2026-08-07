import { Arreact } from "./arreact.js";
const root = document.getElementById("root");
function TestLoadingComponent({ init, delaySeconds }) {
    const [d, setD] = Arreact.useState(delaySeconds);
    const [data, setData] = Arreact.useState("");
    const [loading, setLoading] = Arreact.useState(true);
    Arreact.useEffect(() => {
        if (d > 0) {
            setTimeout(() => {
                if (d != 1) {
                    setD(d - 1);
                }
                else {
                    setData(init);
                    setLoading(false);
                }
            }, 1000);
        }
    }, [d]);
    return (Arreact.createElement("div", { className: "loading-card" }, loading ? (Arreact.createElement("div", { className: "loading-state" },
        Arreact.createElement("div", { className: "spinner" }),
        Arreact.createElement("p", null,
            "Loading ",
            d,
            " seconds..."))) : (Arreact.createElement("p", { className: "loaded-data" },
        "Data: ",
        Arreact.createElement("span", null, data)))));
}
function CounterComponent({ initial }) {
    const [counter, setCounter] = Arreact.useState(initial);
    return (Arreact.createElement("div", { className: "card counter-wrap" },
        Arreact.createElement("p", { className: "card-label" }, "useState Counter"),
        Arreact.createElement("h1", { className: "counter-value" }, counter),
        Arreact.createElement("div", { className: "counter-btn-wrap" },
            Arreact.createElement("button", { className: "button", onClick: () => { setCounter(counter - 1); } }, "\u2212"),
            Arreact.createElement("button", { className: "button button-ghost" }, counter),
            Arreact.createElement("button", { className: "button", onClick: () => { setCounter(counter + 1); } }, "+"))));
}
function Secondary() {
    const [value, setValue] = Arreact.useState("Hello, type something here!");
    return (Arreact.createElement("div", { className: "card wrap-input" },
        Arreact.createElement("p", { className: "card-label" }, "Live State"),
        Arreact.createElement("p", { className: "live-preview" }, value),
        Arreact.createElement("input", { className: "input-field", placeholder: "Type your message...", value: value, onInput: (e) => { setValue(e.target.value); } })));
}
function GetGithubProfile({ userName }) {
    const [input, setInput] = Arreact.useState(userName);
    const [result, setResult] = Arreact.useState(null);
    const [error, setError] = Arreact.useState(null);
    const [loading, setLoading] = Arreact.useState(true);
    const API = "https://api.github.com/users/";
    Arreact.useEffect(() => {
        const id = setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                const req = await fetch(API + input);
                if (!req.ok)
                    throw new Error(`User "${input}" tidak ditemukan`);
                const res = await req.json();
                console.log(res);
                setResult(res);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Terjadi kesalahan");
            }
            finally {
                setLoading(false);
                console.log("loadingz");
            }
        }, 500);
        return () => clearTimeout(id);
    }, [input]);
    return (Arreact.createElement("div", { className: "card github-card" },
        Arreact.createElement("p", { className: "card-label" }, "GitHub Profile"),
        Arreact.createElement("input", { className: "input-field", placeholder: "Cari username GitHub...", value: input, onInput: (e) => { setInput(e.target.value); } }),
        loading && (Arreact.createElement("div", { className: "loading-state" },
            Arreact.createElement("div", { className: "spinner" }),
            Arreact.createElement("p", null, "Fetching data..."))),
        error && !loading && (Arreact.createElement("div", { className: "error-state" },
            Arreact.createElement("p", null,
                "Error : ",
                error))),
        result && !loading && !error && (Arreact.createElement("div", { className: "github-profile" },
            Arreact.createElement("img", { className: "avatar", src: result.avatar_url, alt: result.name }),
            Arreact.createElement("div", { className: "profile-info" },
                Arreact.createElement("h2", null, result.name ?? result.login),
                Arreact.createElement("p", { className: "username" },
                    "@",
                    result.login),
                result.bio && Arreact.createElement("p", { className: "bio" }, result.bio),
                Arreact.createElement("div", { className: "stats" },
                    Arreact.createElement("div", { className: "stat" },
                        Arreact.createElement("span", { className: "stat-value" }, result.public_repos),
                        Arreact.createElement("span", { className: "stat-label" }, "Repos")),
                    Arreact.createElement("div", { className: "stat" },
                        Arreact.createElement("span", { className: "stat-value" }, result.followers),
                        Arreact.createElement("span", { className: "stat-label" }, "Followers")),
                    Arreact.createElement("div", { className: "stat" },
                        Arreact.createElement("span", { className: "stat-value" }, result.following),
                        Arreact.createElement("span", { className: "stat-label" }, "Following"))))))));
}
function Main() {
    return (Arreact.createElement("div", { className: "geist-normal root-wrap" },
        Arreact.createElement("div", { className: "demo-container" },
            Arreact.createElement("div", { className: "demo-header" },
                Arreact.createElement("p", { className: "eyebrow" }, "made by @Arco"),
                Arreact.createElement("h1", null, "Arreact"),
                Arreact.createElement("p", { className: "subtitle" }, "A React-like engine built from scratch")),
            Arreact.createElement(Secondary, null),
            Arreact.createElement(CounterComponent, { initial: 0 }),
            Arreact.createElement(TestLoadingComponent, { init: "Loaded!", delaySeconds: 3 }),
            Arreact.createElement(GetGithubProfile, { userName: "Rbooii" }))));
}
Arreact.render(root, Arreact.createElement(Main, null));

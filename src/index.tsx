import { Arreact } from "./arreact.js";
const root = document.getElementById("root") as HTMLElement;


function TestLoadingComponent({ init, delaySeconds }: { init: string, delaySeconds: number }) {
    const [d, setD] = Arreact.useState<number>(delaySeconds);
    const [data, setData] = Arreact.useState<string>("");
    const [loading, setLoading] = Arreact.useState<boolean>(true);

    Arreact.useEffect(() => {
        if(d>0){
            setTimeout(()=>{
                if(d!=1){
                    setD(d-1);
                }else{
                    setData(init);
                    setLoading(false);
                }
            },1000);
        }
    }, [d]);

    return (
        <div className="loading-card">
            {loading ? (
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading {d} seconds...</p>
                </div>
            ) : (
                <p className="loaded-data">Data: <span>{data}</span></p>
            )}
        </div>
    )
}

function CounterComponent({ initial }: { initial: number }) {
    const [counter, setCounter] = Arreact.useState<number>(initial)
    return (
        <div className="card counter-wrap">
            <p className="card-label">useState Counter</p>
            <h1 className="counter-value">{counter}</h1>
            <div className="counter-btn-wrap">
                <button className="button" onClick={() => { setCounter(counter - 1) }}>−</button>
                <button className="button button-ghost">{counter}</button>
                <button className="button" onClick={() => { setCounter(counter + 1) }}>+</button>
            </div>
        </div>
    )
}

function Secondary() {
    const [value, setValue] = Arreact.useState<string>("Hello, type something here!")
    return (
        <div className="card wrap-input">
            <p className="card-label">Live State</p>
            <p className="live-preview">{value}</p>
            <input
                className="input-field"
                placeholder="Type your message..."
                value={value}
                onInput={(e: any) => { setValue(e.target.value) }}
            />
        </div>
    )
}

function GetGithubProfile({ userName }: { userName: string }) {
    interface GitHubUser {
        login: string;
        name: string;
        avatar_url: string;
        bio: string;
        public_repos: number;
        followers: number;
        following: number;
    }

    const [input, setInput] = Arreact.useState<string>(userName);
    const [result, setResult] = Arreact.useState<GitHubUser | null>(null);
    const [error, setError] = Arreact.useState<string | null>(null);
    const [loading, setLoading] = Arreact.useState<boolean>(true);

    const API = "https://api.github.com/users/";

    Arreact.useEffect(() => {
        const id = setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                const req = await fetch(API + input);
                if (!req.ok) throw new Error(`User "${input}" tidak ditemukan`);
                const res = await req.json();
                console.log(res);
                setResult(res);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Terjadi kesalahan");
            } finally {
                setLoading(false);
                console.log("loadingz")
            }
        }, 500);

        return () => clearTimeout(id);
    }, [input]);

    return (
        <div className="card github-card">
            <p className="card-label">GitHub Profile</p>
            <input
                className="input-field"
                placeholder="Cari username GitHub..."
                value={input}
                onInput={(e: any) => { setInput(e.target.value) }}
            />

            {loading && (
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Fetching data...</p>
                </div>
            )}

            {error && !loading && (
                <div className="error-state">
                    <p>Error : {error}</p>
                </div>
            )}

            {result && !loading && !error && (
                <div className="github-profile">
                    <img className="avatar" src={result.avatar_url} alt={result.name} />
                    <div className="profile-info">
                        <h2>{result.name ?? result.login}</h2>
                        <p className="username">@{result.login}</p>
                        {result.bio && <p className="bio">{result.bio}</p>}
                        <div className="stats">
                            <div className="stat">
                                <span className="stat-value">{result.public_repos}</span>
                                <span className="stat-label">Repos</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{result.followers}</span>
                                <span className="stat-label">Followers</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{result.following}</span>
                                <span className="stat-label">Following</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function Main() {
    return (
        <div className="geist-normal root-wrap">
            <div className="demo-container">
                <div className="demo-header">
                    <p className="eyebrow">made by @Arco</p>
                    <h1>Arreact</h1>
                    <p className="subtitle">A React-like engine built from scratch</p>
                </div>
                <Secondary />
                <CounterComponent initial={0} />
                <TestLoadingComponent init="Loaded!" delaySeconds={3} />
                <GetGithubProfile userName="Rbooii" /> 
            </div>
        </div>
    )
}

Arreact.render(root, <Main />);
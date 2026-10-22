// src/App.js
const NAV = [
  ["Main"],
  ["Dashboard", "dashboard"],
  ["Products", "products"],
  ["Orders", "orders"],
  ["Customers", "customers"],
  ["Inventory", "inventory"],
  ["Finance"],
  ["Payments", "payments"],
  ["Saved Methods", "card"],
  ["Account"],
  ["Profile", "profile"],
  ["Settings", "settings"],
];
const SUBS = {
  Dashboard: "Overview of your store performance",
  Products: "Manage your catalogue",
  Orders: "Track and update customer orders",
  Customers: "People who shop with you",
  Inventory: "Monitor and restock inventory",
  Payments: "Transactions and settlements",
  ["Saved Methods"]: "Cards and UPI IDs on file",
  Profile: "Your account",
  Settings: "Preferences and notifications",
};

function App() {
  const [page, setPage] = useState("Dashboard"),
    [err, setErr] = useState(false),
    [tick, setTick] = useState(0),
    [toasts, setT] = useState([]);
  const [products, setP] = useState(() => store.get("sb3_p", seedP)),
    [orders, setO] = useState(() => store.get("sb3_o", seedO)),
    [methods, setM] = useState(() => store.get("sb3_m", seedM)),
    [profile, setPr] = useState(() => store.get("sb3_pr", seedProfile)),
    [settings, setS] = useState(() => store.get("sb3_s", seedSet));
  const mk = (set, key) => (v) => {
    set(v);
    store.set(key, v);
  };
  const setProducts = mk(setP, "sb3_p"),
    setOrders = mk(setO, "sb3_o"),
    setMethods = mk(setM, "sb3_m"),
    setProfile = mk(setPr, "sb3_pr"),
    setSettings = mk(setS, "sb3_s");
  const toast = (msg, e) => {
    const id = Date.now() + Math.random();
    setT((t) => [...t, { id, msg, e }]);
    setTimeout(() => setT((t) => t.filter((x) => x.id !== id)), 2600);
  };
  useEffect(() => {
    const r = document.documentElement;
    settings.theme === "system"
      ? r.removeAttribute("data-theme")
      : r.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);
  const loading = useLoad(page + tick);
  const dk =
    settings.theme === "dark" ||
    (settings.theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const toggleTheme = () => setSettings({ ...settings, theme: dk ? "light" : "dark" });
  const reset = () => {
    setProducts(seedP);
    setOrders(seedO);
    setMethods(seedM);
    setProfile(seedProfile);
    setSettings(seedSet);
    toast("Demo data reset");
  };
  const body = {
    Dashboard: html`<${Overview}
      products=${products}
      orders=${orders}
      customers=${seedC}
    />`,
    Products: html`<${Products}
      products=${products}
      setProducts=${setProducts}
      toast=${toast}
    />`,
    Orders: html`<${Orders} orders=${orders} setOrders=${setOrders} toast=${toast} />`,
    Customers: html`<${Customers} customers=${seedC} />`,
    Inventory: html`<${Inventory}
      products=${products}
      setProducts=${setProducts}
      toast=${toast}
    />`,
    Payments: html`<${Payments} orders=${orders} />`,
    ["Saved Methods"]: html`<${SavedMethods}
      methods=${methods}
      setMethods=${setMethods}
      toast=${toast}
      holder=${profile.name}
    />`,
    Profile: html`<${Profile}
      profile=${profile}
      setProfile=${setProfile}
      toast=${toast}
    />`,
    Settings: html`<${Settings}
      settings=${settings}
      setSettings=${setSettings}
      toast=${toast}
      onReset=${reset}
    />`,
  }[page];
  return html`<div class="app">
    <aside class="side">
      <div class="logo">
        <span class="lg"><${Ic} n="products" /></span><span class="lt"> E-Commerce</span>
      </div>
      <nav class="nav">
        ${NAV.map(([n, i]) =>
          i
            ? html`<button
                key=${n}
                class=${page === n ? "on" : ""}
                onClick=${() => {
                  setErr(false);
                  setPage(n);
                }}
              >
                <${Ic} n=${i} /><span class="t">${n}</span>
              </button>`
            : html`<small key=${n}>${n}</small>`,
        )}
      </nav>
      <div class="me" onClick=${() => setPage("Profile")}>
        <div class="av">${initials(profile.name)}</div>
        <div>${profile.name}<small>${profile.role}</small></div>
      </div>
    </aside>
    <${Page}
      title=${page}
      sub=${SUBS[page]}
      loading=${loading}
      error=${err}
      onRetry=${() => {
        setErr(false);
        setTick(tick + 1);
        toast("Reloaded");
      }}
      action=${html`<button class="btn sm ib" onClick=${toggleTheme}><${Ic} n=${dk ? "sun" : "moon"} />${dk ? "Light" : "Dark"} mode</button>`}
      >${body}<//
    >
    <div class="toasts">
      ${toasts.map((t) => html`<div key=${t.id} class=${"toast" + (t.e ? " e" : "")}>${t.msg}</div>`)}
    </div>
  </div>`;
}

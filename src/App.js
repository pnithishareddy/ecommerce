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

const IcSearch = () => html`<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>`;
const IcBell = () => html`<svg class="i" viewBox="0 0 24 24"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></svg>`;

const norm = (x) => String(x || "").toLowerCase().replace(/[\s_-]/g, "");
const matches = (rec, q) =>
  Object.values(rec).some(
    (v) => (typeof v === "string" || typeof v === "number") && String(v).toLowerCase().includes(q),
  );
const label = (rec) => String(rec.name || rec.customer || rec.id || "Item");

function App() {
  const [page, setPage] = useState("Dashboard"),
    [err, setErr] = useState(false),
    [tick, setTick] = useState(0),
    [toasts, setT] = useState([]),
    [menuOpen, setMenuOpen] = useState(false), // mobile drawer
    [collapsed, setCollapsed] = useState(() => store.get("sb3_c", false)), // desktop rail
    [menu, setMenu] = useState(null), // "bell" | "user" | "search" | null
    [q, setQ] = useState(""),
    [acts, setActs] = useState([]), // activity feed fed by toasts
    [read, setRead] = useState([]);
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
    setActs((a) => [{ id: "a" + id, t: msg, s: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...a].slice(0, 8));
    setTimeout(() => setT((t) => t.filter((x) => x.id !== id)), 2600);
  };
  useEffect(() => {
    const r = document.documentElement;
    settings.theme === "system"
      ? r.removeAttribute("data-theme")
      : r.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  // Mobile drawer: lock page scroll while open, close on Esc or when resized to desktop
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    const onResize = () => window.innerWidth > 700 && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  // Close dropdowns on outside click or Esc
  useEffect(() => {
    if (!menu) return;
    const onDown = (e) => !e.target.closest(".dd-wrap") && setMenu(null);
    const onKey = (e) => e.key === "Escape" && setMenu(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  // Notifications: live counts from your data + recent activity
  const pend = orders.filter((o) => norm(o.status) === "pending").length;
  const low = products.filter((p) => ["lowstock", "outofstock"].includes(norm(p.status))).length;
  const notes = [
    ...(pend ? [{ id: "pend-" + pend, t: pend + " pending order" + (pend > 1 ? "s" : ""), s: "Needs your attention", p: "Orders" }] : []),
    ...(low ? [{ id: "low-" + low, t: low + " product" + (low > 1 ? "s" : "") + " low on stock", s: "Time to restock", p: "Inventory" }] : []),
    ...acts,
  ];
  const unread = notes.filter((n) => !read.includes(n.id)).length;

  // Global search across pages, products, orders, customers
  const ql = q.trim().toLowerCase();
  const results = ql
    ? [
        ...NAV.filter((x) => x[1] && x[0].toLowerCase().includes(ql)).map((x) => ({ k: "Page", t: x[0], p: x[0] })),
        ...products.filter((r) => matches(r, ql)).slice(0, 4).map((r) => ({ k: "Product", t: label(r), p: "Products" })),
        ...orders.filter((r) => matches(r, ql)).slice(0, 4).map((r) => ({ k: "Order", t: label(r), p: "Orders" })),
        ...seedC.filter((r) => matches(r, ql)).slice(0, 4).map((r) => ({ k: "Customer", t: label(r), p: "Customers" })),
      ]
    : [];

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
  const go = (n) => {
    setErr(false);
    setPage(n);
    setMenuOpen(false); // close drawer after choosing a page
    setMenu(null);
  };
  const burger = () => {
    if (window.innerWidth <= 700) return setMenuOpen(!menuOpen);
    setCollapsed(!collapsed);
    store.set("sb3_c", !collapsed);
  };
  const pick = (r) => {
    go(r.p);
    setQ("");
  };
  const openNote = (n) => {
    setRead([...read, n.id]);
    if (n.p) go(n.p);
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
  return html`<div class=${"app" + (collapsed ? " collapsed" : "")}>
    <div class=${"scrim" + (menuOpen ? " open" : "")} onClick=${() => setMenuOpen(false)}></div>
    <aside class=${"side" + (menuOpen ? " open" : "")}>
      <div class="logo">
        <span class="lg"><${Ic} n="products" /></span><span class="lt"> E-Commerce</span>
      </div>
      <nav class="nav">
        ${NAV.map(([n, i]) =>
          i
            ? html`<button
                key=${n}
                title=${n}
                class=${page === n ? "on" : ""}
                onClick=${() => go(n)}
              >
                <${Ic} n=${i} /><span class="t">${n}</span>
              </button>`
            : html`<small key=${n}>${n}</small>`,
        )}
      </nav>
      <div class="me" onClick=${() => go("Profile")}>
        <div class="av">${initials(profile.name)}</div>
        <div>${profile.name}<small>${profile.role}</small></div>
      </div>
    </aside>

    <div class="shell">
      <header class="tb">
        <button
          class=${"menu-btn" + (menuOpen ? " open" : "")}
          aria-label="Toggle menu"
          aria-expanded=${menuOpen}
          onClick=${burger}
        >
          <span></span><span></span><span></span>
        </button>

        <div class="srch dd-wrap">
          <${IcSearch} />
          <input
            type="search"
            placeholder="Search products, orders, customers…"
            value=${q}
            onInput=${(e) => {
              setQ(e.target.value);
              setMenu("search");
            }}
            onFocus=${() => q && setMenu("search")}
            onKeyDown=${(e) => e.key === "Enter" && results[0] && pick(results[0])}
          />
          ${menu === "search" && q.trim()
            ? html`<div class="dd">
                ${results.length
                  ? results.map(
                      (r, i) => html`<button key=${i} class="dd-i" onClick=${() => pick(r)}>
                        <span>${r.t}</span><small class="kd">${r.k}</small>
                      </button>`,
                    )
                  : html`<div class="dd-e">No results for “${q.trim()}”</div>`}
              </div>`
            : null}
        </div>

        <div class="tb-sp"></div>

        <div class="dd-wrap">
          <button class="tbtn" aria-label="Notifications" onClick=${() => setMenu(menu === "bell" ? null : "bell")}>
            <${IcBell} />${unread > 0 ? html`<i class="dot"></i>` : null}
          </button>
          ${menu === "bell"
            ? html`<div class="dd">
                <div class="dd-h">
                  <b>Notifications</b>
                  <button class="lnk" onClick=${() => setRead(notes.map((n) => n.id))}>Mark all as read</button>
                </div>
                <div class="dd-b">
                  ${notes.length
                    ? notes.map(
                        (n) => html`<button key=${n.id} class=${"nt" + (read.includes(n.id) ? "" : " un")} onClick=${() => openNote(n)}>
                          <b>${n.t}</b><span>${n.s}</span>
                        </button>`,
                      )
                    : html`<div class="dd-e">You’re all caught up</div>`}
                </div>
              </div>`
            : null}
        </div>

        <div class="dd-wrap">
          <button class="avb" aria-label="Account menu" onClick=${() => setMenu(menu === "user" ? null : "user")}>
            <span class="av">${initials(profile.name)}</span>
          </button>
          ${menu === "user"
            ? html`<div class="dd dd-u">
                <div class="dd-me">
                  <div class="av">${initials(profile.name)}</div>
                  <div><b>${profile.name}</b><small>${profile.role}</small></div>
                </div>
                <button class="dd-i" onClick=${() => go("Profile")}>Profile</button>
                <button class="dd-i" onClick=${() => go("Settings")}>Settings</button>
                <button class="dd-i" onClick=${() => { toggleTheme(); setMenu(null); }}>${dk ? "Light mode" : "Dark mode"}</button>
              </div>`
            : null}
        </div>
      </header>

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
    </div>

    <div class="toasts">
      ${toasts.map((t) => html`<div key=${t.id} class=${"toast" + (t.e ? " e" : "")}>${t.msg}</div>`)}
    </div>
  </div>`;
}
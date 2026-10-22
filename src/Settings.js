// src/Settings.js
function Settings({ settings, setSettings, toast, onReset }) {
  const up = (k, val) => {
    setSettings({ ...settings, [k]: val });
    toast("Settings saved");
  };
  return html`<div class="grid g2">
    <div class="card">
      <h3>General</h3>
      <p class="sub">Store preferences</p>
      <${Field}
        label="Store name"
        value=${settings.store}
        onInput=${(e) => setSettings({ ...settings, store: e.target.value })}
      />
      <div class="f">
        <label>Appearance</label>
        <div class="seg">
          ${["light", "dark", "system"].map((t) => html`<button key=${t} class=${settings.theme === t ? "on" : ""} onClick=${() => up("theme", t)}>${t[0].toUpperCase() + t.slice(1)}</button>`)}
        </div>
      </div>
      <div class="f">
        <label>Currency</label><input value="Indian Rupee (₹ INR)" disabled />
      </div>
    </div>
    <div class="card">
      <h3>Notifications</h3>
      <p class="sub">Choose what you get alerted about</p>
      <${Toggle}
        label="Email updates"
        sub="Weekly sales summary"
        v=${settings.emailN}
        on=${(v) => up("emailN", v)}
      /><${Toggle}
        label="New order alerts"
        sub="Notify on every new order"
        v=${settings.orderN}
        on=${(v) => up("orderN", v)}
      /><${Toggle}
        label="Low stock alerts"
        sub="When stock drops below 10"
        v=${settings.stockN}
        on=${(v) => up("stockN", v)}
      />
      <br /><button class="btn dg" onClick=${onReset}>Reset all demo data</button>
    </div>
  </div>`;
}

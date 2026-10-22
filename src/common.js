// src/common.js
function useLoad(dep) {
  const [l, setL] = useState(true);
  useEffect(() => {
    setL(true);
    const t = setTimeout(() => setL(false), 450);
    return () => clearTimeout(t);
  }, [dep]);
  return l;
}
function Skeleton() {
  return html`<div class="card">
    ${[1, 2, 3, 4, 5].map((i) => html`<div class="sk" key=${i} style=${{ width: 95 - i * 8 + "%" }}></div>`)}
  </div>`;
}
function Page({ title, sub, action, children, loading, error, onRetry }) {
  return html`<div class="main">
    <div class="top">
      <div>
        <h1>${title}</h1>
        <p class="sub" style=${{ margin: 0 }}>${sub}</p>
      </div>
      ${action}
    </div>
    ${error ? html`<div class="card state">⚠️ Something went wrong.<br /><br /><button class="btn pr" onClick=${onRetry}>Retry</button></div>` : loading ? html`<${Skeleton} />` : children}
  </div>`;
}
function Modal({ title, onClose, children }) {
  return html`<div class="ov" onClick=${onClose}>
    <div class="modal" onClick=${(e) => e.stopPropagation()}>
      <div class="top">
        <b>${title}</b><button class="btn sm" onClick=${onClose}>✕</button>
      </div>
      ${children}
    </div>
  </div>`;
}
const Field = ({ label, err, ...p }) =>
  html`<div class="f">
    <label>${label}</label><input ...${p} />${err && html`<div class="err">${err}</div>`}
  </div>`;
const Toggle = ({ label, sub, v, on }) =>
  html`<label class="tg"
    ><span>${label}<small>${sub}</small></span
    ><input type="checkbox" checked=${v} onChange=${(e) => on(e.target.checked)}
  /></label>`;

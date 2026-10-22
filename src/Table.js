// src/Table.js
function Table({
  rows,
  cols,
  searchKeys,
  filterKey,
  filterOpts,
  actions,
  emptyMsg = "No records found",
  pageSize = 6,
}) {
  const [q, setQ] = useState(""),
    [f, setF] = useState(""),
    [s, setS] = useState({ k: null, d: 1 }),
    [p, setP] = useState(1);
  const data = useMemo(() => {
    let r = rows.filter(
      (x) =>
        (!f || x[filterKey] === f) &&
        (!q ||
          searchKeys.some((k) => String(x[k]).toLowerCase().includes(q.toLowerCase()))),
    );
    if (s.k)
      r = [...r].sort((a, b) => (a[s.k] > b[s.k] ? 1 : a[s.k] < b[s.k] ? -1 : 0) * s.d);
    return r;
  }, [rows, q, f, s]);
  const pages = Math.max(1, Math.ceil(data.length / pageSize)),
    pg = Math.min(p, pages),
    view = data.slice((pg - 1) * pageSize, pg * pageSize);
  return html`<div class="card">
    <div class="bar">
      <input
        placeholder="Search…"
        value=${q}
        onInput=${(e) => {
          setQ(e.target.value);
          setP(1);
        }}
      />
      ${
        filterOpts &&
        html`<select
          value=${f}
          onChange=${(e) => {
            setF(e.target.value);
            setP(1);
          }}
        >
          <option value="">All</option>
          ${filterOpts.map((o) => html`<option key=${o}>${o}</option>`)}
        </select>`
      }
    </div>
    ${
      view.length === 0
        ? html`<div class="state">📭 ${emptyMsg}</div>`
        : html`<div class="tw">
            <table>
              <thead>
                <tr>
                  ${cols.map((c) => html`<th key=${c.k} onClick=${() => setS({ k: c.k, d: s.k === c.k ? -s.d : 1 })}>${c.label}${s.k === c.k ? (s.d === 1 ? " ▲" : " ▼") : ""}</th>`)}${actions && html`<th></th>`}
                </tr>
              </thead>
              <tbody>
                ${view.map(
                  (r) =>
                    html`<tr key=${r.id}>
                      ${cols.map((c) => html`<td key=${c.k}>${c.render ? c.render(r) : r[c.k]}</td>`)}${actions && html`<td>${actions(r)}</td>`}
                    </tr>`,
                )}
              </tbody>
            </table>
          </div>`
    }
    <div class="pg">
      <span>${data.length} results</span
      ><span
        ><button class="btn sm" disabled=${pg <= 1} onClick=${() => setP(pg - 1)}>
          Prev
        </button>
        ${pg} / ${pages}
        <button class="btn sm" disabled=${pg >= pages} onClick=${() => setP(pg + 1)}>
          Next
        </button></span
      >
    </div>
  </div>`;
}

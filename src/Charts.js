// src/Charts.js
function DonutChart({ data }) {
  const [hv, setHv] = useState(null);
  const R = 68,
    C = 2 * Math.PI * R,
    tot = data.reduce((a, d) => a + d.v, 0) || 1,
    col = ["var(--pr)", "var(--pr2)", "var(--wa)", "#8b5cf6"];
  let off = 0;
  const cur = hv === null ? null : data[hv];
  return html`<div class="donut">
    <svg viewBox="0 0 180 180" width="180" height="180" onMouseLeave=${() => setHv(null)}>
      <circle
        cx="90"
        cy="90"
        r=${R}
        fill="none"
        stroke-width="22"
        style=${{ stroke: "var(--bd)" }}
      />
      ${data.map((d, i) => {
        const len = (d.v / tot) * C,
          el = html`<circle
            key=${d.label}
            cx="90"
            cy="90"
            r=${R}
            fill="none"
            stroke-width=${hv === i ? 26 : 22}
            stroke-dasharray=${len + " " + (C - len)}
            stroke-dashoffset=${-off}
            transform="rotate(-90 90 90)"
            style=${{ stroke: col[i % 4], transition: ".2s", cursor: "pointer" }}
            onMouseEnter=${() => setHv(i)}
          />`;
        off += len;
        return el;
      })}
      <text
        x="90"
        y="84"
        text-anchor="middle"
        style=${{ fill: "var(--mu)", fontSize: 11 }}
      >
        ${cur ? cur.label : "Total"}
      </text>
      <text
        x="90"
        y="104"
        text-anchor="middle"
        style=${{ fill: "var(--tx)", fontSize: 15, fontWeight: 700 }}
      >
        ₹${short(cur ? cur.v : tot)}
      </text>
    </svg>
    <div class="legend">
      ${data.map((d, i) => html`<div key=${d.label}><i style=${{ background: col[i % 4] }}></i>${d.label}<b>${Math.round((d.v / tot) * 100)}%</b></div>`)}
    </div>
  </div>`;
}

function HBarChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.v));
  return html`<div>
    ${data.map(
      (d) =>
        html`<div class="hb" key=${d.label} title=${inr(d.v)}>
          <span>${d.label}</span>
          <div class="prog"><i style=${{ width: (d.v / max) * 100 + "%" }}></i></div>
          <b>${inr(d.v)}</b>
        </div>`,
    )}
  </div>`;
}

// src/Dashboard.js
function Overview({ products, orders, customers }) {
  const ok = orders.filter((o) => o.status !== "Cancelled"),
    rev = ok.reduce((a, o) => a + o.total, 0);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
  ].map((m, i) => ({
    label: m,
    v: ok.filter((o) => +o.date.slice(5, 7) === i + 1).reduce((a, o) => a + o.total, 0),
  }));
  const cityOf = (n) => (customers.find((x) => x.name === n) || {}).city;
  const city = CITIES.map((c) => ({
    label: c,
    v: ok.filter((o) => cityOf(o.customer) === c).reduce((a, o) => a + o.total, 0),
  })).filter((d) => d.v > 0);
  const stats = [
    ["payments", "Revenue", inr(rev)],
    ["orders", "Orders", orders.length],
    ["customers", "Customers", customers.length],
    ["alert", "Low stock", products.filter((p) => p.stock < 10).length],
  ];
  return html`<div>
    <div class="grid">
      ${stats.map(
        ([i, l, v]) =>
          html`<div class="card stat" key=${l}>
            <div class="ic"><${Ic} n=${i} /></div>
            <div><span>${l}</span><b>${v}</b></div>
          </div>`,
      )}
    </div>
    <div class="grid g2">
      <div class="card">
        <h3>Revenue by city</h3>
        <p class="sub">Share of paid orders. Hover a segment.</p>
        <${DonutChart} data=${city} />
      </div>
      <div class="card">
        <h3>Monthly revenue</h3>
        <p class="sub">In ₹, excluding cancelled orders</p>
        <${HBarChart} data=${months} />
      </div>
      <div class="card">
        <h3>Orders by status</h3>
        <p class="sub">Share of all orders</p>
        ${ST.map((x) => {
          const n = orders.filter((o) => o.status === x).length;
          return html`<div key=${x} style=${{ marginBottom: 14 }}>
            ${x} · ${n}
            <div class="prog">
              <i style=${{ width: (n / Math.max(1, orders.length)) * 100 + "%" }}></i>
            </div>
          </div>`;
        })}
      </div>
    </div>
  </div>`;
}

// src/Inventory.js
function Inventory({ products, setProducts, toast }) {
  const rows = products.map((p) => ({ ...p, status: stockStatus(p.stock) }));
  const add = (p, n) => {
    setProducts(products.map((x) => (x.id === p.id ? { ...x, stock: x.stock + n } : x)));
    toast(`Restocked ${p.name} (+${n})`);
  };
  return html`<${Table}
    rows=${rows}
    searchKeys=${["name"]}
    filterKey="status"
    filterOpts=${["In stock", "Low stock", "Out of stock"]}
    cols=${[
      { k: "name", label: "Product" },
      {
        k: "stock",
        label: "Level",
        render: (r) =>
          html`<div style=${{ display: "flex", gap: 8, alignItems: "center" }}>
            ${r.stock}
            <div class="prog">
              <i style=${{ width: Math.min(100, r.stock) + "%" }}></i>
            </div>
          </div>`,
      },
      { k: "status", label: "Status", render: (r) => html`<${Badge} s=${r.status} />` },
    ]}
    actions=${(r) => html`<button class="btn sm" onClick=${() => add(r, 10)}>+10</button>`}
  />`;
}

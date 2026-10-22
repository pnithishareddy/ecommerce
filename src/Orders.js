// src/Orders.js
function Orders({ orders, setOrders, toast }) {
  const upd = (id, status) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    toast(`Order #${id} marked ${status}`);
  };
  return html`<${Table}
    rows=${orders}
    searchKeys=${["id", "customer"]}
    filterKey="status"
    filterOpts=${ST}
    cols=${[
      { k: "id", label: "Order", render: (r) => "#" + r.id },
      { k: "customer", label: "Customer" },
      { k: "date", label: "Date" },
      { k: "total", label: "Total", render: (r) => inr(r.total) },
      { k: "status", label: "Status", render: (r) => html`<${Badge} s=${r.status} />` },
    ]}
    actions=${(r) =>
      html`<select
        style=${{ width: 116, padding: 5 }}
        value=${r.status}
        onChange=${(e) => upd(r.id, e.target.value)}
      >
        ${ST.map((s) => html`<option key=${s}>${s}</option>`)}
      </select>`}
  />`;
}

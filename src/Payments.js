// src/Payments.js
function Payments({ orders }) {
  const METH = ["UPI", "Card", "Cash on Delivery", "Net Banking"];
  const rows = orders.map((o, i) => ({
    id: "PAY" + o.id,
    order: "#" + o.id,
    customer: o.customer,
    method: METH[i % 4],
    amount: o.total,
    date: o.date,
    status: {
      Delivered: "Paid",
      Shipped: "Paid",
      Pending: "Pending",
      Cancelled: "Refunded",
    }[o.status],
  }));
  const sum = (s) => rows.filter((r) => r.status === s).reduce((a, r) => a + r.amount, 0);
  return html`<div>
    <div class="grid">
      ${[
        ["check", "Received", inr(sum("Paid"))],
        ["clock", "Pending", inr(sum("Pending"))],
        ["refund", "Refunded", inr(sum("Refunded"))],
      ].map(
        ([i, l, v]) =>
          html`<div class="card stat" key=${l}>
            <div class="ic"><${Ic} n=${i} /></div>
            <div><span>${l}</span><b>${v}</b></div>
          </div>`,
      )}
    </div>
    <${Table}
      rows=${rows}
      searchKeys=${["id", "order", "customer", "method"]}
      filterKey="status"
      filterOpts=${["Paid", "Pending", "Refunded"]}
      cols=${[
        { k: "id", label: "Payment ID" },
        { k: "order", label: "Order" },
        { k: "customer", label: "Customer" },
        { k: "method", label: "Method" },
        { k: "date", label: "Date" },
        { k: "amount", label: "Amount", render: (r) => inr(r.amount) },
        { k: "status", label: "Status", render: (r) => html`<${Badge} s=${r.status} />` },
      ]}
    />
  </div>`;
}

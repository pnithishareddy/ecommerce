// src/Customers.js
function Customers({ customers }) {
  return html`<${Table}
    rows=${customers}
    searchKeys=${["name", "email", "city"]}
    filterKey="city"
    filterOpts=${CITIES}
    cols=${[
      {
        k: "name",
        label: "Name",
        render: (r) =>
          html`<span style=${{ display: "flex", gap: 10, alignItems: "center" }}
            ><span class="av" style=${{ width: 30, height: 30, fontSize: 12 }}
              >${initials(r.name)}</span
            >${r.name}</span
          >`,
      },
      { k: "email", label: "Email" },
      { k: "city", label: "City" },
      { k: "orders", label: "Orders" },
      { k: "spent", label: "Spent", render: (r) => inr(r.spent) },
    ]}
  />`;
}

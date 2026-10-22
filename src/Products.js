// src/Products.js
function ProductForm({ init, mode, onSave, onClose }) {
  const [v, setV] = useState(
      init || { name: "", category: CATS[0], price: "", stock: "" },
    ),
    [er, setEr] = useState({});
  const ro = mode === "view";
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const submit = () => {
    const e = {};
    if (v.name.trim().length < 3) e.name = "Name needs at least 3 characters";
    if (!(+v.price > 0)) e.price = "Price must be greater than 0";
    if (v.stock === "" || !Number.isInteger(+v.stock) || +v.stock < 0)
      e.stock = "Stock must be a whole number ≥ 0";
    setEr(e);
    if (!Object.keys(e).length)
      onSave({ ...v, name: v.name.trim(), price: +v.price, stock: +v.stock });
  };
  return html`<${Modal}
    title=${{ add: "Add product", edit: "Edit product", view: "Product details" }[mode]}
    onClose=${onClose}
  >
    <${Field}
      label="Name"
      value=${v.name}
      disabled=${ro}
      err=${er.name}
      onInput=${set("name")}
    />
    <div class="f">
      <label>Category</label
      ><select value=${v.category} disabled=${ro} onChange=${set("category")}>
        ${CATS.map((c) => html`<option key=${c}>${c}</option>`)}
      </select>
    </div>
    <div class="row">
      <${Field}
        label="Price (₹)"
        type="number"
        value=${v.price}
        disabled=${ro}
        err=${er.price}
        onInput=${set("price")}
      /><${Field}
        label="Stock"
        type="number"
        value=${v.stock}
        disabled=${ro}
        err=${er.stock}
        onInput=${set("stock")}
      />
    </div>
    ${!ro && html`<button class="btn pr" onClick=${submit}>Save</button>`}<//
  >`;
}

function Products({ products, setProducts, toast }) {
  const [m, setM] = useState(null);
  const rows = products.map((p) => ({ ...p, status: stockStatus(p.stock) }));
  const save = (d) => {
    if (m.mode === "add") {
      setProducts([...products, { ...d, id: Date.now() }]);
      toast("Product added");
    } else {
      setProducts(products.map((p) => (p.id === m.p.id ? { ...p, ...d } : p)));
      toast("Product updated");
    }
    setM(null);
  };
  const del = () => {
    setProducts(products.filter((p) => p.id !== m.p.id));
    toast("Product deleted");
    setM(null);
  };
  return html`<div>
    <div style=${{ textAlign: "right", marginBottom: 12 }}>
      <button class="btn pr" onClick=${() => setM({ mode: "add" })}>+ Add product</button>
    </div>
    <${Table}
      rows=${rows}
      searchKeys=${["name", "category"]}
      filterKey="category"
      filterOpts=${CATS}
      emptyMsg="No products match your search"
      cols=${[
        { k: "name", label: "Name" },
        { k: "category", label: "Category" },
        { k: "price", label: "Price", render: (r) => inr(r.price) },
        { k: "stock", label: "Stock" },
        { k: "status", label: "Status", render: (r) => html`<${Badge} s=${r.status} />` },
      ]}
      actions=${(r) => html`<button class="btn sm" onClick=${() => setM({ mode: "view", p: r })}>View</button> <button class="btn sm" onClick=${() => setM({ mode: "edit", p: r })}>Edit</button> <button class="btn sm dg" onClick=${() => setM({ mode: "del", p: r })}>Delete</button>`}
    />
    ${
      m && m.mode === "del"
        ? html`<${Modal} title="Delete product?" onClose=${() => setM(null)}
            ><p>“${m.p.name}” will be removed permanently.</p>
            <button class="btn dg" onClick=${del}>Delete</button><//
          >`
        : m &&
          html`<${ProductForm}
            mode=${m.mode}
            init=${m.p && { name: m.p.name, category: m.p.category, price: m.p.price, stock: m.p.stock }}
            onSave=${save}
            onClose=${() => setM(null)}
          />`
    }
  </div>`;
}

// src/SavedMethods.js
function MethodForm({ holder, onSave, onClose }) {
  const [v, setV] = useState({
      type: "Card",
      holder,
      number: "",
      expiry: "",
      cvv: "",
      upi: "",
    }),
    [er, setEr] = useState({});
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const submit = () => {
    const e = {};
    if (v.type === "Card") {
      const num = v.number.replace(/\s/g, "");
      if (v.holder.trim().length < 3) e.holder = "Enter the name on the card";
      if (!/^\d{16}$/.test(num)) e.number = "Card number must be 16 digits";
      const m = v.expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
      if (!m) e.expiry = "Use MM/YY";
      else {
        const now = new Date();
        if (
          2000 + +m[2] < now.getFullYear() ||
          (2000 + +m[2] === now.getFullYear() && +m[1] < now.getMonth() + 1)
        )
          e.expiry = "Card has expired";
      }
      if (!/^\d{3}$/.test(v.cvv)) e.cvv = "CVV must be 3 digits";
      setEr(e);
      if (Object.keys(e).length) return;
      onSave({
        type: "Card",
        label: { 4: "Visa", 5: "Mastercard", 6: "RuPay" }[num[0]] || "Card",
        holder: v.holder.trim(),
        last4: num.slice(-4),
        expiry: v.expiry,
      });
    } else {
      if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v.upi))
        e.upi = "Enter a valid UPI ID, e.g. name@okhdfc";
      setEr(e);
      if (Object.keys(e).length) return;
      onSave({ type: "UPI", label: v.upi, holder });
    }
  };
  return html`<${Modal} title="Add payment method" onClose=${onClose}>
    <div class="f">
      <label>Type</label
      ><select value=${v.type} onChange=${set("type")}>
        <option>Card</option>
        <option>UPI</option>
      </select>
    </div>
    ${
      v.type === "Card"
        ? html`<${Field}
              label="Name on card"
              value=${v.holder}
              err=${er.holder}
              onInput=${set("holder")}
            /><${Field}
              label="Card number"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              value=${v.number}
              err=${er.number}
              onInput=${set("number")}
            />
            <div class="row">
              <${Field}
                label="Expiry"
                placeholder="MM/YY"
                maxLength="5"
                value=${v.expiry}
                err=${er.expiry}
                onInput=${set("expiry")}
              /><${Field}
                label="CVV"
                type="password"
                inputMode="numeric"
                maxLength="3"
                value=${v.cvv}
                err=${er.cvv}
                onInput=${set("cvv")}
              />
            </div>`
        : html`<${Field}
            label="UPI ID"
            placeholder="name@okhdfc"
            value=${v.upi}
            err=${er.upi}
            onInput=${set("upi")}
          />`
    }
    <p class="sub">
      For your safety only the last 4 digits are stored. CVV is never saved.
    </p>
    <button class="btn pr" onClick=${submit}>Save method</button><//
  >`;
}

function SavedMethods({ methods, setMethods, toast, holder }) {
  const [add, setAdd] = useState(false);
  const save = (d) => {
    setMethods([...methods, { ...d, id: Date.now(), def: methods.length === 0 }]);
    setAdd(false);
    toast("Payment method saved");
  };
  const mk = (id) => {
    setMethods(methods.map((m) => ({ ...m, def: m.id === id })));
    toast("Default method updated");
  };
  const rm = (m) => {
    const r = methods.filter((x) => x.id !== m.id);
    if (m.def && r.length) r[0] = { ...r[0], def: true };
    setMethods(r);
    toast("Payment method removed");
  };
  return html`<div>
    <div style=${{ textAlign: "right", marginBottom: 12 }}>
      <button class="btn pr" onClick=${() => setAdd(true)}>+ Add method</button>
    </div>
    ${
      methods.length === 0
        ? html`<div class="card state">💳 No saved payment methods yet.</div>`
        : html`<div class="grid">
            ${methods.map(
              (m) =>
                html`<div key=${m.id} class=${"pm " + (m.type === "UPI" ? "upi" : "")}>
                  <span
                    >${m.type === "Card" ? m.label + " · Card" : "UPI"}
                    ${m.def ? "· ★ Default" : ""}</span
                  ><b>${m.type === "Card" ? "•••• •••• •••• " + m.last4 : m.label}</b
                  ><span>${m.holder}${m.expiry ? " · Expires " + m.expiry : ""}</span>
                  <div class="acts">
                    ${!m.def && html`<button class="btn sm" onClick=${() => mk(m.id)}>Make default</button>`}<button
                      class="btn sm"
                      onClick=${() => rm(m)}
                    >
                      Remove
                    </button>
                  </div>
                </div>`,
            )}
          </div>`
    }
    ${add && html`<${MethodForm} holder=${holder} onSave=${save} onClose=${() => setAdd(false)} />`}
  </div>`;
}

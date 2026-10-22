// src/Profile.js
function Profile({ profile, setProfile, toast }) {
  const [v, setV] = useState(profile),
    [er, setEr] = useState({});
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const save = () => {
    const e = {};
    if (v.name.trim().length < 3) e.name = "Name needs at least 3 characters";
    if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(v.phone))
      e.phone = "Enter a valid 10-digit Indian mobile number";
    setEr(e);
    if (!Object.keys(e).length) {
      setProfile({ ...v, name: v.name.trim() });
      toast("Profile updated");
    }
  };
  return html`<div class="grid g2">
    <div class="card" style=${{ textAlign: "center" }}>
      <div class="av lg" style=${{ margin: "0 auto 12px" }}>
        ${initials(profile.name)}
      </div>
      <h3>${profile.name}</h3>
      <p class="sub">${profile.role}<br />${profile.email}</p>
    </div>
    <div class="card">
      <h3>Personal information</h3>
      <p class="sub">Update your account details.</p>
      <${Field}
        label="Full name"
        value=${v.name}
        err=${er.name}
        onInput=${set("name")}
      /><${Field}
        label="Email"
        type="email"
        value=${v.email}
        err=${er.email}
        onInput=${set("email")}
      />
      <${Field}
        label="Mobile (India)"
        value=${v.phone}
        err=${er.phone}
        onInput=${set("phone")}
      /><${Field} label="Role" value=${v.role} disabled /><button
        class="btn pr"
        onClick=${save}
      >
        Save changes
      </button>
    </div>
  </div>`;
}

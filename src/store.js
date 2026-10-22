// src/store.js
const { useState, useEffect, useMemo } = React;
const html = htm.bind(React.createElement);
const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch (e) {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  },
};
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const short = (v) =>
  v >= 1e5
    ? (v / 1e5).toFixed(1) + "L"
    : v >= 1e3
      ? Math.round(v / 1e3) + "K"
      : String(Math.round(v));

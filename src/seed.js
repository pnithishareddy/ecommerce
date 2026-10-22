// src/seed.js
const CATS = ["Electronics", "Fashion", "Home", "Sports"],
  CITIES = ["Hyderabad", "Mumbai", "Delhi", "Pune"],
  ST = ["Pending", "Shipped", "Delivered", "Cancelled"];
const names = [
  "Wireless Earbuds",
  "Smart Watch",
  "Denim Jacket",
  "Running Shoes",
  "Desk Lamp",
  "Yoga Mat",
  "Coffee Maker",
  "Backpack",
  "Bluetooth Speaker",
  "Sofa Cushion",
  "Sneakers",
  "Gaming Mouse",
  "Water Bottle",
  "Dumbbell Set",
];
const seedP = names.map((n, i) => ({
  id: i + 1,
  name: n,
  category: CATS[i % 4],
  price: (20 + i * 13) * 85,
  stock: [0, 4, 25, 60, 8, 40, 3, 90, 15, 70, 0, 33, 120, 12][i],
}));
const people = ["abc def", "ghi jkl", "mno pqr", "stu vw", "xyz"];
const seedC = people.map((n, i) => ({
  id: i + 1,
  name: n,
  email: n.split(" ")[0] + "@mail.com",
  orders: i + 2,
  spent: (i + 1) * 11900,
  city: CITIES[i % 4],
}));
const seedO = Array.from({ length: 16 }, (_, i) => ({
  id: 1001 + i,
  customer: people[i % 5],
  total: (50 + i * 37) * 85,
  status: ST[i % 4],
  date: `2026-${String(1 + (i % 10)).padStart(2, "0")}-${String(3 + i).padStart(2, "0")}`,
}));
const seedM = [
  {
    id: 1,
    type: "Card",
    label: "Visa",
    holder: "nithisha",
    last4: "4242",
    expiry: "08/28",
    def: true,
  },
  { id: 2, type: "UPI", label: "nithisha@okhdfc", holder: "nithisha", def: false },
];
const seedProfile = {
  name: "Nithisha",
  email: "nithisha@mail.com",
  phone: "9876543210",
  role: "Admin",
};
const seedSet = {
  store: "ShopBoard Store",
  theme: "system",
  emailN: true,
  orderN: true,
  stockN: false,
};

export const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other Income"],
  expense: ["Food", "Transport", "Shopping", "Entertainment", "Health", "Rent", "Utilities", "Education", "Other"],
}

export const CATEGORY_COLORS = {
  Salary: "#16a34a",
  Freelance: "#22c55e",
  Investment: "#4ade80",
  "Gift": "#86efac",
  "Other Income": "#bbf7d0",
  Food: "#ef4444",
  Transport: "#f97316",
  Shopping: "#eab308",
  Entertainment: "#8b5cf6",
  Health: "#06b6d4",
  Rent: "#ec4899",
  Utilities: "#64748b",
  Education: "#3b82f6",
  Other: "#a8a29e",
}

export const initialTransactions = [
  { id: 1, type: "income", category: "Salary", amount: 3500, note: "Monthly salary", date: "2025-02-01" },
  { id: 2, type: "expense", category: "Rent", amount: 1200, note: "February rent", date: "2025-02-02" },
  { id: 3, type: "expense", category: "Food", amount: 85, note: "Grocery shopping", date: "2025-02-04" },
  { id: 4, type: "income", category: "Freelance", amount: 600, note: "Web project", date: "2025-02-05" },
  { id: 5, type: "expense", category: "Transport", amount: 45, note: "Monthly transit pass", date: "2025-02-06" },
  { id: 6, type: "expense", category: "Entertainment", amount: 30, note: "Netflix + Spotify", date: "2025-02-07" },
  { id: 7, type: "expense", category: "Shopping", amount: 120, note: "New shoes", date: "2025-02-09" },
  { id: 8, type: "expense", category: "Health", amount: 60, note: "Gym membership", date: "2025-02-10" },
  { id: 9, type: "income", category: "Investment", amount: 240, note: "Dividend payout", date: "2025-02-12" },
  { id: 10, type: "expense", category: "Food", amount: 55, note: "Dining out", date: "2025-02-14" },
  { id: 11, type: "expense", category: "Utilities", amount: 90, note: "Electricity bill", date: "2025-02-15" },
  { id: 12, type: "expense", category: "Education", amount: 199, note: "Online course", date: "2025-02-17" },
  { id: 13, type: "expense", category: "Food", amount: 40, note: "Coffee & snacks", date: "2025-02-18" },
  { id: 14, type: "income", category: "Freelance", amount: 350, note: "Logo design", date: "2025-02-19" },
]

export const initialBudgets = [
  { category: "Food", limit: 300 },
  { category: "Transport", limit: 100 },
  { category: "Shopping", limit: 200 },
  { category: "Entertainment", limit: 80 },
  { category: "Health", limit: 100 },
]

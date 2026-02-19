import { useState } from "react"
import Layout from "../components/Layout"
import { useFinance } from "../context/FinanceContext"
import { CATEGORIES, CATEGORY_COLORS } from "../data/mockData"

function BudgetBar({ category, limit, spent }) {
  const pct = Math.min((spent / limit) * 100, 100)
  const over = spent > limit
  const color = over ? "#ef4444" : pct > 75 ? "#f97316" : "#22c55e"

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            style={{ background: CATEGORY_COLORS[category] || "#a8a29e" }}
          >
            {category.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{category}</p>
            <p className="text-xs text-gray-400">
              ${spent.toFixed(2)} of ${limit.toFixed(2)}
            </p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          over ? "bg-red-100 text-red-600" : pct > 75 ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-700"
        }`}>
          {over ? `$${(spent - limit).toFixed(2)} over` : `$${(limit - spent).toFixed(2)} left`}
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5 text-right">{pct.toFixed(0)}%</p>
    </div>
  )
}

function Budget() {
  const { transactions, budgets, upsertBudget, deleteBudget } = useFinance()
  const [newCategory, setNewCategory] = useState("")
  const [newLimit, setNewLimit] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)
  const [editLimit, setEditLimit] = useState("")
  const [error, setError] = useState("")

  const expenseCategories = CATEGORIES.expense

  // Spending per expense category this month
  const thisMonth = new Date().toISOString().slice(0, 7)
  const spendingByCategory = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(thisMonth))
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpentOnBudgeted = budgets.reduce((sum, b) => sum + (spendingByCategory[b.category] || 0), 0)
  const overBudgetCount = budgets.filter((b) => (spendingByCategory[b.category] || 0) > b.limit).length

  const availableCategories = expenseCategories.filter((c) => !budgets.find((b) => b.category === c))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newCategory || !newLimit || Number(newLimit) <= 0) {
      setError("Please select a category and enter a valid limit.")
      return
    }
    upsertBudget(newCategory, newLimit)
    setNewCategory("")
    setNewLimit("")
    setError("")
  }

  const handleUpdate = (category) => {
    if (!editLimit || Number(editLimit) <= 0) return
    upsertBudget(category, editLimit)
    setEditingCategory(null)
    setEditLimit("")
  }

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="font-display text-4xl text-[#1a1a2e]">Budget Goals</h2>
        <p className="text-gray-400 mt-1 text-sm">Set monthly spending limits per category.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a2e] text-white rounded-2xl p-5">
          <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Total Budgeted</p>
          <p className="font-display text-3xl">${totalBudgeted.toFixed(2)}</p>
          <p className="text-xs opacity-40 mt-1">This month</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Spent on Budgeted</p>
          <p className="font-display text-3xl text-gray-800">${totalSpentOnBudgeted.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">{((totalSpentOnBudgeted / totalBudgeted) * 100 || 0).toFixed(0)}% of budget used</p>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm ${overBudgetCount > 0 ? "bg-red-50" : "bg-green-50"}`}>
          <p className={`text-xs uppercase tracking-widest mb-2 ${overBudgetCount > 0 ? "text-red-400" : "text-green-500"}`}>Over Budget</p>
          <p className={`font-display text-3xl ${overBudgetCount > 0 ? "text-red-600" : "text-green-700"}`}>{overBudgetCount}</p>
          <p className={`text-xs mt-1 ${overBudgetCount > 0 ? "text-red-400" : "text-green-500"}`}>
            {overBudgetCount > 0 ? "categories exceeded" : "All within limit 🎉"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Budget list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display text-xl text-[#1a1a2e]">Monthly Limits</h3>

          {budgets.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center text-gray-400 text-sm shadow-sm">
              No budget goals yet. Add one →
            </div>
          )}

          {budgets.map((b) => (
            <div key={b.category}>
              <BudgetBar
                category={b.category}
                limit={b.limit}
                spent={spendingByCategory[b.category] || 0}
              />
              <div className="flex gap-2 mt-2 px-1">
                {editingCategory === b.category ? (
                  <>
                    <input
                      type="number"
                      value={editLimit}
                      onChange={(e) => setEditLimit(e.target.value)}
                      placeholder="New limit"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400"
                    />
                    <button onClick={() => handleUpdate(b.category)} className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-semibold hover:bg-green-600">Save</button>
                    <button onClick={() => setEditingCategory(null)} className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs rounded-lg hover:bg-gray-200">Cancel</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditingCategory(b.category); setEditLimit(b.limit) }}
                      className="text-xs text-gray-400 hover:text-gray-700 transition"
                    >
                      Edit limit
                    </button>
                    <span className="text-gray-200">·</span>
                    <button
                      onClick={() => deleteBudget(b.category)}
                      className="text-xs text-red-300 hover:text-red-500 transition"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add budget form */}
        <div>
          <h3 className="font-display text-xl text-[#1a1a2e] mb-4">Add Goal</h3>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-green-400"
                >
                  <option value="">Select category</option>
                  {availableCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Monthly Limit</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="0.00"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="w-full p-3 pl-7 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-green-400"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              {availableCategories.length === 0 ? (
                <p className="text-xs text-gray-400 text-center">All categories have budget goals!</p>
              ) : (
                <button type="submit" className="w-full py-3 bg-[#1a1a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2d2d4e] transition">
                  Add Budget Goal
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Budget

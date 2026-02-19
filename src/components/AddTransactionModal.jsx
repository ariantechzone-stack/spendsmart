import { useState } from "react"
import { useFinance } from "../context/FinanceContext"
import { CATEGORIES } from "../data/mockData"

function AddTransactionModal({ onClose }) {
  const { addTransaction } = useFinance()
  const [type, setType] = useState("expense")
  const [form, setForm] = useState({ category: "", amount: "", note: "", date: new Date().toISOString().split("T")[0] })
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.category || !form.amount || !form.date) {
      setError("Category, amount and date are required.")
      return
    }
    addTransaction({ type, ...form, amount: Number(form.amount) })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl text-[#1a1a2e]">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
        </div>

        {/* Type toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          {["expense", "income"].map((t) => (
            <button
              key={t}
              onClick={() => { setType(t); setForm({ ...form, category: "" }) }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                type === t
                  ? t === "income"
                    ? "bg-green-500 text-white shadow"
                    : "bg-red-500 text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "income" ? "＋ Income" : "－ Expense"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-green-400"
            >
              <option value="">Select category</option>
              {CATEGORIES[type].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">Amount *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full p-3 pl-7 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-green-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">Note</label>
            <input
              type="text"
              placeholder="Optional note..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-green-400"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d4e] transition">
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTransactionModal

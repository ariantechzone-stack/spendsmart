import { useState } from "react"
import Layout from "../components/Layout"
import AddTransactionModal from "../components/AddTransactionModal"
import { useFinance } from "../context/FinanceContext"
import { CATEGORIES, CATEGORY_COLORS } from "../data/mockData"

const ITEMS_PER_PAGE = 10

function Transactions() {
  const { transactions, deleteTransaction } = useFinance()
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")
  const [sortDir, setSortDir] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)

  const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense]

  const months = [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort().reverse()

  let filtered = transactions.filter((t) => {
    const matchSearch = t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.note || "").toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === "all" || t.type === typeFilter
    const matchCat = categoryFilter === "all" || t.category === categoryFilter
    const matchMonth = monthFilter === "all" || t.date.startsWith(monthFilter)
    return matchSearch && matchType && matchCat && matchMonth
  })

  filtered.sort((a, b) => {
    return sortDir === "desc"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const totalFiltered = filtered.reduce((acc, t) => {
    if (t.type === "income") acc.income += t.amount
    else acc.expenses += t.amount
    return acc
  }, { income: 0, expenses: 0 })

  return (
    <Layout>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="font-display text-4xl text-[#1a1a2e]">Transactions</h2>
          <p className="text-gray-400 mt-1 text-sm">{filtered.length} transactions found</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#1a1a2e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d2d4e] transition"
        >
          + Add Transaction
        </button>
      </div>

      {/* Filter summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Filtered Income</p>
          <p className="text-lg font-bold text-green-600">+${totalFiltered.income.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Filtered Expenses</p>
          <p className="text-lg font-bold text-red-500">-${totalFiltered.expenses.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Net</p>
          <p className={`text-lg font-bold ${totalFiltered.income - totalFiltered.expenses >= 0 ? "text-green-600" : "text-red-500"}`}>
            ${(totalFiltered.income - totalFiltered.expenses).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search category or note..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
          className="flex-1 min-w-[180px] px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-green-400"
        />
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1) }}
          className="px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1) }}
          className="px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none"
        >
          <option value="all">All Categories</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={monthFilter}
          onChange={(e) => { setMonthFilter(e.target.value); setCurrentPage(1) }}
          className="px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none"
        >
          <option value="all">All Months</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {new Date(m + "-01").toLocaleString("default", { month: "long", year: "numeric" })}
            </option>
          ))}
        </select>
        <button
          onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
          className="px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm hover:bg-gray-50 transition"
        >
          Date {sortDir === "desc" ? "↓" : "↑"}
        </button>
      </div>

      {/* Transaction list */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {paginated.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No transactions match your filters.</p>
        ) : (
          paginated.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 hover:bg-gray-50/60 transition group">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[t.category] || "#a8a29e" }}
                >
                  {t.category.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.category}</p>
                  <p className="text-xs text-gray-400">{t.note || "No note"} · {t.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-bold ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
                  {t.type === "income" ? "+" : "−"}${t.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 text-sm"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                currentPage === i + 1 ? "bg-[#1a1a2e] text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 text-sm"
          >
            ›
          </button>
        </div>
      )}

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </Layout>
  )
}

export default Transactions

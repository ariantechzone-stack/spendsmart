import { useState } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import Layout from "../components/Layout"
import AddTransactionModal from "../components/AddTransactionModal"
import { useFinance } from "../context/FinanceContext"
import { CATEGORY_COLORS } from "../data/mockData"

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`rounded-2xl p-6 ${accent}`}>
      <p className="text-xs font-medium uppercase tracking-widest opacity-60 mb-2">{label}</p>
      <p className="font-display text-3xl">{value}</p>
      {sub && <p className="text-xs mt-2 opacity-50">{sub}</p>}
    </div>
  )
}

function Dashboard() {
  const { transactions, totalIncome, totalExpenses, balance } = useFinance()
  const [showModal, setShowModal] = useState(false)

  // Expense breakdown by category for pie chart
  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }))

  // Monthly trend for area chart
  const monthlyData = transactions.reduce((acc, t) => {
    const month = t.date.slice(0, 7)
    if (!acc[month]) acc[month] = { month, income: 0, expenses: 0 }
    if (t.type === "income") acc[month].income += t.amount
    else acc[month].expenses += t.amount
    return acc
  }, {})

  const areaData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)).map((d) => ({
    ...d,
    month: new Date(d.month + "-01").toLocaleString("default", { month: "short" }),
  }))

  const recent = [...transactions].slice(0, 5)

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="font-display text-4xl text-[#1a1a2e]">Overview</h2>
          <p className="text-gray-400 mt-1 text-sm">Your financial snapshot at a glance.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#1a1a2e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d2d4e] transition shadow-sm"
        >
          + Add Transaction
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Balance"
          value={`$${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          sub="Current net balance"
          accent={balance >= 0 ? "bg-[#1a1a2e] text-white" : "bg-red-600 text-white"}
        />
        <StatCard
          label="Total Income"
          value={`$${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          sub="All time income"
          accent="bg-green-50 text-green-900"
        />
        <StatCard
          label="Total Expenses"
          value={`$${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          sub="All time expenses"
          accent="bg-red-50 text-red-900"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-display text-xl text-[#1a1a2e] mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", fontSize: "13px" }}
              />
              <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-display text-xl text-[#1a1a2e] mb-4">By Category</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#a8a29e"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(v) => `$${v}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5 max-h-32 overflow-y-auto">
                {pieData.slice(0, 6).map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[d.name] || "#a8a29e" }} />
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">${d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm text-center mt-8">No expenses yet</p>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-display text-xl text-[#1a1a2e] mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {recent.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                  t.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}>
                  {t.type === "income" ? "+" : "−"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.category}</p>
                  <p className="text-xs text-gray-400">{t.note || "—"} · {t.date}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
                {t.type === "income" ? "+" : "−"}${t.amount.toFixed(2)}
              </span>
            </div>
          ))}
          {recent.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No transactions yet.</p>}
        </div>
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </Layout>
  )
}

export default Dashboard

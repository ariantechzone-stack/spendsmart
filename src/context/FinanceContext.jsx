import { createContext, useContext, useState } from "react"
import { initialTransactions, initialBudgets } from "../data/mockData"

const FinanceContext = createContext()

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("ss_transactions")
    return saved ? JSON.parse(saved) : initialTransactions
  })

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("ss_budgets")
    return saved ? JSON.parse(saved) : initialBudgets
  })

  const saveTransactions = (data) => {
    setTransactions(data)
    localStorage.setItem("ss_transactions", JSON.stringify(data))
  }

  const saveBudgets = (data) => {
    setBudgets(data)
    localStorage.setItem("ss_budgets", JSON.stringify(data))
  }

  const addTransaction = (tx) => {
    const updated = [{ ...tx, id: Date.now() }, ...transactions]
    saveTransactions(updated)
  }

  const deleteTransaction = (id) => {
    saveTransactions(transactions.filter((t) => t.id !== id))
  }

  const upsertBudget = (category, limit) => {
    const exists = budgets.find((b) => b.category === category)
    const updated = exists
      ? budgets.map((b) => b.category === category ? { ...b, limit: Number(limit) } : b)
      : [...budgets, { category, limit: Number(limit) }]
    saveBudgets(updated)
  }

  const deleteBudget = (category) => {
    saveBudgets(budgets.filter((b) => b.category !== category))
  }

  // Derived stats
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <FinanceContext.Provider value={{
      transactions, budgets,
      addTransaction, deleteTransaction,
      upsertBudget, deleteBudget,
      totalIncome, totalExpenses, balance,
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  return useContext(FinanceContext)
}

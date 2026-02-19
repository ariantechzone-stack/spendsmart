import { Routes, Route, Navigate } from "react-router-dom"
import { FinanceProvider } from "./context/FinanceContext"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Budget from "./pages/Budget"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <FinanceProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </FinanceProvider>
  )
}

export default App

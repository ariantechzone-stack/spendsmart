import { NavLink } from "react-router-dom"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "◈" },
  { to: "/transactions", label: "Transactions", icon: "⇄" },
  { to: "/budget", label: "Budget Goals", icon: "◎" },
]

function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-[#1a1a2e] flex flex-col justify-between py-8 px-5 fixed left-0 top-0">
      <div>
        {/* Logo */}
        <div className="mb-10">
          <h1 className="font-display text-2xl text-white">SpendSmart</h1>
          <p className="text-xs text-green-400 mt-0.5 tracking-widest uppercase">Finance Tracker</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-green-500/20 text-green-400 border border-green-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="text-xs text-gray-600 px-4">
        <p>© 2025 SpendSmart</p>
        <p className="mt-1">All data stored locally.</p>
      </div>
    </aside>
  )
}

export default Sidebar

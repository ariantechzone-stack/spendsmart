import Sidebar from "./Sidebar"

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f7f5f0]">
      <Sidebar />
      <main className="flex-1 ml-60 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default Layout

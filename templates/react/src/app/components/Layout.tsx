import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto">
          <div className="main-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

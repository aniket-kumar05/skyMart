import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'
import CartDrawer from '../components/CartDrawer'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white relative">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <CartDrawer />
    </div>
  )
}

export default MainLayout

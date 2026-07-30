import React from 'react'
import {Outlet} from "react-router"
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-(--bg) text-(--text)">
      <Outlet/>
    </div>
  )
}

export default AuthLayout

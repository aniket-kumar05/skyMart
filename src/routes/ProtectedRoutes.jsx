import React from 'react'
import { useContext } from 'react'
import {Outlet, Navigate} from "react-router"
import { AuthStore } from '../context/AuthContext'
const ProtectedRoutes = () => {
    let {loggedIn} = useContext(AuthStore);

    if(!loggedIn) return <Navigate to={"/login"} replace/>
  return <Outlet/>
}

export default ProtectedRoutes

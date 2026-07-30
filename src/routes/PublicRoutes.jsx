import React from 'react'
import { useContext } from 'react'
import {Outlet, Navigate} from "react-router"
import { AuthStore } from '../context/AuthContext'
const PublicRoutes = () => {
    let {loggedIn} = useContext(AuthStore);

    if(loggedIn) return <Navigate to="/home" replace/>
  return <Outlet/>
}

export default PublicRoutes

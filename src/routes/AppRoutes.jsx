import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router"
import AuthLayout from '../layout/AuthLayout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import MainLayout from '../layout/MainLayout'
import Home from '../pages/Home'
import ProtectedRoutes from './ProtectedRoutes'
import PublicRoutes from './PublicRoutes'
import Product from '../pages/Product'
import About from '../pages/About'
import ProductDetail from '../pages/ProductDetail'

const AppRoutes = () => {
    let router = createBrowserRouter([
        {
            path: "/",
            element: <PublicRoutes />,
            children: [
                {
                    path: "",
                    element: <AuthLayout />,
                    children: [
                        {
                            path: "login",
                            element: <Login />
                        },
                        {
                            path: "register",
                            element: <Register />
                        }
                    ]
                }
            ]
        },
        {
            path: "/",
            element: <ProtectedRoutes />,
            children: [
                {
                    element: <MainLayout />,
                    children: [
                        {
                            path: "home",
                            element: <Home />
                        },
                        {
                            path: "products",
                            element: <Product />
                        },
                        {
                            path: "products/:id",
                            element: <ProductDetail />
                        },
                        {
                            path: "about",
                            element: <About />
                        }
                    ]
                }
            ]
        }
    ])
    return <RouterProvider router={router} />
}

export default AppRoutes

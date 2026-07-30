import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppRoutes from './routes/AppRoutes.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ToastContainer } from 'react-toastify'
import { ProductProvider } from './context/Productrovider.jsx'

createRoot(document.getElementById('root')).render(

  <AuthProvider>
    <ProductProvider>
      <AppRoutes />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </ProductProvider>

  </AuthProvider>
)

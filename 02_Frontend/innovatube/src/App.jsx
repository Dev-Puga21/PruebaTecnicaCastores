import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/Security/ProtectedRoute'
import RegisterUserPage from './pages/RegisterUserPage'
import NotFound from './components/NotFound'
import ForgotPassword from './components/Security/Password/ForgotPasswordComponent'
import ResetPassword from './components/Security/Password/ResetPasswordComponent'
import Inicio from './pages/InicioPage'
import FavoriteVideos from './pages/FavoritesVideosPage'
import React from 'react'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className='pt-20 bg-gray-200'>
          <Routes>
            <Route index element={<LoginPage />} />
            <Route path='/register' element={<RegisterUserPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<ProtectedRoute />} >
              <Route path="/home" element={<Inicio />} />
              <Route path="/favorites" element={<FavoriteVideos />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;

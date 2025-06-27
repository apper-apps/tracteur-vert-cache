import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AuthContext } from '@/App'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = () => {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)
  const { isAuthenticated, user } = useSelector((state) => state.user)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold mr-3">
              T
            </div>
            <span className="text-xl font-display font-bold text-gray-900">
              TracteurVert
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Accueil
            </Link>
            <Link 
              to="/search" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Rechercher
            </Link>
            <Link 
              to="/brands" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Marques
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/messages" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Messages
                </Link>
                <Link 
                  to="/saved" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Favoris
                </Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  as={Link}
                  to="/post-listing"
                  variant="primary"
                  icon="Plus"
                  size="sm"
                >
                  Publier
                </Button>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    Bonjour, {user?.firstName || 'Utilisateur'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="LogOut"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="ghost"
                  size="sm"
                >
                  Connexion
                </Button>
                <Button
                  as={Link}
                  to="/signup"
                  variant="primary"
                  size="sm"
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
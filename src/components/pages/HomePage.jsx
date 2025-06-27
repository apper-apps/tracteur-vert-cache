import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SearchBar from '@/components/molecules/SearchBar'
import ListingGrid from '@/components/organisms/ListingGrid'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import listingService from '@/services/api/listingService'

const HomePage = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadListings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await listingService.getAll()
      // Show recent listings first (last 12)
      setListings(data.slice(-12).reverse())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListings()
  }, [])

  const stats = [
    { label: 'Tracteurs disponibles', value: '250+', icon: 'Tractor' },
    { label: 'Vendeurs actifs', value: '180+', icon: 'Users' },
    { label: 'Ventes réalisées', value: '1,200+', icon: 'TrendingUp' },
    { label: 'Satisfaction client', value: '98%', icon: 'Star' }
  ]

  const categories = [
    { name: 'Husqvarna', count: 45, image: '/api/placeholder/200/150' },
    { name: 'John Deere', count: 38, image: '/api/placeholder/200/150' },
    { name: 'MTD', count: 29, image: '/api/placeholder/200/150' },
    { name: 'Craftsman', count: 24, image: '/api/placeholder/200/150' }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6">
                Trouvez le tracteur tondeuse
                <span className="block bg-gradient-to-r from-secondary-400 to-secondary-500 bg-clip-text text-transparent">
                  parfait pour vous
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
                Découvrez notre sélection de tracteurs tondeuses d'occasion de qualité, 
                vendus par des particuliers et professionnels de confiance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <SearchBar expanded />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                as={Link}
                to="/search"
                size="lg"
                variant="secondary"
                icon="Search"
              >
                Parcourir tous les tracteurs
              </Button>
              <Button
                as={Link}
                to="/post-listing"
                size="lg"
                variant="outline"
                icon="Plus"
                className="border-white text-white hover:bg-white hover:text-primary-700"
              >
                Vendre mon tracteur
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-card p-6 text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
            Marques populaires
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les tracteurs tondeuses des marques les plus recherchées
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-card overflow-hidden cursor-pointer group"
            >
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-1">
                  {category.name}
                </h3>
                <Badge variant="primary" size="sm">
                  {category.count} tracteurs
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-2">
              Annonces récentes
            </h2>
            <p className="text-lg text-gray-600">
              Les derniers tracteurs tondeuses mis en vente
            </p>
          </div>
          <Button
            as={Link}
            to="/search"
            variant="outline"
            icon="ArrowRight"
          >
            Voir tout
          </Button>
        </div>

        <ListingGrid
          listings={listings}
          loading={loading}
          error={error}
          onRetry={loadListings}
          emptyTitle="Aucune annonce récente"
          emptyDescription="Soyez le premier à publier une annonce de tracteur tondeuse !"
        />
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white space-y-6">
            <h2 className="text-3xl lg:text-4xl font-display font-bold">
              Prêt à vendre votre tracteur ?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Publiez votre annonce gratuitement et trouvez un acheteur rapidement
            </p>
            <Button
              as={Link}
              to="/post-listing"
              size="xl"
              variant="secondary"
              icon="Plus"
            >
              Publier une annonce gratuite
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
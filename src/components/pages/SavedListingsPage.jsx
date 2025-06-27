import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ListingGrid from '@/components/organisms/ListingGrid'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const SavedListingsPage = () => {
  const [savedListings, setSavedListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadSavedListings = async () => {
    try {
      setLoading(true)
      setError(null)
      // Mock saved listings - in real app, would fetch from local storage or API
      await new Promise(resolve => setTimeout(resolve, 500))
      setSavedListings([]) // Empty for demo
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavedListings()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Mes favoris
              </h1>
              <p className="text-gray-600">
                {loading 
                  ? 'Chargement...' 
                  : `${savedListings.length} tracteur${savedListings.length !== 1 ? 's' : ''} sauvegardé${savedListings.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            
            {savedListings.length > 0 && (
              <Button
                variant="outline"
                icon="Trash2"
                onClick={() => setSavedListings([])}
              >
                Tout supprimer
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <ListingGrid
          listings={savedListings}
          loading={loading}
          error={error}
          onRetry={loadSavedListings}
          emptyTitle="Aucun favori sauvegardé"
          emptyDescription="Vous n'avez pas encore ajouté de tracteurs à vos favoris. Parcourez nos annonces et cliquez sur le cœur pour sauvegarder vos tracteurs préférés."
        />

        {/* Tips Section */}
        {!loading && savedListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <div className="bg-white rounded-lg shadow-card p-8">
              <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
                Comment utiliser vos favoris ?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="Heart" className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Sauvegardez
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cliquez sur le cœur des annonces qui vous intéressent
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="Eye" className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Comparez
                  </h3>
                  <p className="text-sm text-gray-600">
                    Retrouvez facilement vos tracteurs préférés pour les comparer
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="MessageCircle" className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Contactez
                  </h3>
                  <p className="text-sm text-gray-600">
                    Prenez votre temps pour contacter les vendeurs
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SavedListingsPage
import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const ListingCard = ({ 
  listing, 
  onSave, 
  onContact, 
  saved = false,
  className = '',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Fallback image for failed loads
  const fallbackImage = `https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Image+non+disponible`
  
  // Get the primary image or fallback
  const primaryImage = listing?.images?.[0] || fallbackImage
  const displayImage = imageError ? fallbackImage : primaryImage

  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoading(false)
  }, [])

  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
  }, [])

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Prix non renseigné'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getConditionColor = (condition) => {
    if (!condition) return 'default'
    switch (condition.toLowerCase()) {
      case 'excellent': return 'success'
      case 'très bon': return 'primary'
      case 'bon': return 'warning'
      case 'acceptable': return 'error'
      default: return 'default'
    }
  }

  const handleSaveClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onSave?.(listing)
  }

  const handleContactClick = (e) => {
    e.preventDefault()  
    e.stopPropagation()
    onContact?.(listing)
  }

  if (!listing) {
    return (
      <div className="bg-white rounded-lg shadow-card p-4">
        <div className="text-center text-gray-500">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 mx-auto mb-2" />
          <p>Données de l'annonce non disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg shadow-card hover:shadow-hover transition-all duration-200 overflow-hidden group ${className}`}
      {...props}
    >
      <Link to={`/tracteur/${listing.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          <img
            src={displayImage}
            alt={listing.title || 'Tracteur'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
          
          {/* Image Error Indicator */}
          {imageError && (
            <div className="absolute top-2 left-2 bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
              <ApperIcon name="ImageOff" className="w-3 h-3 inline mr-1" />
              Image indisponible
            </div>
          )}

          {/* Featured Badge */}
          {listing.featured && (
            <div className="absolute top-2 right-2">
              <Badge variant="primary" size="sm">
                <ApperIcon name="Star" className="w-3 h-3 mr-1" />
                Recommandé
              </Badge>
            </div>
          )}

          {/* Save Button */}
          <Button
            variant="ghost"
            size="sm"
            icon={saved ? "Heart" : "Heart"}
            onClick={handleSaveClick}
            className={`absolute top-2 right-2 bg-white/80 hover:bg-white shadow-sm ${
              listing.featured ? 'top-12' : ''
            } ${saved ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'}`}
            aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          />

          {/* Image Count */}
          {listing.images && listing.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center">
              <ApperIcon name="Camera" className="w-3 h-3 mr-1" />
              {listing.images.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="mb-3">
            <h3 className="font-display font-semibold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">
              {listing.title || 'Titre non renseigné'}
            </h3>
            <p className="text-gray-600 text-sm">
              {[listing.brand, listing.model, listing.year].filter(Boolean).join(' • ') || 'Détails non renseignés'}
            </p>
          </div>

          {/* Price and Condition */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-display font-bold text-primary-700">
              {formatPrice(listing.price)}
            </div>
            {listing.condition && (
              <Badge variant={getConditionColor(listing.condition)} size="sm">
                {listing.condition}
              </Badge>
            )}
          </div>

          {/* Location and Date */}
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            {listing.location && (
              <div className="flex items-center">
                <ApperIcon name="MapPin" className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {listing.location}
                  {listing.distance && (
                    <span className="ml-1">({listing.distance} km)</span>
                  )}
                </span>
              </div>
            )}
            
            {listing.postedDate && (
              <div className="flex items-center">
                <ApperIcon name="Clock" className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  {formatDistanceToNow(new Date(listing.postedDate), { 
                    locale: fr, 
                    addSuffix: true 
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Key Specifications */}
          {listing.specifications && (
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
              {listing.specifications.enginePower && (
                <div className="flex items-center">
                  <ApperIcon name="Zap" className="w-3 h-3 mr-1" />
                  {listing.specifications.enginePower} CV
                </div>
              )}
              {listing.specifications.fuelType && (
                <div className="flex items-center">
                  <ApperIcon name="Fuel" className="w-3 h-3 mr-1" />
                  {listing.specifications.fuelType}
                </div>
              )}
              {listing.specifications.cuttingWidth && (
                <div className="flex items-center">
                  <ApperIcon name="Scissors" className="w-3 h-3 mr-1" />
                  {listing.specifications.cuttingWidth} cm
                </div>
              )}
              {listing.specifications.wheelDrive && (
                <div className="flex items-center">
                  <ApperIcon name="Settings" className="w-3 h-3 mr-1" />
                  {listing.specifications.wheelDrive}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              icon="MessageCircle"
              onClick={handleContactClick}
              className="flex-1"
            >
              Contacter
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="Phone"
              onClick={handleContactClick}
            >
              Appeler
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ListingCard
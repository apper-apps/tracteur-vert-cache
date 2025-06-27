import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const ListingCard = ({ listing }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/listing/${listing.Id}`)
  }

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent': return 'success'
      case 'très bon': return 'primary'
      case 'bon': return 'warning'
      case 'acceptable': return 'error'
      default: return 'default'
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.images?.[0] || '/api/placeholder/400/300'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="price" size="lg">
            {formatPrice(listing.price)}
          </Badge>
        </div>

        {/* Distance Badge */}
        {listing.distance && (
          <div className="absolute top-3 left-3">
            <Badge variant="default" size="sm">
              <ApperIcon name="MapPin" className="w-3 h-3 mr-1" />
              {listing.distance} km
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Year */}
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary-700 transition-colors">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-600">
            {listing.brand} {listing.model} • {listing.year}
          </p>
        </div>

        {/* Condition and Location */}
        <div className="flex items-center justify-between">
          <Badge variant={getConditionColor(listing.condition)} size="sm">
            {listing.condition}
          </Badge>
          
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
            {listing.location}
          </div>
        </div>

        {/* Specifications Preview */}
        {listing.specifications && (
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            {listing.specifications.enginePower && (
              <div className="flex items-center">
                <ApperIcon name="Zap" className="w-3 h-3 mr-1" />
                {listing.specifications.enginePower} CV
              </div>
            )}
            {listing.specifications.cuttingWidth && (
              <div className="flex items-center">
                <ApperIcon name="Scissors" className="w-3 h-3 mr-1" />
                {listing.specifications.cuttingWidth} cm
              </div>
            )}
          </div>
        )}

        {/* Posted Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>
            Publié {formatDistanceToNow(new Date(listing.postedDate), { locale: fr, addSuffix: true })}
          </span>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  )
}

export default ListingCard
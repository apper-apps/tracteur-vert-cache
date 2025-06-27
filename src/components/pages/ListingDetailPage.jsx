import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'react-toastify'
import ImageGallery from '@/components/organisms/ImageGallery'
import ContactForm from '@/components/molecules/ContactForm'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import listingService from '@/services/api/listingService'

const ListingDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [saved, setSaved] = useState(false)

  const loadListing = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await listingService.getById(parseInt(id))
      setListing(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListing()
  }, [id])

  const handleSave = () => {
    setSaved(!saved)
    toast.success(saved ? 'Retiré des favoris' : 'Ajouté aux favoris')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Découvrez ce ${listing.title} sur TracteurVert`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Erreur lors du partage:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Lien copié dans le presse-papiers')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg shimmer" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg shimmer" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded shimmer" />
              <div className="h-6 bg-gray-200 rounded w-3/4 shimmer" />
              <div className="h-12 bg-gray-200 rounded shimmer" />
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded shimmer" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error 
            message={error}
            onRetry={loadListing}
          />
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error 
            message="Annonce non trouvée"
            showRetry={false}
          />
        </div>
      </div>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Retour aux résultats
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageGallery 
              images={listing.images || []} 
              title={listing.title}
            />
          </motion.div>

          {/* Listing Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {listing.brand} {listing.model} • {listing.year}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={saved ? "Heart" : "Heart"}
                    onClick={handleSave}
                    className={saved ? "text-red-500" : ""}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Share2"
                    onClick={handleShare}
                  />
                </div>
              </div>

              {/* Price and Condition */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-display font-bold text-primary-700">
                  {formatPrice(listing.price)}
                </div>
                <Badge variant={getConditionColor(listing.condition)} size="lg">
                  {listing.condition}
                </Badge>
              </div>

              {/* Location and Date */}
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center">
                  <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                  {listing.location}
                  {listing.distance && (
                    <span className="ml-2 text-sm">({listing.distance} km)</span>
                  )}
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                  {formatDistanceToNow(new Date(listing.postedDate), { locale: fr, addSuffix: true })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                icon="MessageCircle"
                onClick={() => setShowContactForm(!showContactForm)}
                className="flex-1"
              >
                Contacter le vendeur
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon="Phone"
              >
                Appeler
              </Button>
            </div>

            {/* Contact Form */}
            {showContactForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white p-6 rounded-lg shadow-card"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Envoyer un message
                </h3>
                <ContactForm
                  listingId={listing.Id}
                  listingTitle={listing.title}
                  onClose={() => setShowContactForm(false)}
                />
              </motion.div>
            )}

            {/* Specifications */}
            {listing.specifications && (
              <div className="bg-white p-6 rounded-lg shadow-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Caractéristiques
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(listing.specifications).map(([key, value]) => {
                    const labels = {
                      enginePower: 'Puissance moteur',
                      cuttingWidth: 'Largeur de coupe',
                      fuelType: 'Type de carburant',
                      transmission: 'Transmission',
                      deckType: 'Type de plateau',
                      wheelDrive: 'Transmission roues'
                    }
                    
                    const units = {
                      enginePower: 'CV',
                      cuttingWidth: 'cm'
                    }
                    
                    return (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-600">
                          {labels[key] || key}
                        </span>
                        <span className="font-medium text-gray-900">
                          {value} {units[key] || ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="bg-white p-6 rounded-lg shadow-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap">{listing.description}</p>
                </div>
              </div>
            )}

            {/* Seller Info */}
            {listing.sellerContact && (
              <div className="bg-white p-6 rounded-lg shadow-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  À propos du vendeur
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {listing.sellerContact.name || 'Vendeur particulier'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Membre depuis {new Date().getFullYear() - 1}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetailPage
import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import ApperIcon from '@/components/ApperIcon'

const ImageGallery = ({ images = [], title = 'Image' }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [imageErrors, setImageErrors] = useState(new Set())
  const [loadingImages, setLoadingImages] = useState(new Set())

  // Fallback image URL for failed loads
  const fallbackImage = `https://via.placeholder.com/800x600/e5e7eb/9ca3af?text=Image+non+disponible`

  // Filter out failed images and provide fallbacks
  const validImages = images.length > 0 
    ? images.map((img, index) => imageErrors.has(index) ? fallbackImage : img)
    : [fallbackImage]

  const handleImageError = useCallback((index) => {
    setImageErrors(prev => new Set([...prev, index]))
    setLoadingImages(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }, [])

  const handleImageLoad = useCallback((index) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }, [])

  const handleImageLoadStart = useCallback((index) => {
    setLoadingImages(prev => new Set([...prev, index]))
  }, [])

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % validImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  const openModal = (index) => {
    setSelectedImage(index)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  // Handle keyboard navigation
  const handleKeyPress = (e) => {
    if (!showModal) return
    
    switch (e.key) {
      case 'ArrowLeft':
        prevImage()
        break
      case 'ArrowRight':
        nextImage()
        break
      case 'Escape':
        closeModal()
        break
    }
  }

  React.useEffect(() => {
    if (showModal) {
      document.addEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyPress)
        document.body.style.overflow = 'unset'
      }
    }
  }, [showModal])

  if (!validImages || validImages.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="ImageOff" className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">Aucune image disponible</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative group">
          <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
            {loadingImages.has(selectedImage) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <Loading size="sm" />
              </div>
            )}
            <img
              src={validImages[selectedImage]}
              alt={`${title} - Image ${selectedImage + 1}`}
              className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
              onClick={() => openModal(selectedImage)}
              onError={() => handleImageError(selectedImage)}
              onLoad={() => handleImageLoad(selectedImage)}
              onLoadStart={() => handleImageLoadStart(selectedImage)}
              loading="lazy"
            />
            
            {/* Navigation Arrows - Main Image */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Image précédente"
                >
                  <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Image suivante"
                >
                  <ApperIcon name="ChevronRight" className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {validImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {selectedImage + 1} / {validImages.length}
              </div>
            )}

            {/* Zoom Button */}
            <button
              onClick={() => openModal(selectedImage)}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Agrandir l'image"
            >
              <ApperIcon name="ZoomIn" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        {validImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {validImages.map((image, index) => (
              <div key={index} className="relative group cursor-pointer">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {loadingImages.has(index) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={image}
                    alt={`${title} - Miniature ${index + 1}`}
                    className={`w-full h-full object-cover transition-all ${
                      selectedImage === index 
                        ? 'ring-2 ring-primary-500 opacity-100' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedImage(index)}
                    onError={() => handleImageError(index)}
                    onLoad={() => handleImageLoad(index)}
                    onLoadStart={() => handleImageLoadStart(index)}
                    loading="lazy"
                  />
                </div>
                {selectedImage === index && (
                  <div className="absolute inset-0 ring-2 ring-primary-500 rounded-lg pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white"
              />

              {/* Main Modal Image */}
              <div className="relative max-w-full max-h-full">
                {loadingImages.has(selectedImage) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loading className="text-white" />
                  </div>
                )}
                <img
                  src={validImages[selectedImage]}
                  alt={`${title} - Image ${selectedImage + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                  onError={() => handleImageError(selectedImage)}
                  onLoad={() => handleImageLoad(selectedImage)}
                />
              </div>

              {/* Navigation Arrows - Modal */}
              {validImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full"
                    aria-label="Image précédente"
                  >
                    <ApperIcon name="ChevronLeft" className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full"
                    aria-label="Image suivante"
                  >
                    <ApperIcon name="ChevronRight" className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter - Modal */}
              {validImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded">
                  {selectedImage + 1} / {validImages.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery
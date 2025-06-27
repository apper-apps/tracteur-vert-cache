import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const ImageGallery = ({ images = [], title = "" }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [showModal, setShowModal] = useState(false)

  if (!images.length) {
    return (
      <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <ApperIcon name="Image" className="w-16 h-16 mx-auto mb-2" />
          <p>Aucune image disponible</p>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 group">
          <img
            src={images[currentImage]}
            alt={`${title} - Image ${currentImage + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowModal(true)}
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ApperIcon name="ChevronLeft" className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ApperIcon name="ChevronRight" className="w-5 h-5" />
              </button>
            </>
          )}
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentImage + 1} / {images.length}
            </div>
          )}
          
          {/* Zoom Indicator */}
          <div className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ApperIcon name="ZoomIn" className="w-4 h-4" />
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`
                  flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200
                  ${index === currentImage 
                    ? 'border-primary-500 opacity-100' 
                    : 'border-gray-200 opacity-70 hover:opacity-100'
                  }
                `}
              >
                <img
                  src={image}
                  alt={`${title} - Miniature ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
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
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentImage]}
                alt={`${title} - Image ${currentImage + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
              
              {/* Modal Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
                  >
                    <ApperIcon name="ChevronLeft" className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
                  >
                    <ApperIcon name="ChevronRight" className="w-6 h-6" />
                  </button>
                </>
              )}
              
              {/* Modal Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-2 rounded">
                  {currentImage + 1} / {images.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery
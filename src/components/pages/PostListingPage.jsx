import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import listingService from '@/services/api/listingService'

const PostListingPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    condition: '',
    description: '',
    
    // Specifications
    enginePower: '',
    cuttingWidth: '',
    fuelType: '',
    transmission: '',
    deckType: '',
    wheelDrive: '',
    
    // Location
    location: '',
    
    // Contact
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    
    // Images (mock URLs for demo)
    images: []
  })

  const steps = [
    { id: 1, title: 'Informations de base', icon: 'Info' },
    { id: 2, title: 'Caractéristiques', icon: 'Settings' },
    { id: 3, title: 'Photos', icon: 'Camera' },
    { id: 4, title: 'Contact', icon: 'User' }
  ]

  const brands = [
    { value: '', label: 'Sélectionner une marque' },
    { value: 'husqvarna', label: 'Husqvarna' },
    { value: 'john-deere', label: 'John Deere' },
    { value: 'mtd', label: 'MTD' },
    { value: 'craftsman', label: 'Craftsman' },
    { value: 'cub-cadet', label: 'Cub Cadet' },
    { value: 'toro', label: 'Toro' },
    { value: 'poulan-pro', label: 'Poulan Pro' },
    { value: 'troy-bilt', label: 'Troy-Bilt' }
  ]

  const conditions = [
    { value: '', label: 'Sélectionner un état' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'très bon', label: 'Très bon' },
    { value: 'bon', label: 'Bon' },
    { value: 'acceptable', label: 'Acceptable' }
  ]

  const fuelTypes = [
    { value: '', label: 'Type de carburant' },
    { value: 'essence', label: 'Essence' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electrique', label: 'Électrique' },
    { value: 'batterie', label: 'Batterie' }
  ]

  const transmissions = [
    { value: '', label: 'Type de transmission' },
    { value: 'manuelle', label: 'Manuelle' },
    { value: 'hydrostatique', label: 'Hydrostatique' },
    { value: 'automatique', label: 'Automatique' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Le titre est requis'
        if (!formData.brand) newErrors.brand = 'La marque est requise'
        if (!formData.model.trim()) newErrors.model = 'Le modèle est requis'
        if (!formData.year) newErrors.year = 'L\'année est requise'
        if (!formData.price) newErrors.price = 'Le prix est requis'
        if (!formData.condition) newErrors.condition = 'L\'état est requis'
        break
      case 2:
        // Specifications are optional
        break
      case 3:
        // Images are optional for demo
        break
      case 4:
        if (!formData.location.trim()) newErrors.location = 'La localisation est requise'
        if (!formData.sellerName.trim()) newErrors.sellerName = 'Le nom est requis'
        if (!formData.sellerEmail.trim()) newErrors.sellerEmail = 'L\'email est requis'
        else if (!/\S+@\S+\.\S+/.test(formData.sellerEmail)) newErrors.sellerEmail = 'Format d\'email invalide'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // Mock image URLs for demo
    const mockImages = files.map((_, index) => 
      `/api/placeholder/800/600?random=${Date.now()}-${index}`
    )
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...mockImages].slice(0, 10) // Max 10 images
    }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return
    }
    
    setLoading(true)
    
    try {
const listingData = {
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        condition: formData.condition,
        location: formData.location,
        description: formData.description,
        engine_power: formData.enginePower ? parseInt(formData.enginePower) : null,
        cutting_width: formData.cuttingWidth ? parseInt(formData.cuttingWidth) : null,
        fuel_type: formData.fuelType,
        transmission: formData.transmission,
        deck_type: formData.deckType,
        wheel_drive: formData.wheelDrive,
        seller_name: formData.sellerName,
        seller_email: formData.sellerEmail,
        seller_phone: formData.sellerPhone,
        posted_date: new Date().toISOString(),
        images: formData.images.join(','), // Convert array to comma-separated string
        distance: Math.floor(Math.random() * 50), // Mock distance
        featured: false
      }
      
      const newListing = await listingService.create(listingData)
      
      toast.success('Votre annonce a été publiée avec succès!')
      navigate(`/listing/${newListing.Id}`)
    } catch (error) {
      toast.error('Erreur lors de la publication de l\'annonce')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Input
              label="Titre de l'annonce"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              placeholder="Ex: Tracteur tondeuse Husqvarna YTH 2448"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Marque"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                error={errors.brand}
                options={brands}
                required
              />
              
              <Input
                label="Modèle"
                name="model"
                value={formData.model}
                onChange={handleChange}
                error={errors.model}
                required
                placeholder="YTH 2448"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Année"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                error={errors.year}
                required
                placeholder="2020"
                min="1990"
                max={new Date().getFullYear()}
              />
              
              <Input
                label="Prix (€)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                required
                placeholder="3500"
                min="0"
              />
              
              <Select
                label="État"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                error={errors.condition}
                options={conditions}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-vertical"
                placeholder="Décrivez votre tracteur tondeuse (état, entretien, accessoires inclus...)"
              />
            </div>
          </div>
        )
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Puissance moteur (CV)"
                name="enginePower"
                type="number"
                value={formData.enginePower}
                onChange={handleChange}
                placeholder="24"
              />
              
              <Input
                label="Largeur de coupe (cm)"
                name="cuttingWidth"
                type="number"
                value={formData.cuttingWidth}
                onChange={handleChange}
                placeholder="122"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Type de carburant"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                options={fuelTypes}
              />
              
              <Select
                label="Transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                options={transmissions}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Type de plateau"
                name="deckType"
                value={formData.deckType}
                onChange={handleChange}
                placeholder="Acier estampé"
              />
              
              <Input
                label="Transmission roues"
                name="wheelDrive"
                value={formData.wheelDrive}
                onChange={handleChange}
                placeholder="Arrière"
              />
            </div>
          </div>
        )
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <ApperIcon name="Upload" className="w-6 h-6 mr-3 text-gray-400" />
                <span className="text-gray-600">
                  Cliquez pour ajouter des photos (max 10)
                </span>
              </label>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
        
      case 4:
        return (
          <div className="space-y-6">
            <Input
              label="Localisation"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              required
              placeholder="Ville, Code postal"
              icon="MapPin"
            />
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">
                Informations de contact
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Nom complet"
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={handleChange}
                  error={errors.sellerName}
                  required
                  icon="User"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    name="sellerEmail"
                    type="email"
                    value={formData.sellerEmail}
                    onChange={handleChange}
                    error={errors.sellerEmail}
                    required
                    icon="Mail"
                  />
                  
                  <Input
                    label="Téléphone"
                    name="sellerPhone"
                    type="tel"
                    value={formData.sellerPhone}
                    onChange={handleChange}
                    icon="Phone"
                  />
                </div>
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Publier une annonce
          </h1>
          <p className="text-gray-600">
            Vendez votre tracteur tondeuse rapidement et facilement
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-2 md:space-x-8">
              {steps.map((step, index) => (
                <li key={step.id} className="relative">
                  <div className="flex items-center">
                    <div
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                        ${currentStep >= step.id
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'bg-white border-gray-300 text-gray-500'
                        }
                      `}
                    >
                      <ApperIcon name={step.icon} className="w-5 h-5" />
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div
                        className={`
                          hidden md:block w-16 h-0.5 transition-colors
                          ${currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'}
                        `}
                      />
                    )}
                  </div>
                  
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center">
                    <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                      {step.title}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-card p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              icon="ChevronLeft"
            >
              Précédent
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                icon="ChevronRight"
                iconPosition="right"
              >
                Suivant
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={loading}
                icon="Check"
                size="lg"
              >
                Publier l'annonce
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostListingPage
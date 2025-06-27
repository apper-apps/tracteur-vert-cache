import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import contactService from '@/services/api/contactService'

const ContactForm = ({ listingId, listingTitle, onClose }) => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    message: `Bonjour, je suis intéressé(e) par votre annonce "${listingTitle}". Pourriez-vous me donner plus d'informations ?`
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.senderName.trim()) {
      newErrors.senderName = 'Le nom est requis'
    }
    
    if (!formData.senderEmail.trim()) {
      newErrors.senderEmail = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.senderEmail)) {
      newErrors.senderEmail = 'Format d\'email invalide'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      await contactService.sendMessage({
        listingId,
        ...formData,
        timestamp: new Date().toISOString()
      })
      
      toast.success('Votre message a été envoyé avec succès!')
      
      if (onClose) {
        onClose()
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nom complet"
          name="senderName"
          value={formData.senderName}
          onChange={handleChange}
          error={errors.senderName}
          required
          icon="User"
        />
        
        <Input
          label="Email"
          name="senderEmail"
          type="email"
          value={formData.senderEmail}
          onChange={handleChange}
          error={errors.senderEmail}
          required
          icon="Mail"
        />
      </div>
      
      <Input
        label="Téléphone (optionnel)"
        name="senderPhone"
        type="tel"
        value={formData.senderPhone}
        onChange={handleChange}
        icon="Phone"
      />
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`
            block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
            transition-colors duration-200 resize-vertical
            ${errors.message 
              ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
          `}
          placeholder="Votre message..."
        />
        {errors.message && (
          <p className="text-sm text-red-600 flex items-center mt-1">
            {errors.message}
          </p>
        )}
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          loading={loading}
          icon="Send"
          className="flex-1"
        >
          Envoyer le message
        </Button>
        
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
        )}
      </div>
    </form>
  )
}

export default ContactForm
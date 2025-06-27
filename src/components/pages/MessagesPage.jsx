import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import contactService from '@/services/api/contactService'

const MessagesPage = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)

  const loadMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await contactService.getAll()
      setMessages(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64 shimmer" />
            <div className="h-4 bg-gray-200 rounded w-48 shimmer" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 shimmer" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 shimmer" />
                </div>
              ))}
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
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 mx-auto">
              <ApperIcon name="AlertTriangle" className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={loadMessages} icon="RefreshCw">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Messages
          </h1>
          <p className="text-gray-600">
            {messages.length} message{messages.length !== 1 ? 's' : ''} reçu{messages.length !== 1 ? 's' : ''}
          </p>
        </div>

        {messages.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6 mx-auto">
              <ApperIcon name="MessageCircle" className="w-12 h-12 text-primary-600" />
            </div>
            
            <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
              Aucun message
            </h3>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Vous n'avez pas encore reçu de messages concernant vos annonces. Les acheteurs intéressés pourront vous contacter ici.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.location.href = '/'}
                icon="ArrowLeft"
                size="lg"
              >
                Retour à l'accueil
              </Button>
              
              <Button
                onClick={() => window.location.href = '/post-listing'}
                variant="outline"
                icon="Plus"
                size="lg"
              >
                Publier une annonce
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Messages List */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Messages List */}
            <div className="lg:col-span-1 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedMessage(message)}
                  className={`
                    bg-white rounded-lg shadow-card p-4 cursor-pointer transition-all duration-200
                    hover:shadow-card-hover
                    ${selectedMessage?.Id === message.Id ? 'ring-2 ring-primary-500' : ''}
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate flex-1">
                      {message.senderName}
                    </h3>
                    <Badge variant="primary" size="sm">
                      Nouveau
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {message.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {formatDistanceToNow(new Date(message.timestamp), { locale: fr, addSuffix: true })}
                    </span>
                    <ApperIcon name="ChevronRight" className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow-card p-6"
                >
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-display font-semibold text-gray-900">
                        {selectedMessage.senderName}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(selectedMessage.timestamp), { locale: fr, addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <ApperIcon name="Mail" className="w-4 h-4 mr-1" />
                        {selectedMessage.senderEmail}
                      </div>
                      {selectedMessage.senderPhone && (
                        <div className="flex items-center">
                          <ApperIcon name="Phone" className="w-4 h-4 mr-1" />
                          {selectedMessage.senderPhone}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none mb-6">
                    <p className="whitespace-pre-wrap text-gray-700">
                      {selectedMessage.message}
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      icon="Mail"
                      onClick={() => window.location.href = `mailto:${selectedMessage.senderEmail}`}
                    >
                      Répondre par email
                    </Button>
                    
                    {selectedMessage.senderPhone && (
                      <Button
                        variant="outline"
                        icon="Phone"
                        onClick={() => window.location.href = `tel:${selectedMessage.senderPhone}`}
                      >
                        Appeler
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-lg shadow-card p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <ApperIcon name="MessageCircle" className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sélectionnez un message
                  </h3>
                  <p className="text-gray-600">
                    Choisissez un message dans la liste pour l'afficher ici
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagesPage
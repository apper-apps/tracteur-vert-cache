import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "Aucun résultat trouvé",
  description = "Nous n'avons trouvé aucun élément correspondant à vos critères.",
  actionText = "Retour à l'accueil",
  actionLink = "/",
  icon = "Search",
  onAction
}) => {
  const handleAction = () => {
    if (onAction) {
      onAction()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-12 h-12 text-primary-600" />
      </div>
      
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          as={actionLink ? Link : 'button'}
          to={actionLink}
          onClick={onAction ? handleAction : undefined}
          icon="ArrowLeft"
          size="lg"
        >
          {actionText}
        </Button>
        
        <Button
          as={Link}
          to="/post-listing"
          variant="outline"
          icon="Plus"
          size="lg"
        >
          Publier une annonce
        </Button>
      </div>
    </motion.div>
  )
}

export default Empty
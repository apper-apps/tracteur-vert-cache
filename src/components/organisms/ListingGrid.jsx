import React from 'react'
import { motion } from 'framer-motion'
import ListingCard from '@/components/molecules/ListingCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const ListingGrid = ({ 
  listings, 
  loading, 
  error, 
  onRetry,
  emptyTitle = "Aucun tracteur trouvé",
  emptyDescription = "Aucun tracteur ne correspond à vos critères de recherche."
}) => {
  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={onRetry}
      />
    )
  }

  if (!listings || listings.length === 0) {
    return (
      <Empty
        title={emptyTitle}
        description={emptyDescription}
        actionText="Voir tous les tracteurs"
        actionLink="/"
        icon="Tractor"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing, index) => (
<motion.div
          key={listing.Id || listing.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
        >
          <ListingCard listing={listing} />
        </motion.div>
      ))}
    </div>
  )
}

export default ListingGrid
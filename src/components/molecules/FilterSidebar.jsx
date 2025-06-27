import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'

const FilterSidebar = ({ filters, onFiltersChange, onReset }) => {
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    price: true,
    year: true,
    condition: true,
    location: true
  })

  const brands = [
    { value: '', label: 'Toutes les marques' },
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
    { value: '', label: 'Tous les états' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'très bon', label: 'Très bon' },
    { value: 'bon', label: 'Bon' },
    { value: 'acceptable', label: 'Acceptable' }
  ]

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ApperIcon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4 text-gray-500" 
        />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-card">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-gray-900">
            Filtres
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            icon="RotateCcw"
          >
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Filter Sections */}
      <div className="divide-y divide-gray-200">
        <FilterSection
          title="Marque"
          isExpanded={expandedSections.brand}
          onToggle={() => toggleSection('brand')}
        >
          <Select
            value={filters.brandFilter || ''}
            onChange={(e) => handleFilterChange('brandFilter', e.target.value)}
            options={brands}
          />
        </FilterSection>

        <FilterSection
          title="Prix"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-3">
            <Input
              type="number"
              placeholder="Prix minimum"
              value={filters.priceMin || ''}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              icon="Euro"
            />
            <Input
              type="number"
              placeholder="Prix maximum"
              value={filters.priceMax || ''}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              icon="Euro"
            />
          </div>
        </FilterSection>

        <FilterSection
          title="Année"
          isExpanded={expandedSections.year}
          onToggle={() => toggleSection('year')}
        >
          <div className="space-y-3">
            <Input
              type="number"
              placeholder="Année minimum"
              value={filters.yearMin || ''}
              onChange={(e) => handleFilterChange('yearMin', e.target.value)}
              icon="Calendar"
            />
            <Input
              type="number"
              placeholder="Année maximum"
              value={filters.yearMax || ''}
              onChange={(e) => handleFilterChange('yearMax', e.target.value)}
              icon="Calendar"
            />
          </div>
        </FilterSection>

        <FilterSection
          title="État"
          isExpanded={expandedSections.condition}
          onToggle={() => toggleSection('condition')}
        >
          <Select
            value={filters.condition || ''}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            options={conditions}
          />
        </FilterSection>

        <FilterSection
          title="Localisation"
          isExpanded={expandedSections.location}
          onToggle={() => toggleSection('location')}
        >
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Ville ou code postal"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              icon="MapPin"
            />
            <Select
              value={filters.radius || ''}
              onChange={(e) => handleFilterChange('radius', e.target.value)}
              options={[
                { value: '', label: 'Rayon de recherche' },
                { value: '10', label: 'Dans un rayon de 10 km' },
                { value: '25', label: 'Dans un rayon de 25 km' },
                { value: '50', label: 'Dans un rayon de 50 km' },
                { value: '100', label: 'Dans un rayon de 100 km' }
              ]}
            />
          </div>
        </FilterSection>
      </div>
    </div>
  )
}

export default FilterSidebar
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterSidebar from '@/components/molecules/FilterSidebar'
import ListingGrid from '@/components/organisms/ListingGrid'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import listingService from '@/services/api/listingService'

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState({
    keywords: searchParams.get('q') || '',
    brandFilter: searchParams.get('brand') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    yearMin: searchParams.get('yearMin') || '',
    yearMax: searchParams.get('yearMax') || '',
    location: searchParams.get('location') || '',
    radius: searchParams.get('radius') || '',
    condition: searchParams.get('condition') || ''
  })

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent')

  const sortOptions = [
    { value: 'recent', label: 'Plus récentes' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'year-desc', label: 'Plus récentes (année)' },
    { value: 'year-asc', label: 'Plus anciennes (année)' }
  ]

  const loadListings = async () => {
    try {
      setLoading(true)
setError(null)
      const data = await listingService.search(filters)
      setListings(sortListings(data, sortBy))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sortListings = (data, sortOption) => {
    const sorted = [...data]
    
    switch (sortOption) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'year-desc':
        return sorted.sort((a, b) => b.year - a.year)
      case 'year-asc':
        return sorted.sort((a, b) => a.year - b.year)
      case 'recent':
      default:
        return sorted.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
    }
  }

  useEffect(() => {
    loadListings()
  }, [filters])

  useEffect(() => {
    if (listings.length > 0) {
      setListings(sortListings(listings, sortBy))
    }
  }, [sortBy])

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    
    // Update URL params
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key === 'keywords' ? 'q' : key, value)
      }
    })
    params.set('sort', sortBy)
    setSearchParams(params)
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    const params = new URLSearchParams(searchParams)
    params.set('sort', newSort)
    setSearchParams(params)
  }

  const resetFilters = () => {
    const emptyFilters = {
      keywords: '',
      brandFilter: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      location: '',
      radius: '',
      condition: ''
    }
    setFilters(emptyFilters)
    setSearchParams({})
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Recherche de tracteurs
              </h1>
              <p className="text-gray-600">
                {loading ? 'Recherche en cours...' : `${listings.length} tracteur${listings.length !== 1 ? 's' : ''} trouvé${listings.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                icon={showFilters ? "X" : "Filter"}
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
              
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Trier par:
                </span>
                <Select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  options={sortOptions}
                  className="w-48"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className={`lg:block lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={resetFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">
                    Filtres actifs ({activeFiltersCount})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    icon="X"
                  >
                    Tout effacer
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null
                    
                    const labels = {
                      keywords: 'Recherche',
                      brandFilter: 'Marque',
                      priceMin: 'Prix min',
                      priceMax: 'Prix max',
                      yearMin: 'Année min',
                      yearMax: 'Année max',
                      location: 'Lieu',
                      radius: 'Rayon',
                      condition: 'État'
                    }
                    
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                      >
                        {labels[key]}: {value}
                        <button
                          onClick={() => handleFiltersChange({ ...filters, [key]: '' })}
                          className="ml-1 hover:text-primary-900"
                        >
                          <ApperIcon name="X" className="w-3 h-3" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Results */}
            <ListingGrid
              listings={listings}
              loading={loading}
              error={error}
              onRetry={loadListings}
              emptyTitle="Aucun tracteur trouvé"
              emptyDescription="Aucun tracteur ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage
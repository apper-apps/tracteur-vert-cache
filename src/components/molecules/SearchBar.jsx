import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'

const SearchBar = ({ expanded = false, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const navigate = useNavigate()

  const priceRanges = [
    { value: '', label: 'Tous les prix' },
    { value: '0-1000', label: 'Moins de 1 000€' },
    { value: '1000-3000', label: '1 000€ - 3 000€' },
    { value: '3000-5000', label: '3 000€ - 5 000€' },
    { value: '5000-10000', label: '5 000€ - 10 000€' },
    { value: '10000+', label: 'Plus de 10 000€' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (searchQuery) params.set('q', searchQuery)
    if (location) params.set('location', location)
    if (priceRange) params.set('price', priceRange)
    
    if (onSearch) {
      onSearch({ searchQuery, location, priceRange })
    } else {
      navigate(`/search?${params.toString()}`)
    }
  }

  if (!expanded) {
    return (
      <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Rechercher un tracteur tondeuse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon="Search"
            iconPosition="left"
            className="w-full"
          />
          <Button
            type="submit"
            className="absolute right-2 top-2 px-3 py-1.5"
            size="sm"
          >
            Rechercher
          </Button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-card space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Mot-clés (marque, modèle...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon="Search"
        />
        
        <Input
          type="text"
          placeholder="Localisation"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          icon="MapPin"
        />
        
        <Select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          options={priceRanges}
          placeholder="Gamme de prix"
        />
      </div>
      
      <div className="flex justify-center">
        <Button type="submit" size="lg" icon="Search">
          Rechercher des tracteurs
        </Button>
      </div>
    </form>
  )
}

export default SearchBar
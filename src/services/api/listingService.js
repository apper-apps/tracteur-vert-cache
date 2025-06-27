import mockListings from '@/services/mockData/listings.json'

class ListingService {
  constructor() {
    this.listings = [...mockListings]
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.listings]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const listing = this.listings.find(item => item.Id === id)
    if (!listing) {
      throw new Error('Annonce non trouvée')
    }
    return { ...listing }
  }

  async search(filters) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    let results = [...this.listings]
    
    // Apply filters
    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase()
      results = results.filter(listing => 
        listing.title.toLowerCase().includes(keywords) ||
        listing.brand.toLowerCase().includes(keywords) ||
        listing.model.toLowerCase().includes(keywords) ||
        listing.description.toLowerCase().includes(keywords)
      )
    }
    
    if (filters.brandFilter) {
      results = results.filter(listing => 
        listing.brand.toLowerCase() === filters.brandFilter.toLowerCase()
      )
    }
    
    if (filters.priceMin) {
      results = results.filter(listing => listing.price >= parseInt(filters.priceMin))
    }
    
    if (filters.priceMax) {
      results = results.filter(listing => listing.price <= parseInt(filters.priceMax))
    }
    
    if (filters.yearMin) {
      results = results.filter(listing => listing.year >= parseInt(filters.yearMin))
    }
    
    if (filters.yearMax) {
      results = results.filter(listing => listing.year <= parseInt(filters.yearMax))
    }
    
    if (filters.condition) {
      results = results.filter(listing => 
        listing.condition.toLowerCase() === filters.condition.toLowerCase()
      )
    }
    
    if (filters.location) {
      results = results.filter(listing => 
        listing.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }
    
    return results
  }

  async create(listingData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Find highest existing Id and add 1
    const maxId = Math.max(...this.listings.map(item => item.Id), 0)
    const newListing = {
      ...listingData,
      Id: maxId + 1
    }
    
    this.listings.push(newListing)
    return { ...newListing }
  }

  async update(id, listingData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.listings.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Annonce non trouvée')
    }
    
    this.listings[index] = {
      ...this.listings[index],
      ...listingData
    }
    
    return { ...this.listings[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = this.listings.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Annonce non trouvée')
    }
    
    this.listings.splice(index, 1)
    return true
  }
}

export default new ListingService()
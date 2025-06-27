import brandsData from '@/services/mockData/brands.json'

class BrandService {
  constructor() {
    this.brands = [...brandsData]
    this.lastId = Math.max(...this.brands.map(b => b.Id), 0)
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get all brands
  async getAll() {
    await this.delay()
    return [...this.brands]
  }

  // Get brand by ID
  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID must be a positive integer')
    }
    
    await this.delay()
    const brand = this.brands.find(b => b.Id === id)
    if (!brand) {
      throw new Error(`Brand with ID ${id} not found`)
    }
    return { ...brand }
  }

  // Create new brand
  async create(brandData) {
    await this.delay()
    
    // Validate required fields
    if (!brandData.name || !brandData.country) {
      throw new Error('Name and country are required')
    }

    // Check if brand name already exists
    if (this.brands.some(b => b.name.toLowerCase() === brandData.name.toLowerCase())) {
      throw new Error('A brand with this name already exists')
    }

    // Generate new ID
    this.lastId += 1
    
    const newBrand = {
      Id: this.lastId,
      name: brandData.name,
      country: brandData.country,
      foundedYear: brandData.foundedYear || null,
      description: brandData.description || '',
      logoUrl: brandData.logoUrl || '',
      isActive: brandData.isActive !== undefined ? brandData.isActive : true,
      website: brandData.website || '',
      specialties: brandData.specialties || []
    }

    this.brands.push(newBrand)
    return { ...newBrand }
  }

  // Update existing brand
  async update(id, brandData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID must be a positive integer')
    }

    await this.delay()
    
    const index = this.brands.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error(`Brand with ID ${id} not found`)
    }

    // Validate required fields
    if (!brandData.name || !brandData.country) {
      throw new Error('Name and country are required')
    }

    // Check if brand name already exists (excluding current brand)
    if (this.brands.some(b => b.Id !== id && b.name.toLowerCase() === brandData.name.toLowerCase())) {
      throw new Error('A brand with this name already exists')
    }

    const updatedBrand = {
      ...this.brands[index],
      name: brandData.name,
      country: brandData.country,
      foundedYear: brandData.foundedYear || null,
      description: brandData.description || '',
      logoUrl: brandData.logoUrl || '',
      isActive: brandData.isActive !== undefined ? brandData.isActive : true,
      website: brandData.website || '',
      specialties: brandData.specialties || []
    }

    this.brands[index] = updatedBrand
    return { ...updatedBrand }
  }

  // Delete brand
  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID must be a positive integer')
    }

    await this.delay()
    
    const index = this.brands.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error(`Brand with ID ${id} not found`)
    }

    const deletedBrand = { ...this.brands[index] }
    this.brands.splice(index, 1)
    return deletedBrand
  }

  // Search brands
  async search(query) {
    await this.delay(200)
    
    if (!query || query.trim() === '') {
      return [...this.brands]
    }

    const searchTerm = query.toLowerCase().trim()
    return this.brands.filter(brand => 
      brand.name.toLowerCase().includes(searchTerm) ||
      brand.country.toLowerCase().includes(searchTerm) ||
      brand.description.toLowerCase().includes(searchTerm) ||
      brand.specialties.some(s => s.toLowerCase().includes(searchTerm))
    )
  }

  // Get brands by status
  async getByStatus(isActive) {
    await this.delay(200)
    return this.brands.filter(brand => brand.isActive === isActive)
  }
}

// Export singleton instance
const brandService = new BrandService()
export default brandService
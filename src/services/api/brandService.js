class BrandService {
  constructor() {
    // Initialize ApperClient
    this.initApperClient()
  }

  initApperClient() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  }

  // Get all brands
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "country" } },
          { field: { Name: "founded_year" } },
          { field: { Name: "description" } },
          { field: { Name: "logo_url" } },
          { field: { Name: "is_active" } },
          { field: { Name: "website" } },
          { field: { Name: "specialties" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      }

      const response = await this.apperClient.fetchRecords('brand', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching brands:", error)
      throw error
    }
  }

  // Get brand by ID
  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID must be a positive integer')
    }

    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "country" } },
          { field: { Name: "founded_year" } },
          { field: { Name: "description" } },
          { field: { Name: "logo_url" } },
          { field: { Name: "is_active" } },
          { field: { Name: "website" } },
          { field: { Name: "specialties" } }
        ]
      }

      const response = await this.apperClient.getRecordById('brand', id, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching brand with ID ${id}:`, error)
      throw error
    }
  }

  // Create new brand
  async create(brandData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: brandData.name || brandData.Name,
          Tags: brandData.tags || brandData.Tags || "",
          Owner: brandData.owner || brandData.Owner || null,
          country: brandData.country,
          founded_year: brandData.foundedYear || brandData.founded_year || null,
          description: brandData.description || "",
          logo_url: brandData.logoUrl || brandData.logo_url || "",
          is_active: brandData.isActive !== undefined ? brandData.isActive : (brandData.is_active !== undefined ? brandData.is_active : true),
          website: brandData.website || "",
          specialties: brandData.specialties || ""
        }]
      }

      const response = await this.apperClient.createRecord('brand', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create brand')
        }
        
        return successfulRecords[0].data
      }
    } catch (error) {
      console.error("Error creating brand:", error)
      throw error
    }
  }

  // Update existing brand
  async update(id, brandData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID must be a positive integer')
    }

    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: brandData.name || brandData.Name,
          Tags: brandData.tags || brandData.Tags || "",
          Owner: brandData.owner || brandData.Owner || null,
          country: brandData.country,
          founded_year: brandData.foundedYear || brandData.founded_year || null,
          description: brandData.description || "",
          logo_url: brandData.logoUrl || brandData.logo_url || "",
          is_active: brandData.isActive !== undefined ? brandData.isActive : (brandData.is_active !== undefined ? brandData.is_active : true),
          website: brandData.website || "",
          specialties: brandData.specialties || ""
        }]
      }

      const response = await this.apperClient.updateRecord('brand', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          throw new Error(failedUpdates[0].message || 'Failed to update brand')
        }
        
        return successfulUpdates[0].data
      }
    } catch (error) {
      console.error("Error updating brand:", error)
      throw error
    }
  }

  // Delete brand
  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID must be a positive integer')
    }

    try {
      const params = {
        RecordIds: [id]
      }

      const response = await this.apperClient.deleteRecord('brand', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          throw new Error(failedDeletions[0].message || 'Failed to delete brand')
        }
        
        return successfulDeletions.length > 0
      }
    } catch (error) {
      console.error("Error deleting brand:", error)
      throw error
    }
  }

  // Search brands
  async search(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "country" } },
          { field: { Name: "founded_year" } },
          { field: { Name: "description" } },
          { field: { Name: "logo_url" } },
          { field: { Name: "is_active" } },
          { field: { Name: "website" } },
          { field: { Name: "specialties" } }
        ],
        where: query ? [
          {
            FieldName: "Name",
            Operator: "Contains",
            Values: [query]
          }
        ] : [],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      }

      const response = await this.apperClient.fetchRecords('brand', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error searching brands:", error)
      throw error
    }
  }

  // Get brands by status
  async getByStatus(isActive) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "country" } },
          { field: { Name: "founded_year" } },
          { field: { Name: "description" } },
          { field: { Name: "logo_url" } },
          { field: { Name: "is_active" } },
          { field: { Name: "website" } },
          { field: { Name: "specialties" } }
        ],
        where: [
          {
            FieldName: "is_active",
            Operator: "ExactMatch",
            Values: [isActive]
          }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      }

      const response = await this.apperClient.fetchRecords('brand', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching brands by status:", error)
      throw error
    }
  }
}

// Export singleton instance
const brandService = new BrandService()
export default brandService
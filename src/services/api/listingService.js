class ListingService {
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

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "brand" } },
          { field: { Name: "model" } },
          { field: { Name: "year" } },
          { field: { Name: "price" } },
          { field: { Name: "condition" } },
          { field: { Name: "location" } },
          { field: { Name: "distance" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "engine_power" } },
          { field: { Name: "cutting_width" } },
          { field: { Name: "fuel_type" } },
          { field: { Name: "transmission" } },
          { field: { Name: "deck_type" } },
          { field: { Name: "wheel_drive" } },
          { field: { Name: "seller_name" } },
          { field: { Name: "seller_phone" } },
          { field: { Name: "seller_email" } },
          { field: { Name: "posted_date" } },
          { field: { Name: "featured" } }
        ],
        orderBy: [
          {
            fieldName: "posted_date",
            sorttype: "DESC"
          }
        ]
      }

      const response = await this.apperClient.fetchRecords('listing', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      // Transform database records to expected format
      return (response.data || []).map(record => ({
        Id: record.Id,
        title: record.title,
        brand: record.brand,
        model: record.model,
        year: record.year,
        price: record.price,
        condition: record.condition,
        location: record.location,
        distance: record.distance,
        images: record.images ? (Array.isArray(record.images) ? record.images : [record.images]) : [],
        description: record.description,
        specifications: {
          enginePower: record.engine_power,
          cuttingWidth: record.cutting_width,
          fuelType: record.fuel_type,
          transmission: record.transmission,
          deckType: record.deck_type,
          wheelDrive: record.wheel_drive
        },
        sellerContact: {
          name: record.seller_name,
          phone: record.seller_phone,
          email: record.seller_email
        },
        postedDate: record.posted_date,
        featured: record.featured
      }))
    } catch (error) {
      console.error("Error fetching listings:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "brand" } },
          { field: { Name: "model" } },
          { field: { Name: "year" } },
          { field: { Name: "price" } },
          { field: { Name: "condition" } },
          { field: { Name: "location" } },
          { field: { Name: "distance" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "engine_power" } },
          { field: { Name: "cutting_width" } },
          { field: { Name: "fuel_type" } },
          { field: { Name: "transmission" } },
          { field: { Name: "deck_type" } },
          { field: { Name: "wheel_drive" } },
          { field: { Name: "seller_name" } },
          { field: { Name: "seller_phone" } },
          { field: { Name: "seller_email" } },
          { field: { Name: "posted_date" } },
          { field: { Name: "featured" } }
        ]
      }

      const response = await this.apperClient.getRecordById('listing', id, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      const record = response.data
      if (!record) {
        throw new Error('Annonce non trouvée')
      }

      // Transform database record to expected format
      return {
        Id: record.Id,
        title: record.title,
        brand: record.brand,
        model: record.model,
        year: record.year,
        price: record.price,
        condition: record.condition,
        location: record.location,
        distance: record.distance,
        images: record.images ? (Array.isArray(record.images) ? record.images : [record.images]) : [],
        description: record.description,
        specifications: {
          enginePower: record.engine_power,
          cuttingWidth: record.cutting_width,
          fuelType: record.fuel_type,
          transmission: record.transmission,
          deckType: record.deck_type,
          wheelDrive: record.wheel_drive
        },
        sellerContact: {
          name: record.seller_name,
          phone: record.seller_phone,
          email: record.seller_email
        },
        postedDate: record.posted_date,
        featured: record.featured
      }
    } catch (error) {
      console.error(`Error fetching listing with ID ${id}:`, error)
      throw error
    }
  }

  async search(filters) {
    try {
      const whereConditions = []
      
      // Apply filters
      if (filters.keywords) {
        whereConditions.push({
          FieldName: "title",
          Operator: "Contains",
          Values: [filters.keywords]
        })
      }
      
      if (filters.brandFilter) {
        whereConditions.push({
          FieldName: "brand",
          Operator: "ExactMatch",
          Values: [filters.brandFilter]
        })
      }
      
      if (filters.priceMin) {
        whereConditions.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [parseInt(filters.priceMin)]
        })
      }
      
      if (filters.priceMax) {
        whereConditions.push({
          FieldName: "price",
          Operator: "LessThanOrEqualTo",
          Values: [parseInt(filters.priceMax)]
        })
      }
      
      if (filters.yearMin) {
        whereConditions.push({
          FieldName: "year",
          Operator: "GreaterThanOrEqualTo",
          Values: [parseInt(filters.yearMin)]
        })
      }
      
      if (filters.yearMax) {
        whereConditions.push({
          FieldName: "year",
          Operator: "LessThanOrEqualTo",
          Values: [parseInt(filters.yearMax)]
        })
      }
      
      if (filters.condition) {
        whereConditions.push({
          FieldName: "condition",
          Operator: "ExactMatch",
          Values: [filters.condition]
        })
      }
      
      if (filters.location) {
        whereConditions.push({
          FieldName: "location",
          Operator: "Contains",
          Values: [filters.location]
        })
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "brand" } },
          { field: { Name: "model" } },
          { field: { Name: "year" } },
          { field: { Name: "price" } },
          { field: { Name: "condition" } },
          { field: { Name: "location" } },
          { field: { Name: "distance" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "engine_power" } },
          { field: { Name: "cutting_width" } },
          { field: { Name: "fuel_type" } },
          { field: { Name: "transmission" } },
          { field: { Name: "deck_type" } },
          { field: { Name: "wheel_drive" } },
          { field: { Name: "seller_name" } },
          { field: { Name: "seller_phone" } },
          { field: { Name: "seller_email" } },
          { field: { Name: "posted_date" } },
          { field: { Name: "featured" } }
        ],
        where: whereConditions,
        orderBy: [
          {
            fieldName: "posted_date",
            sorttype: "DESC"
          }
        ]
      }

      const response = await this.apperClient.fetchRecords('listing', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      // Transform database records to expected format
      return (response.data || []).map(record => ({
        Id: record.Id,
        title: record.title,
        brand: record.brand,
        model: record.model,
        year: record.year,
        price: record.price,
        condition: record.condition,
        location: record.location,
        distance: record.distance,
        images: record.images ? (Array.isArray(record.images) ? record.images : [record.images]) : [],
        description: record.description,
        specifications: {
          enginePower: record.engine_power,
          cuttingWidth: record.cutting_width,
          fuelType: record.fuel_type,
          transmission: record.transmission,
          deckType: record.deck_type,
          wheelDrive: record.wheel_drive
        },
        sellerContact: {
          name: record.seller_name,
          phone: record.seller_phone,
          email: record.seller_email
        },
        postedDate: record.posted_date,
        featured: record.featured
      }))
    } catch (error) {
      console.error("Error searching listings:", error)
      throw error
    }
  }

  async create(listingData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: listingData.title,
          Tags: listingData.tags || "",
          Owner: listingData.owner || null,
          title: listingData.title,
          brand: listingData.brand,
          model: listingData.model,
          year: parseInt(listingData.year),
          price: parseFloat(listingData.price),
          condition: listingData.condition,
          location: listingData.location,
          distance: listingData.distance || 0,
          images: Array.isArray(listingData.images) ? listingData.images.join(',') : (listingData.images || ""),
          description: listingData.description || "",
          engine_power: listingData.specifications?.enginePower || listingData.enginePower || null,
          cutting_width: listingData.specifications?.cuttingWidth || listingData.cuttingWidth || null,
          fuel_type: listingData.specifications?.fuelType || listingData.fuelType || "",
          transmission: listingData.specifications?.transmission || listingData.transmission || "",
          deck_type: listingData.specifications?.deckType || listingData.deckType || "",
          wheel_drive: listingData.specifications?.wheelDrive || listingData.wheelDrive || "",
          seller_name: listingData.sellerContact?.name || listingData.sellerName || "",
          seller_phone: listingData.sellerContact?.phone || listingData.sellerPhone || "",
          seller_email: listingData.sellerContact?.email || listingData.sellerEmail || "",
          posted_date: listingData.postedDate || new Date().toISOString(),
          featured: listingData.featured || false
        }]
      }

      const response = await this.apperClient.createRecord('listing', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create listing')
        }
        
        const record = successfulRecords[0].data
        return {
          Id: record.Id,
          title: record.title,
          brand: record.brand,
          model: record.model,
          year: record.year,
          price: record.price,
          condition: record.condition,
          location: record.location,
          distance: record.distance,
          images: record.images ? record.images.split(',') : [],
          description: record.description,
          specifications: {
            enginePower: record.engine_power,
            cuttingWidth: record.cutting_width,
            fuelType: record.fuel_type,
            transmission: record.transmission,
            deckType: record.deck_type,
            wheelDrive: record.wheel_drive
          },
          sellerContact: {
            name: record.seller_name,
            phone: record.seller_phone,
            email: record.seller_email
          },
          postedDate: record.posted_date,
          featured: record.featured
        }
      }
    } catch (error) {
      console.error("Error creating listing:", error)
      throw error
    }
  }

  async update(id, listingData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: listingData.title || listingData.Name,
          Tags: listingData.tags || listingData.Tags || "",
          Owner: listingData.owner || listingData.Owner || null,
          title: listingData.title,
          brand: listingData.brand,
          model: listingData.model,
          year: parseInt(listingData.year),
          price: parseFloat(listingData.price),
          condition: listingData.condition,
          location: listingData.location,
          distance: listingData.distance || 0,
          images: Array.isArray(listingData.images) ? listingData.images.join(',') : (listingData.images || ""),
          description: listingData.description || "",
          engine_power: listingData.specifications?.enginePower || listingData.enginePower || null,
          cutting_width: listingData.specifications?.cuttingWidth || listingData.cuttingWidth || null,
          fuel_type: listingData.specifications?.fuelType || listingData.fuelType || "",
          transmission: listingData.specifications?.transmission || listingData.transmission || "",
          deck_type: listingData.specifications?.deckType || listingData.deckType || "",
          wheel_drive: listingData.specifications?.wheelDrive || listingData.wheelDrive || "",
          seller_name: listingData.sellerContact?.name || listingData.sellerName || "",
          seller_phone: listingData.sellerContact?.phone || listingData.sellerPhone || "",
          seller_email: listingData.sellerContact?.email || listingData.sellerEmail || "",
          posted_date: listingData.postedDate || new Date().toISOString(),
          featured: listingData.featured || false
        }]
      }

      const response = await this.apperClient.updateRecord('listing', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          throw new Error(failedUpdates[0].message || 'Failed to update listing')
        }
        
        const record = successfulUpdates[0].data
        return {
          Id: record.Id,
          title: record.title,
          brand: record.brand,
          model: record.model,
          year: record.year,
          price: record.price,
          condition: record.condition,
          location: record.location,
          distance: record.distance,
          images: record.images ? record.images.split(',') : [],
          description: record.description,
          specifications: {
            enginePower: record.engine_power,
            cuttingWidth: record.cutting_width,
            fuelType: record.fuel_type,
            transmission: record.transmission,
            deckType: record.deck_type,
            wheelDrive: record.wheel_drive
          },
          sellerContact: {
            name: record.seller_name,
            phone: record.seller_phone,
            email: record.seller_email
          },
          postedDate: record.posted_date,
          featured: record.featured
        }
      }
    } catch (error) {
      console.error("Error updating listing:", error)
      throw error
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      }

      const response = await this.apperClient.deleteRecord('listing', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          throw new Error(failedDeletions[0].message || 'Failed to delete listing')
        }
        
        return successfulDeletions.length > 0
      }
    } catch (error) {
      console.error("Error deleting listing:", error)
      throw error
    }
  }
}

export default new ListingService()
class ContactService {
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
          { field: { Name: "listing_id" } },
          { field: { Name: "sender_name" } },
          { field: { Name: "sender_email" } },
          { field: { Name: "sender_phone" } },
          { field: { Name: "message" } },
          { field: { Name: "timestamp" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      }

      const response = await this.apperClient.fetchRecords('message', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      // Transform database records to expected format
      return (response.data || []).map(record => ({
        Id: record.Id,
        listingId: record.listing_id,
        senderName: record.sender_name,
        senderEmail: record.sender_email,
        senderPhone: record.sender_phone,
        message: record.message,
        timestamp: record.timestamp
      }))
    } catch (error) {
      console.error("Error fetching messages:", error)
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
          { field: { Name: "listing_id" } },
          { field: { Name: "sender_name" } },
          { field: { Name: "sender_email" } },
          { field: { Name: "sender_phone" } },
          { field: { Name: "message" } },
          { field: { Name: "timestamp" } }
        ]
      }

      const response = await this.apperClient.getRecordById('message', id, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      const record = response.data
      if (!record) {
        throw new Error('Message non trouvé')
      }

      // Transform database record to expected format
      return {
        Id: record.Id,
        listingId: record.listing_id,
        senderName: record.sender_name,
        senderEmail: record.sender_email,
        senderPhone: record.sender_phone,
        message: record.message,
        timestamp: record.timestamp
      }
    } catch (error) {
      console.error(`Error fetching message with ID ${id}:`, error)
      throw error
    }
  }

  async sendMessage(messageData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: `Message from ${messageData.senderName}`,
          Tags: messageData.tags || "",
          Owner: messageData.owner || null,
          listing_id: parseInt(messageData.listingId),
          sender_name: messageData.senderName,
          sender_email: messageData.senderEmail,
          sender_phone: messageData.senderPhone || "",
          message: messageData.message,
          timestamp: messageData.timestamp || new Date().toISOString()
        }]
      }

      const response = await this.apperClient.createRecord('message', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to send message')
        }
        
        const record = successfulRecords[0].data
        return {
          Id: record.Id,
          listingId: record.listing_id,
          senderName: record.sender_name,
          senderEmail: record.sender_email,
          senderPhone: record.sender_phone,
          message: record.message,
          timestamp: record.timestamp
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      }

      const response = await this.apperClient.deleteRecord('message', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          throw new Error(failedDeletions[0].message || 'Failed to delete message')
        }
        
        return successfulDeletions.length > 0
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      throw error
    }
  }
}

export default new ContactService()
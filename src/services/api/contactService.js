import mockMessages from '@/services/mockData/messages.json'

class ContactService {
  constructor() {
    this.messages = [...mockMessages]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const message = this.messages.find(item => item.Id === id)
    if (!message) {
      throw new Error('Message non trouvé')
    }
    return { ...message }
  }

  async sendMessage(messageData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Find highest existing Id and add 1
    const maxId = Math.max(...this.messages.map(item => item.Id), 0)
    const newMessage = {
      ...messageData,
      Id: maxId + 1
    }
    
    this.messages.push(newMessage)
    return { ...newMessage }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = this.messages.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Message non trouvé')
    }
    
    this.messages.splice(index, 1)
    return true
  }
}

export default new ContactService()
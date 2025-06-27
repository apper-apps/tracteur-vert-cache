import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import brandService from '@/services/api/brandService'

const BrandManagementPage = () => {
  const [brands, setBrands] = useState([])
  const [filteredBrands, setFilteredBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    foundedYear: '',
    description: '',
    logoUrl: '',
    website: '',
    specialties: '',
    isActive: true
  })

  // Load brands
  const loadBrands = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await brandService.getAll()
      setBrands(data)
      setFilteredBrands(data)
    } catch (err) {
      setError(err.message)
      toast.error('Erreur lors du chargement des marques')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBrands()
  }, [])

  // Filter and sort brands
  useEffect(() => {
    let filtered = [...brands]

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(brand =>
        brand.name.toLowerCase().includes(search) ||
        brand.country.toLowerCase().includes(search) ||
        brand.description.toLowerCase().includes(search)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(brand => 
        statusFilter === 'active' ? brand.isActive : !brand.isActive
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'foundedYear') {
        aValue = aValue || 0
        bValue = bValue || 0
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredBrands(filtered)
  }, [brands, searchTerm, statusFilter, sortBy, sortOrder])

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      foundedYear: '',
      description: '',
      logoUrl: '',
      website: '',
      specialties: '',
      isActive: true
    })
  }

  // Handle add brand
  const handleAdd = () => {
    resetForm()
    setSelectedBrand(null)
    setShowAddModal(true)
  }

  // Handle edit brand
  const handleEdit = (brand) => {
    setFormData({
      name: brand.name,
      country: brand.country,
      foundedYear: brand.foundedYear || '',
      description: brand.description || '',
      logoUrl: brand.logoUrl || '',
      website: brand.website || '',
      specialties: Array.isArray(brand.specialties) ? brand.specialties.join(', ') : '',
      isActive: brand.isActive
    })
    setSelectedBrand(brand)
    setShowEditModal(true)
  }

  // Handle delete brand
  const handleDelete = (brand) => {
    setSelectedBrand(brand)
    setShowDeleteModal(true)
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setModalLoading(true)

    try {
      const submitData = {
        ...formData,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : null,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s)
      }

      if (selectedBrand) {
        await brandService.update(selectedBrand.Id, submitData)
        toast.success('Marque mise à jour avec succès')
        setShowEditModal(false)
      } else {
        await brandService.create(submitData)
        toast.success('Marque ajoutée avec succès')
        setShowAddModal(false)
      }

      await loadBrands()
      resetForm()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setModalLoading(false)
    }
  }

  // Confirm delete
  const confirmDelete = async () => {
    setModalLoading(true)

    try {
      await brandService.delete(selectedBrand.Id)
      toast.success('Marque supprimée avec succès')
      setShowDeleteModal(false)
      await loadBrands()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setModalLoading(false)
    }
  }

  // Toggle sort order
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadBrands} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Gestion des marques
        </h1>
        <p className="text-gray-600">
          Gérez les marques de tracteurs disponibles sur la plateforme
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-card p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom, pays ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="Search"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="inactive">Inactives</option>
            </Select>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
              }}
              className="w-full sm:w-48"
            >
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
              <option value="country-asc">Pays A-Z</option>
              <option value="country-desc">Pays Z-A</option>
              <option value="foundedYear-desc">Plus récent</option>
              <option value="foundedYear-asc">Plus ancien</option>
            </Select>
          </div>
          <Button
            onClick={handleAdd}
            icon="Plus"
            className="w-full sm:w-auto"
          >
            Ajouter une marque
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredBrands.length} marque{filteredBrands.length > 1 ? 's' : ''} trouvée{filteredBrands.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Brands Grid */}
      {filteredBrands.length === 0 ? (
        <Empty
          title="Aucune marque trouvée"
          description="Aucune marque ne correspond à vos critères de recherche."
          action={
            <Button onClick={() => { setSearchTerm(''); setStatusFilter('all') }} variant="outline">
              Réinitialiser les filtres
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <motion.div
              key={brand.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Building" className="w-6 h-6 text-primary-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-display font-semibold text-lg text-gray-900">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-gray-600">{brand.country}</p>
                  </div>
                </div>
                <Badge
                  variant={brand.isActive ? 'success' : 'secondary'}
                  size="sm"
                >
                  {brand.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                {brand.foundedYear && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Fondée en:</span> {brand.foundedYear}
                  </p>
                )}
                {brand.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {brand.description}
                  </p>
                )}
                {brand.specialties && brand.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {brand.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="outline" size="xs">
                        {specialty}
                      </Badge>
                    ))}
                    {brand.specialties.length > 3 && (
                      <Badge variant="outline" size="xs">
                        +{brand.specialties.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(brand)}
                  icon="Edit"
                  className="flex-1"
                >
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(brand)}
                  icon="Trash2"
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Supprimer
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-semibold text-gray-900">
                    {selectedBrand ? 'Modifier la marque' : 'Ajouter une marque'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      resetForm()
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nom de la marque *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Pays *"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Année de fondation"
                      type="number"
                      value={formData.foundedYear}
                      onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                    <Input
                      label="Site web"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <Input
                    label="URL du logo"
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://..."
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Description de la marque..."
                    />
                  </div>

                  <Input
                    label="Spécialités (séparées par des virgules)"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    placeholder="Tracteurs, Moissonneuses, Équipements forestiers"
                  />

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Marque active
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddModal(false)
                        setShowEditModal(false)
                        resetForm()
                      }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      loading={modalLoading}
                      className="flex-1"
                    >
                      {selectedBrand ? 'Mettre à jour' : 'Ajouter'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-gray-900">
                    Confirmer la suppression
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer la marque <strong>{selectedBrand?.name}</strong> ? 
                  Cette action est irréversible.
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    loading={modalLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BrandManagementPage
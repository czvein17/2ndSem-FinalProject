import http from './http'

export const getAllSuppliers = async () => {
  const suppliers = await http.get('/suppliers')
  return suppliers.data
}

export const createSupplier = async (supplier) => {
  const newSupplier = await http.post('/suppliers', supplier)
  return newSupplier.data
}

export const updateSupplier = async ({ id, newSupplier }) => {
  const updatedSupplier = await http.patch(`/suppliers/${id}`, newSupplier)
  return updatedSupplier.data
}

export const getSupplierById = async (id) => {
  const supplier = await http.get(`/suppliers/${id}`)
  return supplier.data
}

export const deleteSupplier = async (id) => {
  console.log(id)
  const deletedSupplier = await http.delete(`/suppliers/${id}`)
  return deletedSupplier.data
}

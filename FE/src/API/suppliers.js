import http from './http'

export const getAllSuppliers = async () => {
  const suppliers = await http.get('/suppliers')
  return suppliers.data
}

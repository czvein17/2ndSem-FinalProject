import http from './http'

export const recommendProduct = async (emotion) => {
  console.log(emotion)
  const mood = emotion.join(', ')
  const response = await http.post('/products', { mood })
  return response.data
}

export const createNewProduct = async (product) => {
  const formData = new FormData()
  formData.append('data', JSON.stringify(product))
  if (product.image) {
    formData.append('image', product.image)
  }

  const response = await http.post('/products/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  console.log(response.data)
  return response.data
}

export const updateProduct = async ({ id, newProduct }) => {
  console.log(newProduct)
  console.log('NEW PRODUCT ', newProduct)

  const formData = new FormData()
  formData.append('data', JSON.stringify(newProduct))
  if (newProduct.image) {
    formData.append('image', newProduct.image)
  }

  console.log('FORM DATA' + formData)

  const response = await http.patch(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  console.log(response.data)
  return response.data
}

export const getAllProducts = async (queryParams = {}) => {
  const coffees = await http.get('/products', { params: queryParams })
  console.log(coffees.data)
  return coffees.data
}

export const getProductById = async (id) => {
  const coffee = await http.get(`/products/${id}`)
  return coffee.data
}

export const deleteProduct = async (id) => {
  const response = await http.delete(`/products/${id}`)
  return response.data
}

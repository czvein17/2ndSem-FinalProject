import http from './http'

export const getAllIngredients = async () => {
  const ingredients = await http.get('/ingredients')
  return ingredients.data
}

export const createIngredient = async (ingredient) => {
  const formData = new FormData()

  formData.append('name', ingredient.name)
  formData.append('stock', ingredient.stock)
  formData.append('unit', ingredient.unit)
  formData.append('lowStockThreshold', ingredient.threshold)
  formData.append('supplier', ingredient.supplier)
  formData.append('image', ingredient.image)

  // Log FormData entries
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`)
  })

  const newIngredient = await http.post('/ingredients', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return newIngredient.data
}

export const getLowStockIngredients = async () => {
  const lowStockIngredients = await http.get('/ingredients/low-stock')
  return lowStockIngredients.data
}

export const getIngredientById = async (id) => {
  const ingredient = await http.get(`/ingredients/${id}`)
  return ingredient.data
}

export const notifySupplier = async (id) => {
  console.log(id)
  const response = await http.post(`/ingredients/notify-supplier/${id}`)
  return response.data
}

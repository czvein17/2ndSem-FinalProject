import http from './http'

export const getAllIngredients = async () => {
  const ingredients = await http.get('/ingredients')
  return ingredients.data
}

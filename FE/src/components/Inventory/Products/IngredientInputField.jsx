import React from 'react'
import { AddProductInputField } from './AddProductInputField'

export const IngredientInputField = ({
  index,
  ingredient,
  handleIngredientChange,
  handleRemoveIngredient,
  availableIngredients,
}) => {
  return (
    <div className='flex flex-col gap-2 py-2 '>
      <div className='flex gap-2'>
        <select
          name='ingredient'
          value={ingredient.ingredient}
          onChange={(e) => handleIngredientChange(index, e)}
          className='w-full font-medium bg-transparent outline-none'
        >
          <option value='' disabled>
            Select Ingredient
          </option>
          {availableIngredients.map((ing) => (
            <option key={ing._id} value={ing._id}>
              {ing.name}
            </option>
          ))}
        </select>
        <button
          type='button'
          onClick={() => handleRemoveIngredient(index)}
          className='text-red-500'
        >
          Remove
        </button>
      </div>
      <div className='flex gap-2'>
        <AddProductInputField
          label={'S :'}
          type='number'
          name='small'
          value={ingredient.quantity.small}
          onChange={(e) => handleIngredientChange(index, e)}
        />
        <AddProductInputField
          label={'M :'}
          type='number'
          name='medium'
          value={ingredient.quantity.medium}
          onChange={(e) => handleIngredientChange(index, e)}
        />
        <AddProductInputField
          label={'L :'}
          type='number'
          name='large'
          value={ingredient.quantity.large}
          onChange={(e) => handleIngredientChange(index, e)}
        />
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { LuSearch } from 'react-icons/lu'
import DEFAULTUSERIMAGE from '../../assets/images/default-user.svg'

import { useAuth } from '../../hooks/useAuth'
import { getAllProducts } from '../../API/product'

import { RecommendCoffee } from '../../components/User/RecommendCoffee'
import { CoffeeCard } from '../../components/User/CoffeeCard'
import { CartContainer } from '../../components/User/CartContainer'

export const UserHomePage = () => {
  console.log('USet Home Page Rendered')
  const { isLoggedIn, user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!searchParams.has('category')) {
      searchParams.set('category', 'all')
      setSearchParams(searchParams)
    }
  }, [searchParams, setSearchParams])
  console.log(searchParams.toString())

  const handleCategory = (category) => {
    searchParams.set('category', category)
    navigate(`/user?${searchParams.toString()}`)
  }

  const categoryParams = searchParams.get('category')
  const catergory = [
    { name: 'All', value: 'all' },
    { name: 'Recommend', value: 'recommend' },
    { name: 'Coffee', value: 'coffee' },
    { name: 'Tea', value: 'tea' },
    { name: 'Milk', value: 'milk' },
    { name: 'Juice', value: 'juice' },
  ]
  const queryParams = {
    category: categoryParams === 'all' ? null : categoryParams,
  }
  const { data: coffees } = useQuery({
    queryKey: ['coffees', queryParams],
    queryFn: () => getAllProducts(queryParams),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return (
    <section className='flex flex-col w-full h-full text-textBlack'>
      {/* header */}
      <div className='flex h-20 bg-white border-b-2'>
        <div className='w-full px-5 my-auto'>
          <div className='w-[300px] bg-secondBg py-2 px-3 flex items-center rounded-full gap-2 shadow-md'>
            <LuSearch size={24} />
            <input
              type='text'
              placeholder='Search'
              className='w-full text-sm font-medium bg-transparent border-none outline-none'
            />
          </div>
        </div>
        <div className='w-[500px] border-l-2 px-5 flex'>
          {!isLoggedIn ? (
            <button
              className='px-10 py-2 mx-auto my-auto text-white transition-all duration-150 ease-in-out border border-transparent rounded-full bg-orange hover:bg-transparent hover:border-orange hover:text-orange'
              onClick={() => navigate('/')}
            >
              Login
            </button>
          ) : (
            <div className='flex gap-2 m-auto'>
              <div className='w-10 h-10 '>
                <img
                  className='object-cover w-full h-full rounded-full'
                  src={user.googleProfilePic || DEFAULTUSERIMAGE}
                />
              </div>

              <div className='text-sm'>
                <p className='font-semibold'>
                  {user.firstName}{' '}
                  {user.middleName !== '' ? `${user.middleName.charAt(0)}.` : ''}{' '}
                  {user.lastName}
                </p>
                <p className='text-[#3b3b3b80] font-medium text-xs'>{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex h-full overflow-hidden border-b-2'>
        {/* PRODUCTS */}
        <div className='flex flex-col w-full h-full gap-2 px-3 py-5'>
          <div className='flex items-center flex-shrink-0 px-2 h-14 '>
            <ul className='flex gap-5'>
              {catergory.map((catergory, index) => (
                <li
                  key={index}
                  className={`px-8 py-2 text-sm font-medium transition-all duration-150 ease-in-out border rounded-full cursor-pointer  text-textBlack hover:bg-orange hover:border-orange hover:text-white 
                    ${
                      categoryParams === catergory.value
                        ? 'bg-orange border-orange text-white'
                        : 'border-[#3b3b3b80]'
                    }`}
                  onClick={() => handleCategory(catergory.value)}
                >
                  {catergory.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Coffees */}
          {categoryParams !== 'recommend' ? (
            <div className='grid gap-5 p-2 overflow-y-auto xl:grid-cols-2 2xl:grid-cols-3 custom-scrollbar auto-rows-min'>
              {coffees?.d?.map((coffee) => (
                <CoffeeCard key={coffee._id} coffee={coffee} />
              ))}
            </div>
          ) : (
            // Recommend Coffees Based on their mood
            <RecommendCoffee />
          )}
        </div>

        {/* CART */}
        <CartContainer />
      </div>
    </section>
  )
}

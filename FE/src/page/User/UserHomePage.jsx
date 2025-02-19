import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { LuSearch } from 'react-icons/lu'
import DEFAULTUSERIMAGE from '../../assets/images/default-user.svg'

import { useAuth } from '../../hooks/useAuth'
import { getAllProducts } from '../../API/product'

import { RecommendCoffee } from '../../components/User/RecommendCoffee'
import { CoffeeCard } from '../../components/User/CoffeeCard'
import { CartContainer } from '../../components/User/CartContainer'
import { PaymentModal } from '../../components/User/PaymentModal'
import { Success } from '../../components/Success'

export const UserHomePage = () => {
  console.log('USet Home Page Rendered')
  const { isLoggedIn, user } = useAuth()
  const [search, setSearch] = useState('')
  const [debounceSearch, setDebounceSearch] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const pathMatch = location.pathname.match(/^\/user\/[a-fA-F0-9]{24}$/)

  useEffect(() => {
    if (!searchParams.has('category')) {
      searchParams.set('category', 'all')
      const order = searchParams.get('order')
      if (order) {
        searchParams.delete('order')
        searchParams.set('order', order)
      }
      setSearchParams(searchParams)
    }
  }, [searchParams, setSearchParams])
  console.log(searchParams.toString())

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearch(search)
    }, 1000)

    return () => clearTimeout(handler)
  }, [search])

  const handleCategory = (category) => {
    searchParams.set('category', category)
    navigate(`/user?${searchParams.toString()}`)
  }

  const categoryParams = searchParams.get('category')
  const paymentStatus = searchParams.get('payment')
  const orderId = searchParams.get('order')

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
    searchBy: 'name',
    search: debounceSearch,
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
          <div
            className='w-[300px] bg-secondBg py-2 px-3 flex items-center rounded-full gap-2 '
            style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
          >
            <LuSearch size={24} />
            <input
              type='text'
              placeholder='Search'
              className='w-full text-sm font-medium bg-transparent border-none outline-none'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className='w-[400px] border-l-2 px-5 flex flex-shrink-0'>
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

      <div className='flex h-full max-w-full overflow-hidden border-b-2'>
        {/* PRODUCTS */}
        <div className='flex flex-col w-full h-full gap-2 px-3 py-5'>
          {/* THERE A PROBLEM HERE WHEN IT COME IN RESPONSIVENESS */}
          <div className='flex items-center flex-shrink-0 px-2 h-14'>
            <ul className='flex flex-wrap gap-5'>
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

          {coffees?.d?.length === 0 && categoryParams !== 'recommend' && (
            <h1 className='text-center text-lg font-medium text-[#3b3b3b80]'>
              No Coffee Found
            </h1>
          )}
        </div>

        {/* CART */}
        <CartContainer />
        <PaymentModal />
      </div>
    </section>
  )
}

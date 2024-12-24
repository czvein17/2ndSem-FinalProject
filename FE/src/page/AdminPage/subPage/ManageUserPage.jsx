/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllUsers } from '../../../API/userDataReq'
import { transformDate } from '../../../utils/transformDate'
import { formatFullname } from '../../../utils/formatFullname'

import { MdOutlineDeleteOutline } from 'react-icons/md'
import { IoIdCardOutline } from 'react-icons/io5'
import { FiEdit2, FiTable } from 'react-icons/fi'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'
import UserDefaulImg from '../../../assets/images/default-user.svg'

import Loading from '../../../components/Loading'
import UserCardContainer from '../../../components/Admin/UserCardContainer'

const AdminPage1 = () => {
  const [viewMode, setViewMode] = useState('cards')
  const [searchBy, setSearchBy] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (debouncedSearch.includes('@')) setSearchBy('email')
    else setSearchBy('fullname')
  }, [debouncedSearch])

  const queryParams = {
    searchBy: searchBy,
    search: debouncedSearch,
  }

  const {
    data: users,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => fetchAllUsers(queryParams),
    staleTime: 2000,
  })

  function handleViewModeChange() {
    setViewMode((prev) => (prev === 'tables' ? 'cards' : 'tables'))
  }

  return (
    <div className='h-full flex flex-col'>
      <div className='h-20 '>
        <div className='h-20 flex justify-between '>
          <div className='w-full py-5'>
            <div className='flex lg:w-[300px] bg-secondary rounded-xl gap-2 py-2 px-4 shadow-md'>
              <IoSearch size={24} />
              <input
                type='text'
                placeholder='Search'
                className='indent-1 outline-none w-full bg-transparent'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className='md:w-full flex gap-1 md:gap-3 p-5 justify-end'>
            {viewMode === 'tables' && (
              <button className='border-2 border-secondary py-1 px-2 md:py-2 md:px-5 rounded-lg shadow-md flex gap-2 justify-center items-center hover:bg-secondary transition-all ease-in-out'>
                <span className='text-accent'>
                  <IoIosAddCircleOutline size={24} />
                </span>
                <span className='hidden md:flex'>Add User</span>
              </button>
            )}
            <button
              className='border-2 border-secondary py-1 px-2 md:py-2 md:px-5 rounded-lg shadow-md hover:bg-secondary transition-all ease-in-out'
              onClick={handleViewModeChange}
            >
              <p className='flex gap-2 justify-center items-center  text-sm'>
                {viewMode === 'tables' ? (
                  <span className='text-accent'>
                    <FiTable size={24} />
                  </span>
                ) : (
                  <span className='text-accent'>
                    <IoIdCardOutline size={24} />
                  </span>
                )}
                <span className='hidden md:flex'>View As</span>
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* USER DISPLAY */}
      <UserCardContainer data={users?.data || []} />
    </div>
  )
}

const UserTableRow = ({ user, index }) => {
  const cellClass = `border-b border-gray-300 px-2 py-2 text-sm ${
    index % 2 === 0 ? 'bg-white' : 'bg-secondary'
  }`

  return (
    <tr className='hover:bg-secondary'>
      <td className={`${cellClass} w-1/5 text-center`}>{user._id}</td>
      <td className={`${cellClass} `}>
        <div className='flex gap-4 items-center w-[200px]'>
          <img
            className='h-7 w-7 object-cover rounded-full'
            src={user.googleProfilePic || UserDefaulImg}
            alt={user.firstName}
          />
          {formatFullname(user.fullname)}
        </div>
      </td>
      <td className={`${cellClass}`}>{user.email}</td>
      <td className={`${cellClass} text-center align-middle`}>
        <p
          className={` w-28  px-5 text-center inline-block rounded-lg font-medium ${
            user.role === 'admin'
              ? 'bg-[#ff727220] text-[#ff7272] border-2 border-[#ff727210]'
              : 'bg-[#7bc44320] text-[#7bc443] border-2 border-[#7bc44310]'
          }`}
        >
          {user.role}
        </p>
      </td>
      <td className={`${cellClass} text-center w-[1000px]`}>
        {transformDate(user.createdAt)}
      </td>
      <td className={`${cellClass} `}>
        {/* Add any action buttons or links here */}
        <span className='flex gap-2 justify-center'>
          <button className=' hover:underline'>
            <FiEdit2 size={20} />
          </button>
          <button className='hover:underline text-red-600'>
            <MdOutlineDeleteOutline size={20} />
          </button>
        </span>
      </td>
    </tr>
  )
}

export default AdminPage1

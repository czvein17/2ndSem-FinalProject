import { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { fetchAllUsers } from '../../../API/userDataReq'

import { FiTable } from 'react-icons/fi'
import { IoIdCardOutline } from 'react-icons/io5'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'

import { Loading } from '../../../components/Loading'
import UserCardContainer from '../../../components/Admin/UserCardContainer'
import UserTables from '../../../components/Admin/UserTables'
import Pagination from '../../../components/Admin/Pagination'
import { useMemo } from 'react'

const AdminPage1 = () => {
  console.log('MANAGE USER PAGE RENDERING')
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('cards')
  const [searchBy, setSearchBy] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

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

  const queryParams = useMemo(() => {
    return {
      searchBy: searchBy,
      search: debouncedSearch,
      limit:
        currentPage === 1 && viewMode === 'cards' ? usersPerPage - 1 : usersPerPage,
      page: currentPage,
      sort: 'createdAt',
    }
  })

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

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  const handleViewModeChange = useCallback(() => {
    setViewMode((prev) => (prev === 'tables' ? 'cards' : 'tables'))
  }, [])

  // Calculate total pages dynamically
  const totalPages = useMemo(() => {
    return Math.ceil(users?.data.totalCount / usersPerPage)
  }, [users, usersPerPage])

  // Get current users
  const currentUsers = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    return users?.data?.users.slice(indexOfFirstUser, indexOfLastUser)
  }, [users, currentPage, usersPerPage])

  return (
    <div className='h-full flex flex-col '>
      <div className='h-20 '>
        <div className='h-20 flex justify-between gap-4'>
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
          <div className='md:w-full flex gap-1 md:gap-3 py-5 md:px-5 justify-end '>
            {viewMode === 'tables' && (
              <button
                className='border-2 border-secondary py-1 px-2 md:py-2 md:px-5 rounded-lg shadow-md flex gap-2 justify-center items-center hover:bg-secondary transition-all ease-in-out'
                onClick={() => navigate('/admin/manage-users/create')}
              >
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
                    <IoIdCardOutline size={24} />
                  </span>
                ) : (
                  <span className='text-accent'>
                    <FiTable size={24} />
                  </span>
                )}
                <span className='hidden md:flex'>View As</span>
              </p>
            </button>
          </div>
        </div>
      </div>
      {isError && <div>{error.message}</div>}
      {isPending && <Loading message={'Getting User'} />}
      {!isError && !isPending && (
        <>
          <div className='h-full overflow-hidden '>
            {viewMode === 'tables' ? (
              //  TABLE DISPLAY
              <UserTables users={users?.data?.users} />
            ) : (
              //  CARD DISPLAY
              <UserCardContainer
                currentPage={currentPage}
                data={users?.data?.users}
                search={debouncedSearch}
              />
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}

export default AdminPage1

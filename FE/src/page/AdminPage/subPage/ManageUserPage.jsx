/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { MdOutlineDeleteOutline } from 'react-icons/md'
import { IoIdCardOutline } from 'react-icons/io5'
import { FiEdit2, FiTable } from 'react-icons/fi'
import { CiViewTable } from 'react-icons/ci'

import { fetchAllUsers } from '../../../API/userDataReq'
import UserDefaulImg from '../../../assets/images/default-user.svg'
import Loading from '../../../components/Loading'
import UserCardContainer from '../../../components/Admin/UserCardContainer'
import { transformDate } from '../../../utils/transformDate'

const AdminPage1 = () => {
  const [viewMode, setViewMode] = useState('tables')
  const {
    data: users,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  })

  function handleViewModeChange() {
    setViewMode((prev) => (prev === 'tables' ? 'cards' : 'tables'))
  }

  return (
    <div className='h-full flex flex-col'>
      <div className='h-20 '>
        <div className='h-20 flex justify-between '>
          <div className='w-full bg-red-500'>1</div>
          <div className='w-full flex p-5 justify-end'>
            <button
              className='border-2 border-secondary py-2 px-5 rounded-lg shadow-md'
              onClick={handleViewModeChange}
            >
              {viewMode === 'tables' ? (
                <p className='flex gap-2 justify-center items-center  text-sm'>
                  <span className='text-accent'>
                    <FiTable size={20} />
                  </span>
                  View as
                </p>
              ) : (
                <p className='flex gap-2 justify-center items-center text-sm'>
                  <span className='text-accent'>
                    <IoIdCardOutline size={20} />
                  </span>
                  View as
                </p>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* USER DISPLAY */}
      <div className='flex-grow overflow-hidden m-5'>
        {isError && (
          <div>
            {error.status} Error: {error.message}
          </div>
        )}
        {isPending && <Loading message={'Getting All User '} />}
        {!isError && !isPending && (
          <div className='h-full'>
            {viewMode === 'cards' ? (
              <UserCardContainer data={users?.data || []} />
            ) : (
              <div className='overflow-x-auto bg-black h-full'>
                <table className='table-auto w-full border-collapse'>
                  <thead>
                    <tr>
                      <th className='bg-secondary text-sm text-accent px-2 py-2 first:rounded-tl-2xl'>
                        ID
                      </th>
                      <th className='bg-secondary text-sm text-accent px-2 py-2'>
                        Name
                      </th>
                      <th className='bg-secondary text-sm text-accent px-2 py-2'>
                        Email
                      </th>
                      <th className='bg-secondary text-sm text-accent px-2 py-2'>
                        Role
                      </th>
                      <th className='bg-secondary text-sm text-accent px-2 py-2'>
                        Created At
                      </th>
                      <th className='bg-secondary text-accent px-2 py-2 last:rounded-tr-2xl'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.data.map((user, index) => (
                      <UserTableRow key={user._id} user={user} index={index} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
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
        <div className='flex gap-4 w-full items-center '>
          <img
            className='h-7 w-7 object-cover rounded-full'
            src={user.googleProfilePic || UserDefaulImg}
            alt={user.firstName}
          />
          {user.firstName + ' ' + user.middleName + ' ' + user.lastName}
        </div>
      </td>
      <td className={`${cellClass}`}>{user.email}</td>
      <td className={`${cellClass} text-center`}>{user.role}</td>
      <td className={`${cellClass} text-center`}>{transformDate(user.createdAt)}</td>
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

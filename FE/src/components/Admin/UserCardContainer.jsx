import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { transformDate } from '../../utils/transformDate'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { TbUserEdit } from 'react-icons/tb'
import { TbUserMinus } from 'react-icons/tb'
import DefaultUserImage from '../../assets/images/default-user.svg'

import { deleteUser, updateUser } from '../../API/userDataReq'
import ModalWrapper from '../ModalWrapper'

const UserCardContainer = ({ ...users }) => {
  const editRef = useRef()
  const deleteRef = useRef()
  const [activeDropdown, setActiveDropdown] = useState(null)

  function toggleDropdown(userId) {
    setActiveDropdown((prevState) => (prevState === userId ? null : userId))
  }

  const {
    mutate: handleDeleteUser,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      deleteRef.current.closeModal()
      toast.dark.success('User deleted Succesfully')
      console.log(data)
    },
    onError: (data) => {
      deleteRef.current.closeModal()
      toast.error('Failed to delete user')
    },
  })

  const { mutate: handleUpdateUser } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      console.log(data)
      editRef.current.closeModal()
      toast.success('User updated successfully')
    },
    onError: (data) => {
      editRef.current.closeModal()
      toast.error('Failed to update user')
    },
  })

  return (
    <section className='h-full overflow-y-auto custom-scrollbar py-3 px-3'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6 '>
        <div className='rounded-xl bg-secondary shadow-lg h-[400px] p-5 flex flex-col gap-5 justify-center items-center transform transition-transform duration-300 hover:scale-105 hover:z-10 hover:cursor-pointer'>
          <span className='text-accent'>
            <IoIosAddCircleOutline size={60} />
          </span>
          <p className='font-bold text-xl'>Add User</p>
        </div>
        {users.data.map((user) => (
          <div
            key={user._id}
            className='rounded-xl bg-secondary shadow-lg h-[400px] p-5 relative'
          >
            <button
              className='absolute top-4 right-2'
              onClick={() => toggleDropdown(user._id)}
            >
              <HiOutlineDotsVertical size={20} />
            </button>
            {activeDropdown === user._id && (
              <div className='absolute top-10 right-4 w-32 bg-white shadow-md rounded'>
                <ul className='p-2 text-sm font-medium'>
                  <li
                    className='p-2 hover:bg-gray-200 flex justify-between items-center cursor-pointer'
                    onClick={() => editRef.current.openModal()}
                  >
                    <TbUserEdit size={25} />
                    <span className='w-full text-center'>Edit</span>
                  </li>
                  <li
                    className='p-2 hover:bg-gray-200 flex justify-between items-center cursor-pointer'
                    onClick={() => {
                      deleteRef.current.openModal()
                    }}
                  >
                    <TbUserMinus size={25} />
                    <span className='w-full text-center'>delete</span>
                  </li>
                </ul>

                <ModalWrapper ref={editRef}>
                  <div className='w-[400px] h-[400px]'>
                    Edit To
                    <div></div>
                    <div className='flex gap-3'>
                      <button
                        className='bg-secondary py-2 px-5 rounded-md font-medium'
                        onClick={() => editRef.current.closeModal()}
                      >
                        Cancel
                      </button>
                      <button
                        className='bg-accent py-2 px-5 rounded-md text-white font-medium'
                        onClick={() => handleUpdateUser(user._id)}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </ModalWrapper>

                <ModalWrapper ref={deleteRef}>
                  <div className='w-[300px] flex flex-col gap-5 items-center justify-center '>
                    <p className='text-center text-lg  w-[80%]'>
                      Are you sure you want to delete{' '}
                      <span className='font-medium'>
                        {user.firstName} {user.middleName} {user.lastName}
                      </span>
                    </p>

                    <div className='flex gap-3'>
                      <button
                        className='bg-secondary py-2 px-5 rounded-md font-medium'
                        onClick={() => deleteRef.current.closeModal()}
                      >
                        Cancel
                      </button>
                      <button
                        className='bg-accent py-2 px-5 rounded-md text-white font-medium'
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </ModalWrapper>
              </div>
            )}
            <div className='flex flex-col gap-2 items-center justify-center rounded-full p-5'>
              <img
                className='rounded-full object-cover h-20 w-20'
                src={user.googleProfilePic || DefaultUserImage}
                alt='avatar'
              />

              <h1 className='font-medium text-center text-xl'>
                {`${user.firstName} ${user.middleName} ${user.lastName}`}
              </h1>
              <p
                className={`py-1 px-5 rounded-md font-medium ${
                  user.role === 'admin'
                    ? 'bg-[#ff727220] text-[#ff7272]'
                    : 'bg-[#7bc44320] text-[#7bc443]'
                }`}
              >
                {user.role}
              </p>
            </div>

            <div className='pt-10'>
              <p className='text-wrap'>{user.email}</p>
              <p>{transformDate(user.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default UserCardContainer

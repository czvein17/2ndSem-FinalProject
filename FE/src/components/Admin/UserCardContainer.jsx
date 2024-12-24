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

  // console.log(users?.data?.map((user) => user._id))

  return (
    <section className='h-full overflow-y-auto custom-scrollbar bg-blue-500'>
      <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
        {users?.data.map((user) => (
          <div
            key={user._id}
            className='w-full relative bg-secondary rounded-xl h-[450px] lg:h-[350px] shadow-lg flex flex-col'
          >
            <button
              className='absolute top-2 right-2'
              onClick={() => toggleDropdown(user._id)}
            >
              <HiOutlineDotsVertical size={24} />
            </button>

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

            {activeDropdown === user._id && (
              <div className='absolute top-10 right-4 w-32 bg-white shadow-md rounded-xl'>
                <ul className='p-2 text-sm font-medium'>
                  <li
                    className='p-2 hover:bg-gray-200 rounded-lg flex justify-between items-center cursor-pointer'
                    onClick={() => editRef.current.openModal()}
                  >
                    <TbUserEdit size={25} />
                    <span className='w-full text-center'>Edit</span>
                  </li>
                  <li
                    className='p-2 hover:bg-gray-200 rounded-lg flex justify-between items-center cursor-pointer'
                    onClick={() => {
                      deleteRef.current.openModal()
                    }}
                  >
                    <TbUserMinus size={25} />
                    <span className='w-full text-center'>delete</span>
                  </li>
                </ul>
              </div>
            )}

            <div className='h-full flex justify-center items-center flex-col p-5'>
              {console.log(user)}
              <img
                src={user.googleProfilePic || DefaultUserImage}
                alt='user'
                className='w-28 h-28 object-cover rounded-full'
              />

              <div className='flex flex-col justify-center items-center'>
                <h1 className='font-bold my-2'>
                  {user.firstName}{' '}
                  {user.middleName !== '' ? `${user.middleName.charAt(0)}.` : ''}{' '}
                  {user.lastName}
                </h1>
                <p
                  className={`rounded-md font-medium py-1 px-5 text-center
                    ${
                      user.role === 'admin'
                        ? 'bg-[#ff727220] text-[#ff7272]'
                        : 'bg-[#7bc44320] text-[#7bc443]'
                    }`}
                >
                  {user.role}
                </p>
              </div>
            </div>
            <div className='h-full px-4 w-full '>
              <p className='break-words'>{user.email}</p>
              <p className='break-words'>{transformDate(user.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const EditAndDeleteModal = () => {
  const editRef = useRef()
  const deleteRef = useRef()
  return (
    <>
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
    </>
  )
}

export default UserCardContainer

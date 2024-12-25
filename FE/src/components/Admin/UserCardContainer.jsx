import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { transformDate } from '../../utils/transformDate'
import { deleteUser, updateUser } from '../../API/userDataReq'

import DefaultUserImage from '../../assets/images/default-user.svg'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { TbUserEdit, TbUserMinus } from 'react-icons/tb'
import { IoPersonAddOutline } from 'react-icons/io5'

import ModalWrapper from '../ModalWrapper'
import DeleteModalContent from './DeleteModalContent'
import EditUserModalContent from './EditUserModalContent'
import { useNavigate } from 'react-router-dom'

const UserCardContainer = ({ ...users }) => {
  const navigate = useNavigate()
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
      toast.success('User deleted Succesfully')
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

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: 'easeOut',
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.1, ease: 'easeOut' } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.1, ease: 'easeIn' } },
  }

  return (
    <section className='h-full overflow-y-auto custom-scrollbar'>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      >
        <motion.div
          className='w-full relative bg-secondary rounded-xl h-[450px] lg:h-[350px] shadow-lg flex flex-col cursor-pointer'
          onClick={() => navigate('/admin/manage-users/create')}
          variants={cardVariants}
        >
          <button className='m-auto text-center'>
            <IoPersonAddOutline size={100} />
            <p className='font-medium text-2xl mt-5'>Add User</p>
          </button>
        </motion.div>
        {users?.data.map((user) => (
          <motion.div
            variants={cardVariants}
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
              <EditUserModalContent
                onClose={() => editRef.current.closeModal()}
                onUpdate={() => handleUpdateUser(user._id)}
                user={user}
              />
            </ModalWrapper>

            <ModalWrapper ref={deleteRef}>
              <DeleteModalContent
                onClose={() => deleteRef.current.closeModal()}
                onDelete={() => handleDeleteUser(user._id)}
                user={user}
              />
            </ModalWrapper>

            <AnimatePresence mode='wait'>
              {activeDropdown === user._id && (
                <motion.div
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  variants={dropdownVariants}
                  className='absolute top-10 right-4 w-32 bg-white shadow-md rounded-xl'
                >
                  <ul className='p-2 text-sm font-medium'>
                    <li
                      className='p-2 hover:bg-gray-200 rounded-lg flex justify-between items-center cursor-pointer transition-all ease-in-out'
                      onClick={() => editRef.current.openModal()}
                    >
                      <TbUserEdit size={25} />
                      <span className='w-full text-center'>Edit</span>
                    </li>
                    <li
                      className='p-2 hover:bg-gray-200 rounded-lg flex justify-between items-center cursor-pointer transition-all ease-in-out'
                      onClick={() => {
                        deleteRef.current.openModal()
                      }}
                    >
                      <TbUserMinus size={25} />
                      <span className='w-full text-center'>delete</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className='h-full flex justify-center items-center flex-col p-5'>
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
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default UserCardContainer

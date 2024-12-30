import React, { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { deleteUser, updateUser } from '../../API/userDataReq'

import DefaultUserImage from '../../assets/images/default-user.svg'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { TbUserEdit, TbUserMinus } from 'react-icons/tb'
import { transformDate } from '../../utils/transformDate'

import ModalWrapper from '../ModalWrapper'
import EditUserModalContent from './EditUserModalContent'
import DeleteModalContent from './DeleteModalContent'

const UserCards = React.memo(({ variants, user }) => {
  console.log('USER CARDS RENDERING')
  const [dropDown, setDropDown] = useState(null)
  const editRef = useRef()
  const deleteRef = useRef()

  const { mutate: handleDeleteUser } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      console.log(data)
      deleteRef.current.closeModal()
      toast.success('User deleted Succesfully')
    },
    onError: (data) => {
      console.log(data)
      deleteRef.current.closeModal()
      toast.error('Failed to delete user')
    },
  })

  const { mutate: handleUpdateUser } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      console.log(data)
      editRef.current.closeModal()
      console.log('close modal')
      toast.success('User updated successfully')
    },
    onError: (data) => {
      console.log(data)
      editRef.current.closeModal()
      toast.error('Failed to update user')
    },
  })

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.1, ease: 'easeOut' } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.1, ease: 'easeIn' } },
  }

  const DropDownToggle = (id) => setDropDown(dropDown === id ? null : id)

  function showModal(ref) {
    DropDownToggle(null)
    ref.current.openModal()
  }

  return (
    <motion.div
      variants={variants}
      className='w-full relative bg-secondary rounded-xl h-[450px] lg:h-[330px] shadow-lg flex flex-col'
      whileHover={{
        scale: 1.02,
        transition: { type: 'spring', stiffness: 200 },
      }}
    >
      <button
        className='absolute top-2 right-2'
        onClick={() => DropDownToggle(user._id)}
      >
        <HiOutlineDotsVertical size={24} />
      </button>

      <AnimatePresence mode='wait'>
        {dropDown === user._id && (
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
                onClick={() => showModal(editRef)}
              >
                <TbUserEdit size={25} />
                <span className='w-full text-center'>Edit</span>
              </li>
              <li
                className='p-2 hover:bg-gray-200 rounded-lg flex justify-between items-center cursor-pointer transition-all ease-in-out'
                onClick={() => showModal(deleteRef)}
              >
                <TbUserMinus size={25} />
                <span className='w-full text-center'>delete</span>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

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

      <div className='h-full flex justify-center items-center flex-col p-5'>
        <img
          src={user.googleProfilePic || DefaultUserImage}
          alt='user'
          className='w-20 h-20 object-cover rounded-full'
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
  )
})

export default UserCards

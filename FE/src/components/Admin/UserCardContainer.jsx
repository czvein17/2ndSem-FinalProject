import React, { useCallback, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { deleteUser, updateUser } from '../../API/userDataReq'
import { IoPersonAddOutline } from 'react-icons/io5'

import UserCards from './UserCards'

const UserCardContainer = React.memo(({ currentPage, ...users }) => {
  console.log('USER CARD CONTAINER RENDERING')

  const navigate = useNavigate()

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

  // Create an array with the "Add User" button as the first item
  const userItems =
    currentPage === 1
      ? [
          {
            _id: 'add-user',
            isAddUserButton: true,
          },
          ...users?.data,
        ]
      : users?.data

  return (
    <section className='h-full overflow-y-auto custom-scrollbar '>
      <motion.div
        key={currentPage}
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 p-2'
      >
        {/* {users?.data.map((user) => (
          <UserCards key={user._id} user={user} variants={cardVariants} />
        ))} */}
        {userItems.map((user) =>
          user.isAddUserButton ? (
            <motion.div
              key={user._id}
              className='w-full relative bg-secondary rounded-xl h-[450px] lg:h-[350px] shadow-lg flex flex-col cursor-pointer '
              onClick={() => navigate('/admin/manage-users/create')}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }} // Add scale-up effect on hover
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <button className='m-auto text-center'>
                <IoPersonAddOutline size={100} />
                <p className='font-medium text-2xl mt-5'>Add User</p>
              </button>
            </motion.div>
          ) : (
            <UserCards
              key={user._id}
              user={user}
              variants={cardVariants}
              style={{ zIndex: 50 }}
            />
          ),
        )}
      </motion.div>
    </section>
  )
})

export default UserCardContainer

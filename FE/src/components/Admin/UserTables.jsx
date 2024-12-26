import React, { useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteUser, updateUser } from '../../API/userDataReq'
import { transformDate } from '../../utils/transformDate'

import DefaultUserPic from '../../assets/images/default-user.svg'
import { FiEdit2 } from 'react-icons/fi'
import { MdOutlineDeleteOutline } from 'react-icons/md'

import ModalWrapper from '../ModalWrapper'
import DeleteModalContent from './DeleteModalContent'
import EditUserModalContent from './EditUserModalContent'

const UserTables = React.memo(({ users }) => {
  const editRef = useRef()
  const deleteRef = useRef()

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
      console.log('ERROR ' + data)
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

  const tableHeadClass = 'h-[50px] bg-secondary text-accent border-b-2 border-black'
  const tableRowClass = 'py-3 px-5 whitespace-nowrap'

  return (
    <div className='h-full w-full overflow-x-auto overflow-y-auto'>
      <table className='md:table-fixed lg:w-full'>
        <thead className={`${tableHeadClass} w-full sticky top-0 `}>
          <tr className=''>
            <th scope='col' className='first:rounded-tl-2xl'>
              ID
            </th>
            <th scope='col'>Name</th>
            <th scope='col'>Email</th>
            <th scope='col'>Role</th>
            <th scope='col'>Created At</th>
            <th scope='col' className='last:rounded-tr-2xl w-[200px]'>
              Action
            </th>
          </tr>
        </thead>
        <tbody className='text-sm'>
          {users?.map((user, index) => (
            <tr
              key={user._id}
              className={`${index % 2 === 0 ? 'bg-background' : 'bg-secondary'} border-b border-black`}
            >
              <td className={`${tableRowClass}`}>{user._id}</td>
              <td className={`${tableRowClass}`}>
                <div className='flex gap-2 items-center'>
                  <img
                    src={user.googleProfilePic || user.profilePic || DefaultUserPic}
                    alt='user profile pic'
                    className='h-7 w-7 rounded-full'
                  />
                  {`${user.firstName} 
                      ${
                        user.middleName !== ''
                          ? ` ${user.middleName.charAt(0)}.`
                          : ''
                      } 
                      ${user.lastName}`}
                </div>
              </td>
              <td className={`${tableRowClass}`}>{user.email}</td>
              <td className={`${tableRowClass} text-center`}>
                <p
                  className={`w-28 inline-block rounded-lg ${
                    user.role === 'admin'
                      ? 'bg-[#ff727220] text-[#ff7272] border-2 border-[#ff727210]'
                      : 'bg-[#7bc44320] text-[#7bc443] border-2 border-[#7bc44310]'
                  }`}
                >
                  {user.role}
                </p>
              </td>
              <td className={`${tableRowClass} text-center`}>
                {transformDate(user.createdAt)}
              </td>
              <td className={`${tableRowClass}  w-[300px] `}>
                <div className='flex gap-2 justify-center'>
                  <button
                    className=''
                    title='Edit'
                    onClick={() => editRef.current.openModal()}
                  >
                    <FiEdit2 size={24} />
                  </button>
                  <button
                    className='text-red-500'
                    title='Delete'
                    onClick={() => deleteRef.current.openModal()}
                  >
                    <MdOutlineDeleteOutline size={25} />
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default UserTables

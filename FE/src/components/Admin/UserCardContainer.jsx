import { IoIosAddCircleOutline } from 'react-icons/io'
import DefaultUserImage from '../../assets/images/default-user.svg'
import { transformDate } from '../../utils/transformDate'

const UserCardContainer = ({ ...users }) => {
  console.log(users.data.map((user) => user))
  const data = Array(6).fill('test') // Example data array with 10 items

  return (
    <section className='h-full overflow-y-auto custom-scrollbar py-3 px-3'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 '>
        <div className='rounded-xl bg-secondary shadow-lg h-[400px] p-5 flex flex-col gap-5 justify-center items-center transform transition-transform duration-300 hover:scale-105 hover:z-10 hover:cursor-pointer'>
          <span className='text-accent'>
            <IoIosAddCircleOutline size={60} />
          </span>
          <p className='font-bold text-xl'>Add User</p>
        </div>
        {users.data.map((user) => (
          <div
            key={user._id}
            className='rounded-xl bg-secondary shadow-lg h-[400px] p-5'
          >
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

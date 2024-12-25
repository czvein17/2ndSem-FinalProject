import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

export const CreateNewUser = () => {
  const navigate = useNavigate()

  return (
    <div className='py-5'>
      <div>
        <button
          className='py-2 px-3 bg-secondary rounded-md shadow-lg flex justify-center items-center gap-2'
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack />
          <span>Back</span>
        </button>
      </div>
      <h1>Create New User</h1>
    </div>
  )
}

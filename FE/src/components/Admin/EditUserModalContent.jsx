const EditUserModalContent = ({ onClose, onUpdate }) => {
  return (
    <div className=' md:w-[400px] h-[400px]'>
      Edit To
      <div></div>
      <div className='flex gap-3'>
        <button
          className='bg-secondary py-2 px-5 rounded-md font-medium'
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className='bg-accent py-2 px-5 rounded-md text-white font-medium'
          onClick={onUpdate}
        >
          Yes
        </button>
      </div>
    </div>
  )
}

export default EditUserModalContent

import { IoAddOutline } from 'react-icons/io5'
export const CoffeeCard = ({ coffee }) => {
  const sizes = ['small', 'medium', 'large']

  return (
    <div className='min-h-[300px] bg-white rounded-xl flex p-3 text-sm gap-3  shadow-md'>
      <div className='flex flex-col flex-shrink-0 w-40 gap-2'>
        <div className='flex h-full rounded-lg bg-secondBg'>
          <div className='w-32 h-32 m-auto'>
            <img
              src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/coffee-image/${coffee.image}`}
              className='object-contain w-full h-full rounded-lg'
              alt=''
            />
          </div>
        </div>
        <div className='flex items-center justify-center h-20 gap-2 '>
          <button className='flex items-center justify-center w-8 h-8 border-2 rounded-full'>
            <IoAddOutline size={24} />
          </button>

          <p>10</p>

          <button className='flex items-center justify-center w-8 h-8 border-2 rounded-full'>
            <IoAddOutline size={24} />
          </button>
        </div>
      </div>
      <div className='flex flex-col justify-between w-full gap-2 py-3'>
        <div>
          <h3 className='text-lg font-semibold'>
            {coffee.name} <span className='font-medium text-orange'>$ 10</span>
          </h3>

          <p className='text-sm font-medium  text-[#3b3b3b80]'>
            {coffee.description}
          </p>
        </div>

        <div className='flex flex-col w-full gap-2'>
          <div className='flex flex-wrap gap-2'>
            {sizes.map((size, index) => (
              <Label key={index} name='size' value={size} />
            ))}
          </div>

          <button className='w-full px-3 py-2 font-medium transition-all duration-150 ease-in-out border-2 rounded-full text-orange border-orange hover:bg-orange hover:text-white'>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

const Label = ({ name, value }) => {
  return (
    <label className='flex gap-10 cursor-pointer'>
      <input type='radio' name={name} value={value} className='hidden peer' />
      <span className='px-3 py-2 text-xs border border-gray-300 rounded-full peer-checked:bg-black peer-checked:text-white'>
        {value}
      </span>
    </label>
  )
}

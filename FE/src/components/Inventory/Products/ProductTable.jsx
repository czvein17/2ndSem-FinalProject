import { useEffect, useState, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useOutletContext } from 'react-router-dom'

import { IoFilterOutline } from 'react-icons/io5'
import { FaRegEye } from 'react-icons/fa'

import { getAllProducts } from '../../../API/product'
import { ModalWrapper } from '../../ModalWrapper'
import { AddProductModal } from './AddProductModal'

export const ProductTable = () => {
  const addNewProductRef = useRef()
  const { debounceSearch } = useOutletContext()
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const queryParams = useMemo(
    () => ({
      searchBy: 'name',
      search: debounceSearch,
      page: currentPage,
      limit: 6,
    }),
    [debounceSearch, currentPage],
  )

  const {
    data: coffees,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['coffees', queryParams],
    queryFn: () => getAllProducts(queryParams),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (coffees) {
      setTotalPages(coffees.p)
    }
  }, [coffees, setTotalPages])

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <>
      <div className='flex items-center justify-between flex-shrink-0 py-2 '>
        <h1 className='text-2xl font-medium '>Products</h1>

        <div className='flex items-center gap-2'>
          <button
            className='px-3 py-2 text-white transition-all duration-150 ease-in-out border rounded-lg border-orange bg-orange hover:bg-transparent hover:text-orange'
            onClick={() => addNewProductRef.current.openModal()}
          >
            Add Product
          </button>

          <button className='flex gap-2 px-3 py-2 transition-all duration-150 ease-in-out border rounded-lg text-orange border-orange hover:bg-orange hover:text-white'>
            <span>
              <IoFilterOutline size={24} />
            </span>
            Filters
          </button>

          <button className='flex gap-2 px-3 py-2 transition-all duration-150 ease-in-out border rounded-lg text-orange border-orange hover:bg-orange hover:text-white'>
            Download All
          </button>
        </div>
      </div>

      <ModalWrapper ref={addNewProductRef}>
        <AddProductModal />
      </ModalWrapper>

      <div className='h-full overflow-auto custom-scrollbar'>
        <table className='flex-shrink-0 table-fixed lg:w-full'>
          <thead className='h-[50px] w-full bg-orange text-white sticky top-0 border-b-2 rounded-xl border-b-black'>
            <tr>
              <th scope='col' className='font-medium first:rounded-tl-2xl'>
                Product ID
              </th>
              <th scope='col' className='font-medium'>
                Name
              </th>
              <th scope='col' className='font-medium'>
                Category
              </th>
              <th scope='col' className='font-medium'>
                Availability
              </th>
              <th scope='col' className='font-medium last:rounded-tr-2xl'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {coffees?.d?.map((coffee, index) => (
              <tr
                key={coffee._id}
                className={`${index % 2 === 0 ? 'bg-white' : ''} border-b border-b-orange`}
              >
                <td className='px-3 py-4 whitespace-nowrap'>{coffee._id}</td>
                <td className='px-3 py-4 text-center whitespace-nowrap'>
                  {coffee.name}
                </td>
                <td className='px-3 py-4 text-center whitespace-nowrap'>
                  {coffee.category}
                </td>
                <td className='px-3 py-4 text-center whitespace-nowrap'>
                  {coffee.availability}
                </td>
                <td className='flex px-4 whitespace-nowrap'>
                  <div className='mx-auto'>
                    <button
                      className='p-2'
                      title='View Product'
                      onClick={() => navigate(`/inventory/products/${coffee._id}`)}
                    >
                      <FaRegEye size={26} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          {isPending && (
            <tfoot className='h-14'>
              <tr>
                <td colSpan='5' className='text-center text-[#3b3b3b80] font-medium'>
                  Loading...
                </td>
              </tr>
            </tfoot>
          )}

          {coffees?.d?.length === 0 && (
            <tfoot className='h-14'>
              <tr>
                <td colSpan='5' className='text-center text-[#3b3b3b80] font-medium'>
                  No coffee found
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <footer className='flex items-center justify-between py-2 text-sm h-11'>
        <button
          className='px-3 py-1 font-light text-white rounded-lg bg-orange'
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <p>
          Page {currentPage} of {totalPages}
        </p>

        <button
          className='px-3 py-1 font-light text-white rounded-lg bg-orange'
          onClick={handleNextPage}
          // disabled={currentPage === totalPages}
        >
          Next
        </button>
      </footer>
    </>
  )
}

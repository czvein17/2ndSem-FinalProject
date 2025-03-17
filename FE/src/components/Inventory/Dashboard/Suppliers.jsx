import React, { useRef, useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { FaRegEye } from 'react-icons/fa'
import { LuTrash2 } from 'react-icons/lu'

import { ModalWrapper } from '../../ModalWrapper'
import { EditSupplierModal } from './EditSupplierModal'
import { ViewSupplierModal } from './ViewSupplierModal'
import { DeleteSupplierModal } from './DeleteSupplierModal'

export const Suppliers = ({ suppliers }) => {
  const editSupplierModalRef = useRef()
  const viewSupplierModalRef = useRef()
  const deleteSupplierModalRef = useRef()
  const [selectedSupplier, setSelectedSupplier] = useState(null)

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier)
    editSupplierModalRef.current.openModal()
  }

  const handleView = (supplier) => {
    setSelectedSupplier(supplier)
    viewSupplierModalRef.current.openModal()
  }

  const handleDelete = (supplier) => {
    setSelectedSupplier(supplier)
    deleteSupplierModalRef.current.openModal()
  }

  return (
    <div className='overflow-auto rounded-lg max-h-[500px]'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='sticky top-0 bg-orange'>
          <tr>
            <th
              scope='col'
              className='px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase'
            >
              Name
            </th>

            <th
              scope='col'
              className='px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase'
            >
              email
            </th>

            <th
              scope='col'
              className='px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase'
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className=''>
          {suppliers.map((supplier, index) => (
            <tr key={supplier._id} className='border-b border-orange'>
              <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                {supplier.name}
              </td>

              <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                {supplier.email}
              </td>

              {/* <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                {item.lowStockThreshold}{' '}
                <span className='uppercase'>{item.unit}</span>
              </td>
              <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                {item.stock} <span className='uppercase'>{item.unit}</span>
              </td> */}

              <td className='text-sm font-medium whitespace-nowrap '>
                <div className='flex items-center justify-center w-full h-full gap-2 text-orange'>
                  <button onClick={() => handleEdit(supplier)}>
                    <FiEdit2 size={24} />
                  </button>

                  <button onClick={() => handleView(supplier)}>
                    <FaRegEye size={24} />
                  </button>

                  <button onClick={() => handleDelete(supplier)}>
                    <LuTrash2 size={24} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalWrapper ref={editSupplierModalRef}>
        {selectedSupplier && (
          <EditSupplierModal
            defaultSupplier={selectedSupplier}
            closeModal={() => editSupplierModalRef.current.closeModal()}
          />
        )}
      </ModalWrapper>

      <ModalWrapper ref={viewSupplierModalRef}>
        {selectedSupplier && (
          <ViewSupplierModal
            supplier={selectedSupplier}
            closeModal={() => viewSupplierModalRef.current.closeModal()}
          />
        )}
      </ModalWrapper>

      <ModalWrapper ref={deleteSupplierModalRef}>
        {selectedSupplier && (
          <DeleteSupplierModal
            supplier={selectedSupplier}
            closeModal={() => deleteSupplierModalRef.current.closeModal()}
          />
        )}
      </ModalWrapper>
    </div>
  )
}

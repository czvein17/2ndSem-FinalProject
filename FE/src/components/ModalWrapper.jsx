import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react'
import { SlClose } from 'react-icons/sl'

import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const ModalWrapper = forwardRef(({ children }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef()

  useImperativeHandle(ref, () => ({
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
  }))

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    else document.removeEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className='fixed top-0 left-0 w-[100%] h-[100%] bg-[#00000020] flex justify-center items-center'>
      <div
        className='bg-white p-5 rounded-xl relative w-full md:w-auto mx-5'
        ref={modalRef}
      >
        <button
          className='absolute top-2 right-2 rounded-tr-xl '
          onClick={() => setIsOpen(false)}
        >
          <SlClose size={24} />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal'),
  )
})

ModalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ModalWrapper

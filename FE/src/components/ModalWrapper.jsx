import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
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
      setTimeout(() => setIsOpen(false), 100)
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

  const dropIn = {
    hidden: { opacity: 0, y: '-20%' },
    visible: {
      opacity: 1,
      y: '0',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  }

  return ReactDOM.createPortal(
    <AnimatePresence mode='wait'>
      {isOpen && (
        <div className='fixed top-0 left-0 w-[100%] h-[100%] bg-[#00000090] flex justify-center items-center'>
          <motion.div
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={dropIn}
            className='bg-white p-5 rounded-xl relative w-full md:w-auto mx-5 '
            ref={modalRef}
          >
            <button
              className='absolute top-2 right-2 rounded-tr-xl '
              onClick={() => setIsOpen(false)}
            >
              <SlClose size={24} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.getElementById('modal'),
  )
})

ModalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ModalWrapper

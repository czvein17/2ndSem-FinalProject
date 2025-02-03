import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IoCreateOutline } from 'react-icons/io5'
import { MdDeleteOutline } from 'react-icons/md'
import { FiSidebar } from 'react-icons/fi'
import { ModalWrapper } from '../../ModalWrapper'
import DeleteModalContent from '../DeleteModalContent'

export const History = React.memo(
  ({ chatHistory, showChat, createNew, deleteChat }) => {
    console.log('chatHistory Rendered')
    const deleteRef = useRef(null)
    const [toggleShow, setToggleShow] = useState(false)
    const [mobile, setMobile] = useState(false)

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768) setToggleShow(true)
        else {
          setToggleShow(false)
          setMobile(true)
        }
      }

      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    const createNewConversation = () => {
      createNew()
      if (mobile) setToggleShow(false)
    }

    const showChatHistory = (id) => {
      showChat(id)
      if (mobile) setToggleShow(false)
    }

    return (
      <>
        {!toggleShow && (
          <button
            className='absolute top-2 md:right-0 text-accent'
            title='Show History'
          >
            <FiSidebar size={24} onClick={() => setToggleShow(!toggleShow)} />
          </button>
        )}

        <AnimatePresence>
          {toggleShow && (
            <motion.div
              initial={{ x: mobile ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: mobile ? '-100%' : '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`fixed left-0 bottom-0 top-0 md:relative w-[300px] flex flex-col justify-center items-center bg-secondary p-5 rounded-xl`}
            >
              <button className='absolute top-3 right-3 md:left-3 text-accent'>
                <FiSidebar size={22} onClick={() => setToggleShow(!toggleShow)} />
              </button>
              <h1 className='p-2 text-xl font-meduim'>History</h1>

              <button
                className='flex items-center justify-center w-full gap-2 py-2 mb-2 text-sm text-white rounded-md bg-accent hover:cursor-pointer'
                onClick={createNewConversation}
              >
                <IoCreateOutline size={20} />
                Create New
              </button>
              <div className='flex-grow w-[300px] px-5 overflow-y-auto custom-scrollbar'>
                <ul className='overflow-y-auto text-sm'>
                  {chatHistory?.conversation?.map((chat, index) => (
                    <li
                      key={chat._id}
                      className='flex justify-between w-full my-2 text-white rounded-lg bg-accent'
                      style={{ width: '100%' }}
                    >
                      <button
                        type='button'
                        className='py-2 pl-2 overflow-hidden text-left whitespace-nowrap text-ellipsis'
                        onClick={() => showChatHistory(chat._id)}
                        title={chat.conversationTitle}
                      >
                        {chat.conversationTitle}
                      </button>
                      <button
                        type='button'
                        className='p-1 m-1 rounded-md hover:text-red-500 hover:bg-secondary'
                        onClick={() => deleteRef.current.openModal()}
                        title='Delete'
                      >
                        <MdDeleteOutline size={20} />
                      </button>

                      <ModalWrapper ref={deleteRef}>
                        <DeleteModalContent
                          message={chat.conversationTitle}
                          onClose={() => {
                            deleteRef.current.closeModal()
                          }}
                          onDelete={() => deleteChat(chat._id)}
                        />
                      </ModalWrapper>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  },
)

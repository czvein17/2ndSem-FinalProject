import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IoCreateOutline } from 'react-icons/io5'
import { MdDeleteOutline } from 'react-icons/md'
import { FiSidebar } from 'react-icons/fi'

export const History = React.memo(
  ({ chatHistory, showChat, createNew, deleteChat }) => {
    console.log('chatHistory Rendered')
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
              <h1 className='text-xl p-2 font-meduim'>History</h1>

              <button
                className='w-full py-2 bg-accent rounded-md mb-2 text-white text-sm flex justify-center items-center
                gap-2 hover:cursor-pointer'
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
                      className='w-full bg-accent rounded-lg my-2 text-white flex justify-between'
                      style={{ width: '100%' }}
                    >
                      <button
                        type='button'
                        className='text-left whitespace-nowrap overflow-hidden text-ellipsis py-2 pl-2'
                        onClick={() => showChatHistory(chat._id)}
                        title={chat.conversationTitle}
                      >
                        {chat.conversationTitle}
                      </button>
                      <button
                        type='button'
                        className='hover:text-red-500 hover:bg-secondary p-1 m-1 rounded-md'
                        onClick={() => deleteChat(chat._id)}
                        title='Delete'
                      >
                        <MdDeleteOutline size={20} />
                      </button>
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

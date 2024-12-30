import React from 'react'
import { IoCreateOutline } from 'react-icons/io5'
import { MdDeleteOutline } from 'react-icons/md'

export const History = React.memo(
  ({ chatHistory, showChat, createNew, deleteChat }) => {
    console.log('chatHistory Rendered')
    return (
      <div className='w-[300px] flex flex-col justify-center items-center bg-secondary p-3 rounded-xl'>
        <h1 className='text-xl p-2 font-meduim'>History</h1>

        <button
          className='w-full p-3 bg-accent rounded-md mb-2 text-white text-sm font-semibold flex justify-center items-center
                gap-2 hover:cursor-pointer'
          onClick={createNew}
        >
          <IoCreateOutline size={25} />
          Create New
        </button>
        <div className='flex-grow w-[300px] px-3 overflow-y-auto custom-scrollbar'>
          <ul className='overflow-y-auto w-full text-sm'>
            {chatHistory?.conversation?.map((chat, index) => (
              <li
                key={chat._id}
                className='w-full p-2 bg-accent rounded-lg my-2 text-white text-sm font-medium flex justify-between'
                style={{ width: '100%' }}
              >
                <button
                  className='text-left whitespace-nowrap overflow-hidden text-ellipsis'
                  onClick={() => showChat(chat._id)}
                >
                  {chat.conversationTitle}
                </button>
                <button
                  className='hover:text-red-500 hover:bg-secondary p-2 rounded-md'
                  onClick={() => deleteChat(chat._id)}
                  style={{ width: '40px' }} // Fixed width for delete button
                >
                  <MdDeleteOutline size={25} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  },
)

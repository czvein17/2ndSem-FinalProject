import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import Typewriter from 'typewriter-effect'

import { LuSend } from 'react-icons/lu'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { IoCreateOutline } from 'react-icons/io5'
import { MdDeleteOutline } from 'react-icons/md'

import UnderConstruction from '../../../assets/images/under-construction.svg'

import {
  sendChatToBot,
  getChatHistory,
  getConversationById,
  deleteConversationById,
} from '../../../API/chat'
import { queryClient } from '../../../API/http'

const AdminChatBot = () => {
  const [currentConversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const chatContainerRef = useRef(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: sendChatToBot,
    onSuccess: (data) => {
      const botMessage = {
        role: 'bot',
        content: data.message.choices[0].message.content,
        coversationId: data.conversationId,
      }
      setMessages((prevMessages) => [...prevMessages, botMessage])
      console.log(data.conversationId)
      setConversationId(data.conversationId)
      queryClient.invalidateQueries(['chatHistory'])
    },
    onError: (error) => console.error('Error fetching response from bot:', error),
  })

  // Fetch chat history
  const { data: chatHistory } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: getChatHistory,
    // staleTime: 1000 * 60 * 60,
    onError: (error) => console.error('Error fetching chat history:', error),
  })

  // Fetch conversation by ID and Update the messages state
  const { mutate: conversation } = useMutation({
    queryKey: ['conversation'],
    mutationFn: getConversationById,
    onSuccess: (data) => {
      console.log('Get Conversation by ID', data.conversation)
      setMessages(data.conversation.messages)
      setConversationId(data.conversation._id)
    },
    onError: (error) => console.error('Error fetching conversation:', error),
  })

  const { mutate: deleteConversation } = useMutation({
    mutationFn: deleteConversationById,
    onSuccess: (deletedConversationId) => {
      const trimmedDeletedId = deletedConversationId.id.trim()
      if (trimmedDeletedId === currentConversationId) createNewConversation()
      queryClient.invalidateQueries(['chatHistory', 'conversation'])
    },
  })
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSendingMessage) return
    if (!input.trim()) return

    const userMessage = {
      role: 'user',
      content: input,
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput('')

    console.log(currentConversationId)
    sendMessage({
      message: input,
      conversationId: currentConversationId,
    })
  }

  const showChatHistory = async (conversationId) => {
    setConversationId(conversationId)
    conversation(conversationId)
  }

  const createNewConversation = () => {
    setMessages([])
    setConversationId(null)
  }

  const handleDeleteConversation = async (conversationId) => {
    deleteConversation(conversationId)
  }

  // const formatMessageContent = (content) => {
  //   const lines = content.split('\n')
  //   return lines.map((line, index) => {
  //     if (line.startsWith('- **')) {
  //       return (
  //         <li key={index} className='list-disc ml-5'>
  //           <strong>{line.slice(4)}</strong>
  //         </li>
  //       )
  //     } else if (line.startsWith('- ')) {
  //       return (
  //         <li key={index} className='list-disc ml-5'>
  //           {line.slice(2)}
  //         </li>
  //       )
  //     } else if (line.startsWith('**') && line.endsWith('**')) {
  //       return (
  //         <p key={index} className='font-bold'>
  //           {line.slice(2, -2)}
  //         </p>
  //       )
  //     } else {
  //       return <p key={index}>{line}</p>
  //     }
  //   })
  // }

  const formatMessageContent = (content) => {
    const lines = content.split('\n')
    return lines.map((line, index) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className='text-xl font-bold mt-4'>
            {line.slice(4)}
          </h3>
        )
      } else if (line.startsWith('#### ')) {
        return (
          <h4 key={index} className='text-lg font-bold mt-3'>
            {line.slice(5)}
          </h4>
        )
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className='font-bold'>
            {line.slice(2, -2)}
          </p>
        )
      } else if (line.startsWith('- **')) {
        return (
          <li key={index} className='list-disc ml-5'>
            <strong>{line.slice(4)}</strong>
          </li>
        )
      } else if (line.startsWith('- ')) {
        return (
          <li key={index} className='list-disc ml-5'>
            {line.slice(2)}
          </li>
        )
      } else if (line.startsWith('1. ')) {
        return (
          <li key={index} className='list-decimal ml-5'>
            {line.slice(3)}
          </li>
        )
      } else {
        return <p key={index}>{line}</p>
      }
    })
  }

  return (
    <div className='flex  gap-3 w-full h-full'>
      <div className='h-full w-full flex flex-grow flex-col'>
        <div
          className='flex-grow  overflow-y-auto p-4 custom-scrollbar'
          ref={chatContainerRef}
        >
          {messages.length === 0 && (
            <div className='h-full flex flex-col justify-center items-center p-4  rounded-lg'>
              <img
                src={UnderConstruction}
                className='h-20 w-20 '
                alt='under-construction'
              />
              <h1 className='text-lg font-bold text-accent'>
                This is currently in beta testing
              </h1>
              <p className='text-sm text-center text-wrap w-[30%]'>
                Please note that this chatbot is currently under development. The
                responses might not be accurate or fully reliable. We appreciate your
                understanding and feedback.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={` flex ${
                message.role === 'user' ? ' justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-4 my-2  max-w-[90%] md:max-w-[70%] text-sm
                          ${
                            message.role === 'user'
                              ? 'bg-accent text-white rounded-s-2xl rounded-br-none rounded-tr-2xl'
                              : 'bg-[#EEEEEE] text-[#656565] rounded-e-2xl rounded-tl-2xl rounded-bl-none'
                          }`}
              >
                {message.role === 'bot' ? (
                  <Typewriter
                    options={{
                      autoStart: true,
                      loop: false,
                      delay: 10,
                    }}
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(message.content)
                        .callFunction(() => {
                          typewriter.stop()
                        })
                        .start()
                    }}
                  />
                ) : (
                  formatMessageContent(message.content)
                )}
              </div>
            </div>
          ))}
        </div>
        <div>
          <form
            onSubmit={handleSubmit}
            className='flex gap-5 bg-secondary py-2 px-4  rounded-xl justify-center items-center'
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Type your message...'
              className='w-full bg-transparent outline-none py-2 text-sm overflow-hidden resize-none '
            />
            <button type='submit' className='bg-accent p-3 rounded-lg'>
              <span className='text-white flex justify-center items-center gap-2'>
                {isSendingMessage ? (
                  <span className='text-white animate-spin'>
                    <AiOutlineLoading3Quarters size={20} />
                  </span>
                ) : (
                  <LuSend size={20} />
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

      <div className='w-[300px] flex flex-col justify-center items-center bg-secondary p-3 rounded-xl'>
        <h1 className='text-xl p-2 font-meduim'>History</h1>

        <button
          className='w-full p-3 bg-accent rounded-md mb-2 text-white text-sm font-semibold flex justify-center items-center
              gap-2 hover:cursor-pointer'
          onClick={createNewConversation}
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
                  onClick={() => showChatHistory(chat._id)}
                >
                  {chat.conversationTitle}
                </button>
                <button
                  className='hover:text-red-500 hover:bg-secondary p-2 rounded-md'
                  onClick={() => handleDeleteConversation(chat._id)}
                  style={{ width: '40px' }} // Fixed width for delete button
                >
                  <MdDeleteOutline size={25} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminChatBot

import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import Typewriter from 'typewriter-effect'

import { LuSend } from 'react-icons/lu'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import UnderConstruction from '../../../assets/images/under-construction.svg'

import {
  sendChatToBot,
  getChatHistory,
  getConversationById,
} from '../../../API/chat'
import { queryClient } from '../../../API/http'

const AdminChatBot = () => {
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: sendChatToBot,
    onSuccess: (data) => {
      const botMessage = {
        role: 'bot',
        content: data.message.choices[0].message.content,
        coversationId: data.conversationId,
      }
      setMessages((prevMessages) => [...prevMessages, botMessage])
      setConversationId(data.conversationId)
      queryClient.invalidateQueries(['chatHistory'])
    },
    onError: (error) => console.error('Error fetching response from bot:', error),
  })

  // Fetch chat history
  const { data: chatHistory } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: getChatHistory,
    staleTime: 1000 * 60 * 60,
    onSuccess: (data) => {
      console.log(data.conversation.map((chat) => chat.messages))
    },
    onError: (error) => console.error('Error fetching chat history:', error),
  })

  // Fetch conversation by ID and Update the messages state
  const { mutate: conversation } = useMutation({
    queryKey: ['conversation', conversationId],
    mutationFn: getConversationById,
    onSuccess: (data) => {
      console.log(data.conversation.messages)
      setMessages(data.conversation.messages)
    },
    onError: (error) => console.error('Error fetching conversation:', error),
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

    sendMessage({ message: input, conversationId })
  }

  const showChatHistory = async (conversationId) => {
    setConversationId(conversationId)
    conversation(conversationId)
  }

  const createNewConversation = () => {
    setMessages([])
    setConversationId(null)
  }

  const formatMessageContent = (content) => {
    const lines = content.split('\n')
    return lines.map((line, index) => {
      if (line.startsWith('- **')) {
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
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className='font-bold'>
            {line.slice(2, -2)}
          </p>
        )
      } else {
        return <p key={index}>{line}</p>
      }
    })
  }

  return (
    <div className='flex w-full h-full'>
      <div className='h-full w-full flex flex-grow flex-col'>
        <div className='flex-grow  overflow-y-auto p-4'>
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
                className={`p-2 my-2 rounded-lg max-w-[90%] md:max-w-[70%] text-sm
          ${message.role === 'user' ? 'bg-accent text-white' : 'bg-secondary'}`}
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
            className='flex gap-2 bg-secondary p-2 m-2 rounded-xl justify-center items-center'
          >
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Type your message...'
              className='w-full bg-transparent outline-none text-sm px-2'
            />
            <button type='submit' className='bg-accent py-2 px-3 rounded-lg'>
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

      <div className='w-[30%] flex flex-col justify-center items-center bg-secondary p-5 rounded-lg'>
        <h1>History</h1>
        <div className='flex-grow w-full'>
          <ul className='overflow-y-auto p-5'>
            <li
              className='p-2 bg-accent rounded-md my-2 text-white text-sm font-medium'
              onClick={createNewConversation}
            >
              Create a new conversation
            </li>
            {chatHistory?.conversation?.map((chat, index) => (
              <li
                key={index}
                className='p-2 bg-accent rounded-md my-2 text-white text-sm font-medium'
                onClick={() => {
                  showChatHistory(chat._id)
                }}
              >
                {chat.conversationTitle}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminChatBot
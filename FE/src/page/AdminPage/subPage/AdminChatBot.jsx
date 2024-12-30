import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import Typewriter from 'typewriter-effect'
import { marked } from 'marked'

import { LuSend } from 'react-icons/lu'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import UnderConstruction from '../../../assets/images/under-construction.svg'
import ChatBot from '../../../assets/images/chatbot.jpg'

import { useAuth } from '../../../hooks/useAuth'
import {
  sendChatToBot,
  getChatHistory,
  getConversationById,
  deleteConversationById,
} from '../../../API/chat'
import { queryClient } from '../../../API/http'

import { History } from '../../../components/Admin/Chatbot/History'

const AdminChatBot = () => {
  const { user } = useAuth()
  const [currentConversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const chatContainerRef = useRef(null)

  const userPhoto = user?.googleProfilePic || user?.profilePic

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Send message to bot
  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: sendChatToBot,
    onSuccess: (data) => {
      const botMessage = {
        role: 'assistant',
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
    refetchOnWindowFocus: false,
    onError: (error) => console.error('Error fetching chat history:', error),
  })

  // Fetch conversation by ID and Update the messages state
  const { mutate: showChatHistory } = useMutation({
    queryKey: ['conversation'],
    mutationFn: getConversationById,
    onSuccess: (data) => {
      // console.log('Get Conversation by ID', data.conversation)
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

  const createNewConversation = useCallback(() => {
    setMessages([])
    setConversationId(null)
  }, [])

  return (
    <div className='flex gap-3 w-full h-full py-5'>
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

          {/* {messages.map((message, index) => (
            <div
              key={index}
              className={` flex ${
                message.role === 'user' ? ' justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 my-2  max-w-[90%] md:max-w-[70%] text-sm
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
                  // formatMessageContent(message.content)
                  <div
                    className='message-content'
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(message.content),
                    }}
                  />
                )}
              </div>
            </div>
          ))} */}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 my-2 ${
                message.role === 'user'
                  ? 'justify-end flex-row-reverse '
                  : 'justify-start'
              }`}
            >
              <img
                src={`${message.role === 'user' ? userPhoto : ChatBot}`}
                alt='User Photo'
                className='w-8 h-8 rounded-full mt-auto'
              />
              <div
                className={`px-4 py-2  max-w-[90%] md:max-w-[70%] text-sm flex justify-center items-center 
                        ${
                          message.role === 'user'
                            ? 'bg-accent text-white rounded-s-2xl rounded-br-none rounded-tr-2xl ml-auto'
                            : 'bg-[#EEEEEE] text-[#656565] rounded-e-2xl rounded-tl-2xl rounded-bl-none'
                        }`}
              >
                {/* {console.log(message.role)} */}
                {message.role === 'assistant' ? (
                  <div
                    className={`message-content mx-auto my-auto flex flex-col`}
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(message.content),
                    }}
                  />
                ) : (
                  // User message is rendered as plain text (not parsed as HTML)
                  <div className='text-white'>{message.content.trim()}</div>
                )}
              </div>
            </div>
          ))}
        </div>

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

      <History
        chatHistory={chatHistory}
        createNew={createNewConversation}
        showChat={showChatHistory}
        deleteChat={deleteConversation}
      />
    </div>
  )
}

export default AdminChatBot

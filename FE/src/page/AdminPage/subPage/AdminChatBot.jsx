import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import Typewriter from 'typewriter-effect'

import UnderConstruction from '../../../assets/images/under-construction.svg'

import {
  sendChatToBot,
  getChatHistory,
  getConversationById,
  deleteConversationById,
} from '../../../API/chat'
import { queryClient } from '../../../API/http'

import { History } from '../../../components/Admin/Chatbot/History'
import { Messages } from '../../../components/Admin/Chatbot/Messages'
import { ChatInputForm } from '../../../components/Admin/Chatbot/ChatInputForm'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../../components/Loading'

const AdminChatBot = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentConversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const chatContainerRef = useRef(null)

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
      navigate(`/admin/chat/${data.conversationId}`)
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
  const { mutate: showChatHistory, isPending: isHistoryLoading } = useMutation({
    queryKey: ['conversation'],
    mutationFn: getConversationById,
    onSuccess: (data) => {
      setMessages(data.conversation.messages)
      setConversationId(data.conversation._id)
      navigate(`/admin/chat/${data.conversation._id}`)
    },
    onError: (error) => {
      navigate('/admin/chat')
      console.error('Error fetching conversation:', error)
    },
  })

  const { mutate: deleteConversation } = useMutation({
    mutationFn: deleteConversationById,
    onSuccess: (deletedConversationId) => {
      const trimmedDeletedId = deletedConversationId.id.trim()
      if (trimmedDeletedId === currentConversationId) createNewConversation()
      queryClient.invalidateQueries(['chatHistory', 'conversation'])
      navigate('/admin/chat')
    },
  })

  const handleSubmit = useCallback(
    async (e) => {
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
    },
    [input, sendMessage, currentConversationId, isSendingMessage],
  )

  const createNewConversation = useCallback(() => {
    navigate('/admin/chat')
    setMessages([])
    setConversationId(null)
  }, [navigate])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (id) showChatHistory(id)
  }, [id, showChatHistory])

  return (
    <div className='flex gap-3 w-full h-full py-5  flex-col-reverse md:flex-row relative overflow-x-hidden'>
      <div className='h-full w-full flex flex-grow flex-col'>
        <div
          className='flex-grow  overflow-y-auto py-4 custom-scrollbar'
          ref={chatContainerRef}
        >
          {isHistoryLoading && <Loading />}

          {!isHistoryLoading && messages.length === 0 && (
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

          <Messages messages={messages} />

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
        </div>

        <ChatInputForm
          handleSubmit={handleSubmit}
          value={input}
          setValue={setInput}
          isSending={isSendingMessage}
        />
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

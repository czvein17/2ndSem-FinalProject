import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import Typewriter from 'typewriter-effect'

import UnderConstruction from '../../../assets/images/under-construction.svg'

import { queryClient } from '../../../API/http'
import {
  sendChatToBot,
  getChatHistory,
  getConversationById,
  deleteConversationById,
} from '../../../API/chat'

import { History } from '../../../components/Admin/Chatbot/History'
import { Messages } from '../../../components/Admin/Chatbot/Messages'
import { ChatInputForm } from '../../../components/Admin/Chatbot/ChatInputForm'
import { Loading } from '../../../components/Loading'

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
      navigate(`/inventory/chat/${data.conversationId}`)
    },
    onError: (error) => console.error('Error fetching response from bot:', error),
  })

  // Fetch chat history
  const { data: chatHistory } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: getChatHistory,
    refetchOnWindowFocus: false,
    onSuccess: () => console.log('Chat history fetched successfully'),
    onError: (error) => console.error('Error fetching chat history:', error),
  })

  // Fetch conversation by ID and Update the messages state
  const { mutate: showChatHistory, isPending: isHistoryLoading } = useMutation({
    queryKey: ['conversation'],
    mutationFn: getConversationById,
    onSuccess: (data) => {
      setMessages(data.conversation.messages)
      setConversationId(data.conversation._id)
      navigate(`/inventory/chat/${data.conversation._id}`)
    },
    onError: (error) => {
      navigate('/inventory/chat')
      console.error('Error fetching conversation:', error)
    },
  })

  const { mutate: deleteConversation } = useMutation({
    mutationFn: deleteConversationById,
    onSuccess: (deletedConversationId) => {
      const trimmedDeletedId = deletedConversationId.id.trim()
      if (trimmedDeletedId === currentConversationId) createNewConversation()
      queryClient.invalidateQueries(['chatHistory', 'conversation'])
      navigate('/inventory/chat')
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
    navigate('/inventory/chat')
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
    <div className='relative flex flex-col-reverse w-full h-full gap-3 p-5 py-5 overflow-x-hidden md:flex-row'>
      <div className='flex flex-col flex-grow w-full h-full'>
        <div
          className='flex-grow py-4 overflow-y-auto custom-scrollbar'
          ref={chatContainerRef}
        >
          {isHistoryLoading && <Loading />}

          {!isHistoryLoading && messages.length === 0 && (
            <div className='flex flex-col items-center justify-center h-full p-4 space-y-4 rounded-lg'>
              <img
                src={UnderConstruction}
                className='h-28 w-28 '
                alt='under-construction'
              />
              <h1 className='text-lg font-bold uppercase text-orange'>
                This is currently in development phase
              </h1>
              <p className='text-sm text-center text-wrap w-[30%] font-medium text-gray-500'>
                This chatbot is currently in development. While it aims to assist
                with POS-related inquiries, responses may occasionally be inaccurate
                or inconsistent. We appreciate your patience and feedback as we work
                to enhance its accuracy and reliability.
              </p>
            </div>
          )}

          <Messages messages={messages} />
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

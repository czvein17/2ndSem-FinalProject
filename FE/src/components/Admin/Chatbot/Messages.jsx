import React, { memo, useEffect } from 'react'
import { marked } from 'marked'
import { useAuth } from '../../../hooks/useAuth'
import ChatBot from '../../../assets/images/chatbot.jpg'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' //

export const Messages = memo(({ messages }) => {
  console.log('Messages Rendered')
  const { user } = useAuth()
  const userPhoto = user?.googleProfilePic || user?.profilePic

  useEffect(() => {
    // Highlight the code after the component mounts and the content is rendered
    const codeBlocks = document.querySelectorAll('pre code')
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block)
    })
    console.log(messages.content)
  }, [messages])

  return (
    <>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex gap-2 my-3 ${
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
            className={`px-4 py-2 max-w-[80%] md:max-w-[60%] text-sm flex justify-center items-center 
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
                  __html: marked(message.content),
                }}
              />
            ) : (
              // User message is rendered as plain text (not parsed as HTML)
              <div className='text-white'>{message.content.trim()}</div>
            )}
          </div>
        </div>
      ))}
    </>
  )
})

import React, { memo, useEffect } from 'react'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

import { useAuth } from '../../../hooks/useAuth'
import ChatBot from '../../../assets/images/chatbot.jpg'

marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
})

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
            className='w-8 h-8 mt-auto rounded-full '
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
                className='flex flex-col mx-auto my-auto message-content'
                dangerouslySetInnerHTML={{
                  __html: marked(message.content),
                }}
              />
            ) : (
              // User message is rendered as plain text (not parsed as HTML)
              <div className='text-white'>{message.content.trim()}</div>
            )}
          </div>
          <div className='flex items-center gap-4 text-red-100 bg-red-500'></div>
        </div>
      ))}
    </>
  )
})

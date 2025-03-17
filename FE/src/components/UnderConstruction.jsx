import React from 'react'
import CUP_OF_CHI from '../assets/images/logo.svg'

export const UnderConstruction = () => {
  return (
    <div className='relative flex flex-col items-center justify-center w-full h-full space-y-4'>
      <img src={CUP_OF_CHI} className='w-[800px]' />
      <h1 className='text-3xl font-medium uppercase'>
        This page is <span className='text-orange'>coming soon</span>
      </h1>

      <p className='absolute text-lg text-center text-gray-400 bottom-5'>
        {/* We are currently working on this page. Please come back later. */}
        &copy; Copyrights Cup of chi | All Right Reserve
      </p>
    </div>
  )
}

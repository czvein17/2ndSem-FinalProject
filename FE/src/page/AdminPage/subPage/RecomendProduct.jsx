import React, { useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

import {
  MdOutlineEmojiEmotions,
  MdOutlineSentimentSatisfied,
  MdOutlineSentimentDissatisfied,
  MdOutlineSentimentVerySatisfied,
  MdOutlineSentimentVeryDissatisfied,
} from 'react-icons/md'
import { recommendProduct } from '../../../API/product'
import { useMutation } from '@tanstack/react-query'
export const RecomendProduct = () => {
  const [recomendedProducts, setRecomendedProducts] = useState([])
  const [selectedEmotion, setSelectedEmotion] = useState([])
  const loading = true

  console.log(recomendedProducts)

  const { mutate: recommend, isPending } = useMutation({
    mutationFn: recommendProduct,
    onSuccess: (data) => {
      console.log(data)
      setRecomendedProducts(data.d)
    },
  })

  const handleEmotionClick = (emotion) => {
    console.log(emotion)
    setSelectedEmotion((prevEmotion) => [...prevEmotion, emotion])
  }

  const handleRecommendation = () => recommend(selectedEmotion)

  return (
    <div className='flex h-full md:py-5'>
      {isPending && (
        <DotLottieReact
          src='https://lottie.host/c547c13b-5989-4389-8250-1e614f0d7442/tL1laAh5sf.lottie'
          loop
          autoplay
        />
      )}
      {!isPending && !recomendedProducts.length && (
        <div className='flex flex-col mx-auto my-auto space-y-4'>
          <div className='mx-auto'>
            <h4 className='text-2xl font-semibold text-center uppercase'>
              Hey there, how are you feeling today?
            </h4>
          </div>
          <div className='flex flex-wrap justify-center gap-1'>
            <MdOutlineEmojiEmotions
              className='w-28 h-28 md:w-[200px] md:h-[200px]'
              onClick={() => handleEmotionClick('Very Happy')}
            />
            <MdOutlineSentimentSatisfied
              className='w-28 h-28 md:w-[200px] md:h-[200px]'
              onClick={() => handleEmotionClick('Happy')}
            />
            <MdOutlineSentimentDissatisfied
              className='w-28 h-28 md:w-[200px] md:h-[200px]'
              onClick={() => handleEmotionClick('Sad')}
            />
            <MdOutlineSentimentVerySatisfied
              className='w-28 h-28 md:w-[200px] md:h-[200px]'
              onClick={() => handleEmotionClick('Very Satisfied')}
            />
            <MdOutlineSentimentVeryDissatisfied
              className='w-28 h-28 md:w-[200px] md:h-[200px]'
              onClick={() => handleEmotionClick('Very Dissatisfied')}
            />
          </div>
          <button
            className='px-5 py-2 mx-auto rounded bg-primary'
            onClick={handleRecommendation}
          >
            Submit
          </button>
        </div>
      )}

      {!isPending && recomendedProducts.length > 0 && (
        <div className='flex flex-col gap-2'>
          {recomendedProducts.map((product) => (
            <div key={product._id} className='p-5 border border-black rounded-lg'>
              <p>{product.name}</p>
              <p>{product.description}</p>
              <p>{product.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

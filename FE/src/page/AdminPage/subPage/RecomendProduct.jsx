import React, { useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useMutation } from '@tanstack/react-query'

import { recommendProduct } from '../../../API/product'

import ANGRY from '../../../assets/emoji/angry.svg'
import HAPPY from '../../../assets/emoji/happy.svg'
import ANXIOUS from '../../../assets/emoji/anxious.svg'
import CHILL from '../../../assets/emoji/chill.svg'
import SLEEPY from '../../../assets/emoji/sleepy.svg'
import NEUTRAL from '../../../assets/emoji/neutral.svg'
import CONFUSED from '../../../assets/emoji/confused.svg'
import SAD from '../../../assets/emoji/sad.svg'

const ICONS = [
  {
    name: 'Neutral',
    src: NEUTRAL,
  },
  {
    name: 'Chill',
    src: CHILL,
  },
  {
    name: 'Happy',
    src: HAPPY,
  },
  {
    name: 'Sleepy',
    src: SLEEPY,
  },
  {
    name: 'Anxious',
    src: ANXIOUS,
  },
  {
    name: 'Angry',
    src: ANGRY,
  },
  {
    name: 'Confused',
    src: CONFUSED,
  },
  {
    name: 'Sad',
    src: SAD,
  },
]

export const RecomendProduct = () => {
  const [recomendedProducts, setRecomendedProducts] = useState([])
  const [selectedEmotion, setSelectedEmotion] = useState([])

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
    <div className='flex h-full overflow-hidden md:py-5'>
      {isPending && (
        <DotLottieReact
          src='https://lottie.host/c547c13b-5989-4389-8250-1e614f0d7442/tL1laAh5sf.lottie'
          loop
          autoplay
        />
      )}
      {!isPending && !recomendedProducts.length && (
        <div className='flex flex-col mx-auto my-auto space-y-10'>
          <div className='mx-auto'>
            <h4 className='text-4xl font-semibold text-center uppercase'>
              Hey there, how are you feeling today?
            </h4>
          </div>

          <div className='flex flex-wrap justify-center gap-10'>
            {ICONS.map((icon, index) => (
              <img
                key={index}
                src={icon.src}
                alt={icon.name}
                className='w-24 h-24 md:w-[200px] md:h-[200px] drop-shadow-2xl '
                onClick={() => handleEmotionClick(icon.name)}
              />
            ))}
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
        <div className='grid grid-cols-1 gap-5 py-5 overflow-auto bg-red-500 md:py-0 xl:grid-cols-3 md:grid-cols-2 auto-rows-min'>
          {recomendedProducts.map((product, index) => (
            <div key={product._id} className={`p-5 border border-black rounded-lg`}>
              <div className='w-32 h-32 mx-auto'>
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/coffee-image/${product.image}`}
                  alt={product.name}
                />
              </div>
              <p>USER MOOD</p>
              <p>{product.name}</p>
              <p>{product.description}</p>
              <p>{product.explanation}</p>
              <p>APPLICABLE MOOD</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

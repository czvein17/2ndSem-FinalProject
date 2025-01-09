import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

import { IoInformationCircleOutline } from 'react-icons/io5'
import ANGRY from '../../assets/emoji/angry.svg'
import HAPPY from '../../assets/emoji/happy.svg'
import ANXIOUS from '../../assets/emoji/anxious.svg'
import CHILL from '../../assets/emoji/chill.svg'
import SLEEPY from '../../assets/emoji/sleepy.svg'
import NEUTRAL from '../../assets/emoji/neutral.svg'
import CONFUSED from '../../assets/emoji/confused.svg'
import SAD from '../../assets/emoji/sad.svg'

import { recommendProduct } from '../../API/product'
import { CoffeeCard } from './CoffeeCard'

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

export const RecommendCoffee = () => {
  const [recomendedProducts, setRecomendedProducts] = useState([])
  const [selectedEmotion, setSelectedEmotion] = useState([])

  const { mutate: recommend, isPending } = useMutation({
    mutationFn: recommendProduct,
    onSuccess: (data) => {
      setRecomendedProducts(data.d)
    },
  })

  const handleRecommendation = () => recommend(selectedEmotion)
  const handleEmotionClick = (emotion) => {
    console.log(emotion)
    setSelectedEmotion((prevEmotion) => [...prevEmotion, emotion])
  }

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: 'easeOut',
      },
    },
  }

  const staggerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <div className='flex w-full h-full '>
      {!isPending && !recomendedProducts.length && (
        <div className='flex flex-col mx-auto my-auto space-y-10 '>
          <div className='mx-auto my-auto'>
            <h4 className='text-4xl font-semibold text-center uppercase'>
              Hey there, how are you feeling today?
            </h4>
          </div>

          <AnimatePresence>
            <motion.div
              className='flex flex-wrap justify-center gap-10'
              variants={containerVariants}
              initial='hidden'
              animate='visible'
            >
              {ICONS.map((icon, index) => (
                <motion.img
                  variants={staggerVariants}
                  key={index}
                  src={icon.src}
                  alt={icon.name}
                  className='w-24 h-24 md:w-[200px] md:h-[200px] drop-shadow-2xl cursor-pointer'
                  onClick={() => handleEmotionClick(icon.name)}
                  whileHover={{
                    scale: 1.2,
                    transition: {
                      duration: 0.3, // Adjust the duration as needed
                      ease: 'easeInOut',
                    },
                  }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
          <button
            className='px-10 py-2 mx-auto text-white transition-all duration-150 ease-in-out border rounded-full bg-orange hover:bg-transparent hover:border-orange hover:text-orange'
            onClick={handleRecommendation}
          >
            Submit
          </button>

          <div className='flex items-center justify-center gap-2 text-center'>
            <IoInformationCircleOutline size={30} />
            <p className='text-center '>
              To use this feature, click on the emoji that represents your mood today
              and Submit
            </p>
          </div>
        </div>
      )}

      {isPending && (
        <DotLottieReact
          src='https://lottie.host/c547c13b-5989-4389-8250-1e614f0d7442/tL1laAh5sf.lottie'
          loop
          autoplay
        />
      )}

      <AnimatePresence>
        {!isPending && recomendedProducts.length > 0 && (
          <div className='flex flex-col w-full h-full gap-2'>
            <h1 className='p-2'>
              Here is the recommend products based on your mood:{' '}
              <span className='text-lg font-medium'>
                {selectedEmotion.join(', ')}
              </span>
            </h1>
            <motion.div
              className='grid grid-cols-1 gap-5 p-2 xl:grid-cols-3 md:grid-cols-2 auto-rows-min'
              variants={containerVariants}
              initial='hidden'
              animate='visible'
            >
              {recomendedProducts.map((product, index) => (
                <motion.div key={product._id} variants={staggerVariants}>
                  <CoffeeCard key={product._id} coffee={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

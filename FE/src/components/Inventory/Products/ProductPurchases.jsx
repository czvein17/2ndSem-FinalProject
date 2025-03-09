import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProductSales } from '../../../API/sales'
import { data, useParams } from 'react-router-dom'

import { IoIosInformationCircle } from 'react-icons/io'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const fomatDate = (dataString) => {
  const option = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dataString).toLocaleDateString(undefined, option)
}

export const ProductPurchases = ({ productId }) => {
  const { id } = useParams()

  const {
    data: productSales,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['productSales'],
    queryFn: () => getProductSales(productId),
  })

  const chartData = {
    labels: productSales?.d?.map((sale) => fomatDate(sale.date)),
    datasets: [
      {
        label: 'Sales',
        data: productSales?.d?.map((sale) => sale.totalSales),
        fill: false,
        backgroundColor: 'rgb(255, 174, 130)',
        borderColor: 'rgba(255, 174, 130, 0.8)',
      },
      {
        label: 'Sold Quantity',
        data: productSales?.d?.map((item) => item.totalQuantity),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Product Purchases',
        font: {
          size: 24, // Set the font size
          weight: 'bold', // Set the font weight
          family: 'Poppins', // Set the font family
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // This will create a wavy line effect
      },
    },

    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(context.parsed.y)
          }
          return label
        },
      },
    },
  }

  return (
    <div className='flex h-full '>
      {!isPending && !isError && (
        <div className='flex flex-col w-full h-full '>
          <div className='flex justify-center w-full h-full'>
            <Line data={chartData} options={options} />
          </div>
          <h1 className='flex items-center gap-2 mx-auto text-sm font-medium'>
            <span className='text-orange'>
              <IoIosInformationCircle size={24} />
            </span>
            This graph shows the sale of the product and the total quantity sold
          </h1>
        </div>
      )}
    </div>
  )
}

import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Define the custom border plugin
const customBorder = {
  id: 'customBorder',
  beforeDraw: (chart) => {
    const {
      ctx,
      chartArea: { top, bottom, left, right },
    } = chart
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(255, 174, 130, 1)'

    ctx.moveTo(left, top)
    ctx.lineTo(left, bottom)

    ctx.moveTo(left, bottom)
    ctx.lineTo(right, bottom)

    ctx.closePath()
    ctx.stroke()
    ctx.restore()
  },
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  customBorder,
)

export const SalesChart = () => {
  const data = {
    labels: ['Mar 04', 'Mar 05', 'Mar 06', 'Mar 07', 'Mar 08', 'Mar 09', 'Mar 10'],
    datasets: [
      {
        label: 'Sales',
        data: [110, 20, 30, 70, 80, 20, 100],
        backgroundColor: 'rgba(255, 174, 130, 0.2)',
        borderColor: 'rgba(255, 174, 130, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      //   customBorder,
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false, // Ensure no border on x-axis
        },
        ticks: {
          font: {
            family: 'Poppins',
            size: 14,
            weight: '600',
          },
        },
      },
      y: {
        grid: {
          //   display: false,
          drawBorder: false, // Ensure no border on y-axis
        },
        ticks: {
          display: false,
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}

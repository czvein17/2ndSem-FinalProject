import React, { useEffect, useState } from 'react'
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

export const SalesChart = ({ salesData, timeRange, setTimeRange }) => {
  console.log(timeRange)
  const [processedSalesData, setProcessedSalesData] = useState([])

  useEffect(() => {
    setProcessedSalesData(preprocessSalesData(salesData, timeRange))
  }, [salesData, timeRange])

  const preprocessSalesData = (salesData, timeRange) => {
    const now = new Date()
    let startDate, endDate

    if (timeRange === 'last7days') {
      startDate = new Date(now.setDate(now.getDate() - 6))
      endDate = new Date()
    } else if (timeRange === 'lastMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      endDate = new Date(now.getFullYear(), now.getMonth(), 0)
    } else if (timeRange === 'thisMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date()
    }

    const filledSalesData = []
    if (timeRange === 'last7days') {
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        const sales = salesData.find((s) => s._id === dateStr)
        filledSalesData.push({
          _id: dateStr,
          totalSales: sales ? sales.totalSales : 0,
        })
      }
    } else {
      const weeks = {}
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const weekStr = `${d.getFullYear()}-W${Math.ceil((d.getDate() - 1) / 7)}`
        if (!weeks[weekStr]) {
          weeks[weekStr] = { _id: weekStr, totalSales: 0 }
        }
        const sales = salesData.find((s) => s._id === d.toISOString().split('T')[0])
        if (sales) {
          weeks[weekStr].totalSales += sales.totalSales
        }
      }
      filledSalesData.push(...Object.values(weeks))
    }

    return filledSalesData
  }

  const formatLabel = (label, timeRange) => {
    if (timeRange === 'last7days') {
      const date = new Date(label)
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      const weekNumber = label.split('-W')[1]
      return `Week ${parseInt(weekNumber, 10) + 1}`
    }
  }

  const data = {
    labels: processedSalesData.map((item) => formatLabel(item._id, timeRange)),
    datasets: [
      {
        label: 'Sales',
        data: processedSalesData.map((item) => item.totalSales),
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

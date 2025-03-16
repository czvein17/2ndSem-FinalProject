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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const SalesByStatusChart = ({ salesStatus }) => {
  const defaultStatuses = [
    { _id: 'paid', count: 0 },
    { _id: 'pending', count: 0 },
    { _id: 'cancelled', count: 0 },
  ]

  const mergedStatuses = defaultStatuses.map((defaultStatus) => {
    const foundStatus = salesStatus.find(
      (status) => status._id === defaultStatus._id,
    )
    return foundStatus ? foundStatus : defaultStatus
  })

  const labels = mergedStatuses.map(
    (status) => status._id.charAt(0).toUpperCase() + status._id.slice(1),
  )
  const dataValues = salesStatus.map((status) => status.count)

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Sales by Status',
        data: dataValues,
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],

    // labels: ['Completed', 'Pending', 'Cancelled'],
    // datasets: [
    //   {
    //     label: 'Sales by Status',
    //     data: [150, 50, 100],
    //     backgroundColor: [
    //       'rgba(75, 192, 192, 0.2)',
    //       'rgba(255, 99, 132, 0.2)',
    //       'rgba(255, 206, 86, 0.2)',
    //     ],
    //     borderColor: [
    //       'rgba(75, 192, 192, 1)',
    //       'rgba(255, 99, 132, 1)',
    //       'rgba(255, 206, 86, 1)',
    //     ],
    //     borderWidth: 1,
    //   },
    // ],
  }

  const options = {
    indexAxis: 'y', // Set the index axis to 'y' for a horizontal bar chart
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
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
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: 'Poppins',
            size: 14,
            weight: '600',
          },
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}

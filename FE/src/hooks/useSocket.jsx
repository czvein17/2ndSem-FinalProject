import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { queryClient } from '../API/http'

export const useSocket = () => {
  const socket = io(`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}`)

  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
  useEffect(() => {
    socket.on('pendingOrdersCount', (count) => {
      setPendingOrdersCount(count)
      queryClient.invalidateQueries(['orders'])
    })

    return () => {
      console.log('Cleaning up WebSocket listener for pendingOrdersCount')
      socket.off('pendingOrdersCount')
    }
  }, [queryClient, socket])

  return pendingOrdersCount
}

import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './API/http'
import AppRouter from './AppRouter'
import { AuthProvider } from './context/authContext'
import { useEffect } from 'react'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className='min-h-screen bg-background'>
            <AppRouter />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App

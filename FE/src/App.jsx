import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './API/http'
import AppRouter from './AppRouter'
import { AuthProvider } from './context/authContext'

function App() {
  console.log('IM AM ON VERCEl')
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

import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './API/http'
import AppRouter from './AppRouter'
import { AuthProvider } from './context/authContext'
import { CartProvider } from './context/cartContext'

function App() {
  console.log('IM AM ON VERCEl')
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className='min-h-screen bg-background'>
              <AppRouter />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App

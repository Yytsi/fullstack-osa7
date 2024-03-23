import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationProvider } from './NotificationContext'
import { BlogProvider } from './contexts/BlogContext'
import { UserProvider } from './contexts/UserContext'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <UserProvider>
          <BlogProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </BlogProvider>
        </UserProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  </Router>
)

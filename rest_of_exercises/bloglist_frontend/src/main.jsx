import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationProvider } from './NotificationContext'
import { BlogProvider } from './BlogContext'
import { UserProvider } from './UserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <BlogProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </BlogProvider>
    </UserProvider>
  </QueryClientProvider>
)

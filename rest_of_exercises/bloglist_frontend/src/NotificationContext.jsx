import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    case 'CLEAR_NOTIFICATION':
      return { message: null, type: null }
    default:
      return state
  }
}

const NotificationContext = createContext({ message: '', type: '' })

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, {
    message: null,
    type: null,
  })

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const setNotification = (message, type) => {
  return {
    type: 'SET_NOTIFICATION',
    data: { message, type },
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION',
  }
}

export default NotificationContext

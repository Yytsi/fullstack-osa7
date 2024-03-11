import { createContext, useReducer } from 'react'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.data
    case 'CLEAR_USER':
      return null
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {children}
    </UserContext.Provider>
  )
}

export const setUser = (user) => {
  return {
    type: 'SET_USER',
    data: user,
  }
}

export const clearUser = () => {
  return {
    type: 'CLEAR_USER',
  }
}

export default UserContext

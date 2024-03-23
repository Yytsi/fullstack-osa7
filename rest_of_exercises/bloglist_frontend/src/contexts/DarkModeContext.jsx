import { createContext, useState } from 'react'

const DarkModeContext = createContext()

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <DarkModeContext.Provider value={[darkMode, setDarkMode]}>
      {children}
    </DarkModeContext.Provider>
  )
}

export default DarkModeContext

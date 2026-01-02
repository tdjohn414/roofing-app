'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isAuto: boolean
  setIsAuto: (auto: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [isAuto, setIsAuto] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Determine if it should be dark based on time (7pm - 7am)
  const shouldBeDark = (): boolean => {
    const hour = new Date().getHours()
    return hour >= 19 || hour < 7 // 7pm to 7am
  }

  // Initialize theme
  useEffect(() => {
    setMounted(true)
    
    // Check localStorage for saved preferences
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const savedAuto = localStorage.getItem('themeAuto')
    
    if (savedAuto !== null) {
      setIsAuto(savedAuto === 'true')
    }
    
    if (savedAuto === 'false' && savedTheme) {
      // Manual mode - use saved theme
      setTheme(savedTheme)
    } else {
      // Auto mode - use time-based theme
      setTheme(shouldBeDark() ? 'dark' : 'light')
    }
  }, [])

  // Auto-update theme based on time
  useEffect(() => {
    if (!isAuto) return

    const checkTime = () => {
      const newTheme = shouldBeDark() ? 'dark' : 'light'
      setTheme(newTheme)
    }

    // Check every minute
    const interval = setInterval(checkTime, 60000)
    
    // Also check immediately when auto mode is enabled
    checkTime()

    return () => clearInterval(interval)
  }, [isAuto])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  // Save auto preference
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('themeAuto', String(isAuto))
  }, [isAuto, mounted])

  const toggleTheme = () => {
    setIsAuto(false) // Disable auto when manually toggling
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Prevent flash of wrong theme
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isAuto, setIsAuto }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

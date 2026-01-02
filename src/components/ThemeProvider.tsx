'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isAuto: boolean
  setIsAuto: (auto: boolean) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isAuto: true,
  setIsAuto: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [isAuto, setIsAuto] = useState(true)
  const [mounted, setMounted] = useState(false)

  const shouldBeDark = (): boolean => {
    const hour = new Date().getHours()
    return hour >= 19 || hour < 7
  }

  useEffect(() => {
    setMounted(true)
    
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const savedAuto = localStorage.getItem('themeAuto')
    
    if (savedAuto !== null) {
      setIsAuto(savedAuto === 'true')
    }
    
    if (savedAuto === 'false' && savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme(shouldBeDark() ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    if (!isAuto || !mounted) return

    const checkTime = () => {
      setTheme(shouldBeDark() ? 'dark' : 'light')
    }

    const interval = setInterval(checkTime, 60000)
    checkTime()

    return () => clearInterval(interval)
  }, [isAuto, mounted])

  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('themeAuto', String(isAuto))
  }, [isAuto, mounted])

  const toggleTheme = () => {
    setIsAuto(false)
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isAuto, setIsAuto }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

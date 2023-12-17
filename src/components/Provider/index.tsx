'use client'

import React from 'react'

import { ThemeProvider } from 'next-themes'

import { TooltipProvider } from '~/components/ui/tooltip'

interface ProviderProps {
  children: React.ReactNode
}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <>{children}</>
        </TooltipProvider>
      </ThemeProvider>
    </>
  )
}

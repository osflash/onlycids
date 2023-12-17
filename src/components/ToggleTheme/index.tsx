'use client'

import React, { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import { MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger
} from '~/components/ui/select'

export const ToggleTheme = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Select value={(mounted && theme) || 'system'} onValueChange={setTheme}>
      <Button asChild variant="outline" size="icon">
        <SelectTrigger>
          <SunIcon className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </SelectTrigger>
      </Button>

      <SelectContent align="end">
        <SelectGroup>
          <SelectLabel>Select a Theme</SelectLabel>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

import React from 'react'

import Link from 'next/link'

import { LanguagesIcon } from 'lucide-react'

import { ToggleTheme } from '~/components/ToggleTheme'
import { Button } from '~/components/ui/button'

export const Header: React.FC = () => {
  return (
    <nav className="mx-auto w-full max-w-screen-xl lg:p-8">
      {/* PC */}
      <div className="z-50 hidden flex-row items-center justify-between lg:flex">
        <div className="items-center justify-center lg:flex">
          <Button className="text-2xl font-semibold" asChild>
            <Link href="/">
              onlyCIDs
              <span className="sr-only">Logo Site</span>
            </Link>
          </Button>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-center">
          <div className="shrink-0 flex-row items-center justify-center space-x-2">
            <Button variant="outline" size="icon" disabled>
              <LanguagesIcon className="h-4 w-4" />
            </Button>

            <ToggleTheme />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="relative flex w-full flex-row items-center justify-between lg:hidden">
        <div className="h-14">
          <Button className="h-full text-2xl font-semibold" asChild>
            <Link href="/">
              onlyCIDs<span className="sr-only">Logo Site</span>
            </Link>
          </Button>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-center px-4">
          <div className="shrink-0 flex-row items-center justify-center space-x-2">
            <Button variant="outline" size="icon" disabled>
              <LanguagesIcon className="h-4 w-4" />
            </Button>

            <ToggleTheme />
          </div>
        </div>
      </div>
    </nav>
  )
}

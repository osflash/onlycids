import React from 'react'

import { UploadFiles } from '~/components/UploadFiles'

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      <UploadFiles />
    </main>
  )
}

export default HomePage

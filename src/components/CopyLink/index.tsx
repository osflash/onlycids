import React, { useRef } from 'react'
import { useCopyToClipboard } from 'react-use'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface CopyLinkProps {
  cid: string
}

export const CopyLink: React.FC<CopyLinkProps> = ({ cid }) => {
  const inputLinkRef = useRef<HTMLInputElement>(null)

  const [, copyToClipboard] = useCopyToClipboard()

  const copyLink = () => {
    if (!inputLinkRef.current) {
      return
    }

    inputLinkRef.current.select()

    copyToClipboard(inputLinkRef.current.value)
  }

  return (
    <div className="flex space-x-2">
      <Label htmlFor="link" className="sr-only">
        Link
      </Label>
      <Input
        ref={inputLinkRef}
        id="link"
        value={`https://nftstorage.link/ipfs/${cid}`}
        readOnly
        onClick={copyLink}
      />
      <Button variant="secondary" className="shrink-0" onClick={copyLink}>
        Copy Link
      </Button>
    </div>
  )
}

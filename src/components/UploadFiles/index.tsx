'use client'

import React, { useEffect, useRef, useState } from 'react'
import { type DropEvent, type FileRejection, useDropzone } from 'react-dropzone'

import Link from 'next/link'

import { type CheckedState } from '@radix-ui/react-checkbox'
import { PromisePool } from '@supercharge/promise-pool'
import { isAxiosError } from 'axios'
import { UploadIcon } from 'lucide-react'
import { NFTStorage } from 'nft.storage'

import { splitter } from '~/libs/splitter'
import { cn } from '~/libs/utils'

import { Checkbox } from '~/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '~/components/ui/tooltip'

import { storage } from '~/service/storage'

import { CopyLink } from '../CopyLink'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Progress } from '../ui/progress'

type Status = 'idle' | 'waiting' | 'uploading' | 'success'

type UploadResponse = {
  ok: boolean
  value: {
    cid: string
  }
}

type UploadError = {
  ok: boolean
  error: {
    code: string
    message: string
  }
}

const token = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN

const disabledStatus = ['uploading', 'waiting']

const handleFiles = (files: File[]) => {
  if (files.length === 1) {
    return NFTStorage.encodeBlob(files[0])
  }

  return NFTStorage.encodeDirectory(files)
}

export const UploadFiles: React.FC = () => {
  const [CID, setCID] = useState<string | undefined>(undefined)
  const [errors, setErrors] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [suporteWebkitDirectory, setSuporteWebkitDirectory] = useState(false)

  const inputTokenRef = useRef<HTMLInputElement>(null)

  const onDrop = async (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => {
    setCID(undefined)
    setErrors([])
    setProgress(0.001)
    setStatus('waiting')

    const uploadProgress = new Map<number, number>()

    const { cid,car } = await handleFiles(acceptedFiles)

    setCID(cid)

    const blobs = await splitter(car)

    await PromisePool.withConcurrency(1)
      .for(blobs)
      .process(async (blob, i) => {
        try {
          setStatus('uploading')

          const {
            data: {
              value: { cid }
            }
          } = await storage.post<UploadResponse>('/upload', blob, {
            headers: {
              'Content-Type': 'application/car',
              Authorization: `Bearer ${inputTokenRef.current?.value || token}`
            },
            onUploadProgress: async e => {
              let totalProgress = 0

              uploadProgress.set(i, e.progress ?? 0)

              uploadProgress.forEach(value => (totalProgress += value))

              const progress = totalProgress / blobs.length

              setProgress(progress)
            }
          })

          setCID(cid)
        } catch (err) {
          if (isAxiosError<UploadError>(err)) {
            if (!err.response) {
              return
            }

            const { message } = err.response.data.error

            setErrors(prev => [...prev, message])
          }
        }
      })

    setStatus('success')
  }

  const { getRootProps, getInputProps, inputRef, isDragAccept } = useDropzone({
    onDrop: onDrop,
    multiple: true,
    useFsAccessApi: false,
    disabled: disabledStatus.includes(status)
  })

  const onCheckedChange = (checked: CheckedState) => {
    if (!inputRef.current) return

    if (checked) {
      inputRef.current.setAttribute('webkitdirectory', '')
      inputRef.current.setAttribute('directory', '')
    } else {
      inputRef.current.removeAttribute('webkitdirectory')
      inputRef.current.removeAttribute('directory')
    }
  }

  useEffect(() => {
    if (inputRef.current && 'webkitdirectory' in inputRef.current) {
      setSuporteWebkitDirectory(true)
    }
  }, [inputRef])

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {suporteWebkitDirectory && (
        <div className="flex gap-2">
          <Checkbox id="dir" onCheckedChange={onCheckedChange} />

          <div className="grid gap-2 leading-none">
            <label
              htmlFor="dir"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable folder upload
            </label>


                <p className="text-sm text-muted-foreground">
                  By checking this box, you can upload entire folders.
                  <Button variant="link" className="h-fit px-2 py-0" asChild>
                    <Link
                      href="https://nft.storage/faq/#is-there-a-limit-on-numbers-of-files-in-a-directory"
                      target="_blank"
                      rel="noreferrer"
                    >
                      (more)
                    </Link>
                  </Button>
                </p>

          </div>
        </div>
      )}

      <Input ref={inputTokenRef} placeholder={token} />

      <label
        className={cn(
          'relative flex aspect-video cursor-pointer flex-col items-center rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5',
          {
            'border-green-500': isDragAccept,
            'cursor-progress border-orange-500': disabledStatus.includes(status)
          }
        )}
        {...getRootProps()}
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <UploadIcon className="h-4 w-4" />
          Drag and Drop files
          <span>(or click to choose)</span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="py-2 font-semibold">Send up to 31 GB</span>
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            className="bg-destructive text-destructive-foreground shadow-sm"
          >
            There are no restrictions imposed by the service, except for the 31 GiB size limit per individual upload.

Please be aware that uploading extensive directories, particularly through your browser, may necessitate a significant amount of computer memory.
          </TooltipContent>
        </Tooltip>
      </label>

      <input type="file" className="sr-only" {...getInputProps()} />

      {progress != 0 && <Progress value={progress * 100} className="w-full" />}

      {errors.map((error, i) => (
          <div
            key={error + i}
            className="bg-destructive px-2 py-1.5 text-xs text-destructive-foreground shadow-sm"
          >
            {error}
          </div>
        ))}

      {CID && <CopyLink cid={CID} />}
    </div>
  )
}

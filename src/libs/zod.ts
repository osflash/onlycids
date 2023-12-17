import { z } from 'zod'

export const envSchema = z
  .object({
    NEXT_PUBLIC_NFT_STORAGE_TOKEN: z.string()
  })
  .readonly()

export type Env = z.infer<typeof envSchema>

export const file = z.object({
  id: z.string().uuid(),
  cid: z.string(),
  name: z.string(),
  owner: z.string(),
  size: z.number(),
  createAt: z.number(),
  updatedAt: z.number()
})

export type FileStorage = z.infer<typeof file>

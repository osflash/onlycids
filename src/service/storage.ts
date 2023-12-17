import axios from 'axios'

export const storage = axios.create({
  baseURL: 'https://api.nft.storage',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN}`
  }
})

type TokenUploadResponse = {
  ok: boolean
  value: string
}

export const getTokenUpload = async () => {
  const {
    data: { value }
  } = await storage.get<TokenUploadResponse>('/ucan/token')

  return value
}

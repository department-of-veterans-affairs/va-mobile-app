import { Buffer } from 'buffer'

import getEnv from 'utils/env'

const { DIGITAL_WALLET_BASE_URL } = getEnv()

export type VeteranPassPayload = {
  name: string
  id: string
  disability_percent?: number
  as_of_date?: string // YYYY-MM-DD
}

/** POST /apple -> returns .pkpass as base64 string */
export async function createApplePkpassBase64(payload: VeteranPassPayload): Promise<string> {
  console.log('endpoint: ' + DIGITAL_WALLET_BASE_URL)
  const res = await fetch(`https://vamwpoc-production.up.railway.app/apple`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.apple.pkpass',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  console.log('res: ' + JSON.stringify(res))
  if (!res.ok) throw new Error(`PoC /apple failed: ${res.status}`)

  const buf = await res.arrayBuffer()
  console.log('buf: ' + buf)
  return Buffer.from(buf).toString('base64')
}

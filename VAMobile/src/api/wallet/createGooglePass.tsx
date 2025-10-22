import getEnv from 'utils/env'

const { DIGITAL_WALLET_BASE_URL } = getEnv()

export type VeteranPassPayload = {
  name: string
  id: string
  disability_percent?: number
  as_of_date?: string // YYYY-MM-DD
}

export type GooglePassResponse = {
  save_url: string // The save URL for Google Wallet
  pass_id: number // The numeric pass ID
  object_id: string // The Google Wallet object ID
}

/**
 * POST /google - returns save URL and pass ID
 */
export async function createGooglePass(payload: VeteranPassPayload): Promise<GooglePassResponse> {
  console.log('Creating Google Pass with payload:', JSON.stringify(payload, null, 2))
  console.log(`Calling endpoint: ${DIGITAL_WALLET_BASE_URL}/google`)

  const res = await fetch(`${DIGITAL_WALLET_BASE_URL}/google`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  console.log('Response status:', res.status)

  if (!res.ok) {
    const errorText = await res.text()
    console.error('API Error:', errorText)
    throw new Error(`PoC /google failed: ${res.status} - ${errorText}`)
  }

  const data = await res.json()
  console.log('Google Pass API response:', JSON.stringify(data, null, 2))

  // Validate response has required fields
  if (!data.save_url) {
    console.error('Missing save_url in response. Available fields:', Object.keys(data))
    throw new Error(`Invalid API response: missing save_url. Response keys: ${Object.keys(data).join(', ')}`)
  }

  return data
}

/**
 * PUT /google/\{id\} - updates existing Google Wallet pass
 * @param id - The pass ID to update
 */
export async function updateGooglePass(id: string, payload: VeteranPassPayload): Promise<GooglePassResponse> {
  console.log('Updating Google Pass with payload:', JSON.stringify(payload, null, 2))
  console.log(`Calling endpoint: ${DIGITAL_WALLET_BASE_URL}/google/${id}`)

  const res = await fetch(`${DIGITAL_WALLET_BASE_URL}/google/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  console.log('Response status:', res.status)

  if (!res.ok) {
    const errorText = await res.text()
    console.error('API Error:', errorText)
    throw new Error(`PoC /google/${id} failed: ${res.status} - ${errorText}`)
  }

  const data = await res.json()
  console.log('Google Pass update API response:', JSON.stringify(data, null, 2))

  // Validate response has required fields
  if (!data.save_url) {
    console.error('Missing save_url in response. Available fields:', Object.keys(data))
    throw new Error(`Invalid API response: missing save_url. Response keys: ${Object.keys(data).join(', ')}`)
  }

  return data
}

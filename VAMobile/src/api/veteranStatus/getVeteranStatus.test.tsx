import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'

import { VeteranVerificationStatusData } from 'api/types'
import { get } from 'store/api'

import { useVeteranStatus } from './getVeteranStatus'

jest.mock('store/api', () => ({
  get: jest.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useVeteranStatus', () => {
  it('returns data on success when "confirmed"', async () => {
    const mockData: VeteranVerificationStatusData = {
      data: {
        id: '',
        type: 'veteran_status_confirmations',
        attributes: {
          veteranStatus: 'confirmed',
        },
      },
    }
    ;(get as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useVeteranStatus(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockData)
  })

  it('returns "not confirmed" with reason "NOT_TITLE_38"', async () => {
    const mockData: VeteranVerificationStatusData = {
      data: {
        id: '',
        type: 'veteran_status_confirmations',
        attributes: {
          veteranStatus: 'not confirmed',
          notConfirmedReason: 'NOT_TITLE_38',
        },
        message: ['Our records show that you’re not eligible...', 'If you think your discharge status is incorrect...'],
      },
    }
    ;(get as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useVeteranStatus(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data.attributes.veteranStatus).toBe('not confirmed')
    expect(result.current.data?.data.attributes.notConfirmedReason).toBe('NOT_TITLE_38')
    expect(result.current.data?.data.message).toHaveLength(2)
  })

  it('returns "not confirmed" with reason "MORE_RESEARCH_REQUIRED"', async () => {
    const mockData: VeteranVerificationStatusData = {
      data: {
        id: '',
        type: 'veteran_status_confirmations',
        attributes: {
          veteranStatus: 'not confirmed',
          notConfirmedReason: 'MORE_RESEARCH_REQUIRED',
        },
        message: [
          'We’re sorry. There’s a problem with your discharge status records.',
          'To fix the problem with your records...',
        ],
      },
    }
    ;(get as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useVeteranStatus(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data.attributes.veteranStatus).toBe('not confirmed')
    expect(result.current.data?.data.attributes.notConfirmedReason).toBe('MORE_RESEARCH_REQUIRED')
    expect(result.current.data?.data.message).toHaveLength(2)
  })

  it('returns "not confirmed" with reason "PERSON_NOT_FOUND"', async () => {
    const mockData: VeteranVerificationStatusData = {
      data: {
        id: '',
        type: 'veteran_status_confirmations',
        attributes: {
          veteranStatus: 'not confirmed',
          notConfirmedReason: 'PERSON_NOT_FOUND',
        },
        message: [
          'We’re sorry. There’s a problem with your discharge status records.',
          'To fix the problem with your records...',
        ],
      },
    }
    ;(get as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useVeteranStatus(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data.attributes.veteranStatus).toBe('not confirmed')
    expect(result.current.data?.data.attributes.notConfirmedReason).toBe('PERSON_NOT_FOUND')
    expect(result.current.data?.data.message).toHaveLength(2)
  })

  it('returns "not confirmed" with reason "ERROR"', async () => {
    const mockData: VeteranVerificationStatusData = {
      data: {
        id: '',
        type: 'veteran_status_confirmations',
        attributes: {
          veteranStatus: 'not confirmed',
          notConfirmedReason: 'ERROR',
        },
        message: ["We're sorry. Something went wrong on our end. Try to view your Veteran status card later."],
      },
    }
    ;(get as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useVeteranStatus(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data?.data.attributes.veteranStatus).toBe('not confirmed')
    expect(result.current.data?.data.attributes.notConfirmedReason).toBe('ERROR')
    expect(result.current.data?.data.message).toEqual([
      "We're sorry. Something went wrong on our end. Try to view your Veteran status card later.",
    ])
  })
})

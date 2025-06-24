import { waitFor } from '@testing-library/react-native'

import { useSaveAddress } from 'api/contactInformation/saveAddress'
import * as api from 'store/api'
import { context, renderMutation, when } from 'testUtils'

let mockLogNonFatalErrorToFirebase: jest.Mock
jest.mock('utils/analytics', () => {
  mockLogNonFatalErrorToFirebase = jest.fn()
  const original = jest.requireActual('utils/analytics')
  return {
    ...original,
    logNonFatalErrorToFirebase: mockLogNonFatalErrorToFirebase,
  }
})

context('saveAddress', () => {
  describe('saving address', () => {
    const addressData = {
      id: 1,
      addressLine1: '123 Street St',
      addressPou: 'RESIDENCE/CHOICE',
      addressType: 'DOMESTIC',
      city: 'City',
      countryCodeIso3: '1',
      zipCode: '12345',
    }

    it('should create address data when id is not provided', async () => {
      when(api.post as jest.Mock)
        .calledWith('/v0/user/addresses', expect.anything())
        .mockResolvedValueOnce('success')

      const { result, mutate } = renderMutation(() => useSaveAddress())

      await mutate({
        addressData: {
          ...addressData,
          id: undefined,
        },
        revalidate: false,
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.post).toBeCalledWith('/v0/user/addresses', {
        ...addressData,
        id: undefined,
      })
    })

    it('should update address data when id is provided', async () => {
      when(api.put as jest.Mock)
        .calledWith('/v0/user/addresses', expect.anything())
        .mockResolvedValueOnce('success')

      const { mutate, result } = renderMutation(() => useSaveAddress())

      await mutate({
        addressData,
        revalidate: false,
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.put).toBeCalledWith('/v0/user/addresses', addressData)
    })

    it('should revalidate address data', async () => {
      when(api.put as jest.Mock)
        .calledWith('/v0/user/addresses', expect.anything())
        .mockResolvedValueOnce('success')

      const { mutate, result } = renderMutation(() => useSaveAddress())

      await mutate({
        addressData,
        revalidate: true,
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.put).toBeCalledWith('/v0/user/addresses', addressData)
      expect(api.post).toBeCalledWith('/v0/user/addresses/validate', addressData, undefined, undefined)
    })

    it('should log error to firebase', async () => {
      when(api.put as jest.Mock)
        .calledWith('/v0/user/addresses', expect.anything())
        .mockRejectedValueOnce({
          status: 400,
          networkError: true,
        })

      const { mutate, result } = renderMutation(() => useSaveAddress())

      await mutate({
        addressData,
        revalidate: false,
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(api.put).toBeCalledWith('/v0/user/addresses', addressData)
      expect(mockLogNonFatalErrorToFirebase).toHaveBeenCalled()
    })
  })
})

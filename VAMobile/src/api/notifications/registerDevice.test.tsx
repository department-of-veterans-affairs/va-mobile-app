import AsyncStorage from '@react-native-async-storage/async-storage'

import { waitFor } from '@testing-library/react-native'

import { DEVICE_ENDPOINT_SID, DEVICE_TOKEN_KEY, USER_ID, useRegisterDevice } from 'api/notifications/registerDevice'
import * as api from 'store/api'
import { context, renderMutation, when } from 'testUtils'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

let mockLogNonFatalErrorToFirebase: jest.Mock
jest.mock('utils/analytics', () => {
  mockLogNonFatalErrorToFirebase = jest.fn()
  const original = jest.requireActual('utils/analytics')
  return {
    ...original,
    logNonFatalErrorToFirebase: mockLogNonFatalErrorToFirebase,
  }
})

context('registerDevice', () => {
  const getItem = AsyncStorage.getItem as jest.Mock

  describe('on error', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      getItem
        .mockResolvedValueOnce('saved-token')
        .mockResolvedValueOnce('saved-sid')
        .mockResolvedValueOnce('saved-user-id')
    })

    it('should log error on failure', async () => {
      when(api.put as jest.Mock)
        .calledWith('/v0/push/register', expect.anything())
        .mockRejectedValueOnce({
          status: 400,
          networkError: true,
        })

      const { mutate, result } = renderMutation(() => useRegisterDevice())
      await mutate({
        deviceToken: 'new-device-token',
        userID: 'new-user-id',
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
      expect(mockLogNonFatalErrorToFirebase).toHaveBeenCalledWith(
        {
          networkError: true,
          status: 400,
        },
        'registerDevice: Service error',
      )
    })

    it('should not log error if rejection is not an error object', async () => {
      when(api.put as jest.Mock)
        .calledWith('/v0/push/register', expect.anything())
        .mockRejectedValueOnce({
          status: 400,
        })

      const { mutate, result } = renderMutation(() => useRegisterDevice())
      await mutate({
        deviceToken: 'new-device-token',
        userID: 'new-user-id',
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
      expect(mockLogNonFatalErrorToFirebase).not.toHaveBeenCalled()
    })
  })

  describe('on success', () => {
    beforeEach(() => {
      getItem
        .mockResolvedValueOnce('saved-token')
        .mockResolvedValueOnce('saved-sid')
        .mockResolvedValueOnce('saved-user-id')
      when(api.put as jest.Mock)
        .calledWith('/v0/push/register', expect.anything())
        .mockResolvedValueOnce({
          data: {
            attributes: {
              endpointSid: 'new-endpoint-sid',
            },
          },
        })
    })

    it('should set device token to async storage when registering device', async () => {
      const { mutate, result } = renderMutation(() => useRegisterDevice())

      await mutate({
        deviceToken: 'new-device-token',
      })
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(DEVICE_ENDPOINT_SID, 'new-endpoint-sid')
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(DEVICE_TOKEN_KEY, 'new-device-token')
    })

    it('should set user id to async storage when registering device', async () => {
      const { mutate, result } = renderMutation(() => useRegisterDevice())

      await mutate({
        deviceToken: 'new-device-token',
        userID: 'new-user-id',
      })
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(DEVICE_ENDPOINT_SID, 'new-endpoint-sid')
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(DEVICE_TOKEN_KEY, 'new-device-token')
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(USER_ID, 'new-user-id')
    })

    it('should remove device token from async storage if one is not provided', async () => {
      const { mutate, result } = renderMutation(() => useRegisterDevice())

      await mutate({})
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(DEVICE_TOKEN_KEY)
    })

    it('should not register device if already registered', async () => {
      jest.clearAllMocks()
      const { mutate, result } = renderMutation(() => useRegisterDevice())

      // not a new user
      getItem
        .mockResolvedValueOnce('saved-token')
        .mockResolvedValueOnce('saved-sid')
        .mockResolvedValueOnce('saved-user-id')

      await mutate({
        deviceToken: 'saved-token',
        userID: 'saved-user-id',
      })
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.put).not.toHaveBeenCalled()
    })
  })
})

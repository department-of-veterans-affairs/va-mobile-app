import { LogBox } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { context } from 'testUtils'
import {
  HIDE_WARNINGS_DEFAULT,
  STORAGE_HIDE_WARNINGS_KEY,
  getHideWarningsPreference,
  initHideWarnings,
  toggleHideWarnings,
} from 'utils/consoleWarnings'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

jest.mock('react-native/Libraries/LogBox/LogBox', () => {
  return {
    __esModule: true,
    default: {
      ignoreAllLogs: jest.fn(),
    },
  }
})

context('consoleWarnings', () => {
  jest.spyOn(global.console, 'warn')
  describe('initHideWarnings', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should hide warnings by default', async () => {
      AsyncStorage.getItem = jest.fn().mockResolvedValueOnce(null)
      await initHideWarnings()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_HIDE_WARNINGS_KEY)
      expect(LogBox.ignoreAllLogs).toHaveBeenCalledWith(HIDE_WARNINGS_DEFAULT)
    })

    it('should show warnings', async () => {
      AsyncStorage.getItem = jest.fn().mockResolvedValueOnce('false')
      await initHideWarnings()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_HIDE_WARNINGS_KEY)
      expect(LogBox.ignoreAllLogs).toHaveBeenCalledWith(false)
    })

    it('should hide warnings on failed parse of key', async () => {
      await initHideWarnings()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_HIDE_WARNINGS_KEY)
      expect(LogBox.ignoreAllLogs).toHaveBeenCalledWith(HIDE_WARNINGS_DEFAULT)
    })
  })

  describe('toggleHideWarnings', () => {
    it('should toggle default value', async () => {
      AsyncStorage.getItem = jest.fn().mockResolvedValueOnce(null)
      await toggleHideWarnings()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_HIDE_WARNINGS_KEY)
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_HIDE_WARNINGS_KEY, 'false')
      expect(LogBox.ignoreAllLogs).toHaveBeenCalledWith(false)
    })

    it('should toggle with set value', async () => {
      AsyncStorage.getItem = jest.fn().mockResolvedValueOnce('false')
      await toggleHideWarnings()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_HIDE_WARNINGS_KEY)
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_HIDE_WARNINGS_KEY, 'true')
      expect(LogBox.ignoreAllLogs).toHaveBeenCalledWith(false)
    })

    it('should handle errors on failed parse of key', async () => {
      await toggleHideWarnings()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_HIDE_WARNINGS_KEY)
      expect(console.warn).toHaveBeenCalledWith('Failed to toggle hide-warnings preference:', expect.anything())
    })
  })

  describe('getHideWarningsPreference', () => {
    it('should return default preference', async () => {
      AsyncStorage.getItem = jest.fn().mockResolvedValueOnce(null)
      const preference = await getHideWarningsPreference()

      expect(preference).toEqual(HIDE_WARNINGS_DEFAULT)
    })

    it('should return set preference', async () => {
      AsyncStorage.getItem = jest.fn().mockResolvedValueOnce('false')
      const preference = await getHideWarningsPreference()

      expect(preference).toEqual(false)
    })

    it('should return default preference on failure to parse key', async () => {
      const preference = await getHideWarningsPreference()

      expect(preference).toEqual(HIDE_WARNINGS_DEFAULT)
    })
  })
})

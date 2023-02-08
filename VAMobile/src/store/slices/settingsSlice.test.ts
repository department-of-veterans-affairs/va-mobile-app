import AsyncStorage from '@react-native-async-storage/async-storage'
import { context, realStore } from 'testUtils'
import _ from 'underscore'
import { when } from 'jest-when'
import { loadHapticsSetting, updateHapticsSetting } from './settingsSlice'

const STORAGE_HAPTICS_KEY = '@store_settings_haptics'

const getItemMock = AsyncStorage.getItem as jest.Mock
when(getItemMock).calledWith(STORAGE_HAPTICS_KEY).mockResolvedValue(true)

context('settingsSlice', () => {
  describe('loadHapticsSetting', () => {
    it('should load value from AsyncStorage', async () => {
      const store = realStore()
      await store.dispatch(loadHapticsSetting())

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_HAPTICS_KEY)
    })

    it('should dispatch the correct action', async () => {
      const store = realStore()
      await store.dispatch(loadHapticsSetting())

      const actions = store.getActions()
      const action = _.find(actions, { type: 'settings/dispatchUpdateHaptics' })
      expect(action).toBeTruthy()
    })
  })

  describe('updateHapticsSetting', () => {
    it('should update AsyncStorage', async () => {
      const store = realStore()
      await store.dispatch(updateHapticsSetting(true))

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@store_settings_haptics', 'true')
    })

    it('should dispatch the correct action', async () => {
      const store = realStore()
      await store.dispatch(updateHapticsSetting(true))

      const actions = store.getActions()
      const action = _.find(actions, { type: 'settings/dispatchUpdateHaptics' })
      expect(action).toBeTruthy()

      expect(store.getStateField('settings', 'haptics')).toEqual(true)
    })
  })
})

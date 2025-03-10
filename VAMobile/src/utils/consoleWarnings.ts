import { LogBox } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'

export const STORAGE_HIDE_WARNINGS_KEY = '@hide_warnings'
export const HIDE_WARNINGS_DEFAULT = false

/**
 * Initializes the hide-warnings preference at app startup.
 * Reads the saved value from AsyncStorage and applies it to LogBox.
 */
export const initHideWarnings = async (): Promise<void> => {
  try {
    const storedVal = await AsyncStorage.getItem(STORAGE_HIDE_WARNINGS_KEY)
    const isHiding = storedVal !== null ? JSON.parse(storedVal) : HIDE_WARNINGS_DEFAULT
    LogBox.ignoreAllLogs(isHiding)
  } catch (error) {
    console.warn('Failed to load hide-warnings preference:', error)
    LogBox.ignoreAllLogs(HIDE_WARNINGS_DEFAULT)
  }
}

/**
 * Toggles the hide-warnings preference between true/false
 * and updates AsyncStorage & LogBox accordingly.
 */
export const toggleHideWarnings = async (): Promise<void> => {
  try {
    const storedVal = await AsyncStorage.getItem(STORAGE_HIDE_WARNINGS_KEY)
    const currentVal = storedVal !== null ? JSON.parse(storedVal) : HIDE_WARNINGS_DEFAULT
    const newVal = !currentVal

    await AsyncStorage.setItem(STORAGE_HIDE_WARNINGS_KEY, JSON.stringify(newVal))
    LogBox.ignoreAllLogs(newVal)
  } catch (error) {
    console.warn('Failed to toggle hide-warnings preference:', error)
  }
}

/**
 * Helper to retrieve the current preference from AsyncStorage.
 */
export const getHideWarningsPreference = async (): Promise<boolean> => {
  try {
    const storedVal = await AsyncStorage.getItem(STORAGE_HIDE_WARNINGS_KEY)
    return storedVal !== null ? JSON.parse(storedVal) : HIDE_WARNINGS_DEFAULT
  } catch {
    return HIDE_WARNINGS_DEFAULT
  }
}

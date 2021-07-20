import { NativeModules } from 'react-native'

const reviews = NativeModules.RNReviews

/**
 * Function requests the in-app review flow from the device's operating system
 * @returns promise<void>- empty promise
 */
export const requestReview = async (): Promise<void> => {
  await reviews.requestReview()
}

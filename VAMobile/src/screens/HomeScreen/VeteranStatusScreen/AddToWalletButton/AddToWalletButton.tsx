import React from 'react'
import { Platform } from 'react-native'

import { VeteranPassPayload } from 'api/wallet'
import AppleWalletButton from 'screens/HomeScreen/VeteranStatusScreen/AddToWalletButton/AppleWalletButton'
import GoogleWalletButton from 'screens/HomeScreen/VeteranStatusScreen/AddToWalletButton/GoogleWalletButton'

type Props = {
  payload: VeteranPassPayload
}

/**
 * Unified component that renders the appropriate wallet button based on platform
 * - iOS: Uses react-native-wallet-pass for native Apple Wallet integration
 * - Android: Uses web-based Google Wallet integration via URL
 */
export default function AddToWalletButton({ payload }: Props) {
  return Platform.OS === 'ios' ? <AppleWalletButton payload={payload} /> : <GoogleWalletButton payload={payload} />
}

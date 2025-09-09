import { useNetInfo } from '@react-native-community/netinfo'

export function useOfflineMode(): boolean {
  const { isConnected } = useNetInfo()
  return !!isConnected
}

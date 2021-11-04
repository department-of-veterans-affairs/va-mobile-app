import { useAppSelector } from './hooks'

/**
 * Provides a helper function to check if user has access to military information
 */
export const useHasMilitaryInformationAccess = (): boolean => {
  const { serviceHistory } = useAppSelector((s) => s.militaryService)
  const { militaryServiceHistory } = useAppSelector((state) => state.authorizedServices)
  return militaryServiceHistory && serviceHistory.length > 0
}

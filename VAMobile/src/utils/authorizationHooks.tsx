import { AuthorizedServicesState, MilitaryServiceState } from 'store/slices'
import { RootState } from 'store'
import { useSelector } from 'react-redux'

/**
 * Provides a helper function to check if user has access to military information
 */
export const useHasMilitaryInformationAccess = (): boolean => {
  const { serviceHistory } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const { militaryServiceHistory } = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)
  return militaryServiceHistory && serviceHistory.length > 0
}

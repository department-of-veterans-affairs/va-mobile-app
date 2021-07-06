import { AuthorizedServicesState, MilitaryServiceState, StoreState } from 'store'
import { useSelector } from 'react-redux'

/**
 * Provides a helper function to check if user has access to military information
 */
export const useHasMilitaryInformationAccess = (): boolean => {
  const { serviceHistory } = useSelector<StoreState, MilitaryServiceState>((s) => s.militaryService)
  const { militaryServiceHistory } = useSelector<StoreState, AuthorizedServicesState>((s) => s.authorizedServices)
  return militaryServiceHistory && serviceHistory.length > 0
}

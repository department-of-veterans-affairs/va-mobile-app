import { Facility, HealthData } from '../api'
import createReducer from './createReducer'

export type HealthState = HealthData & {
  cernerFacilities: Array<Facility> // filtered version of facilities where isCerner = true
  error?: Error
}

export const initialHealthState: HealthState = {
  isCernerPatient: false,
  facilities: [],
  cernerFacilities: [],
}

const initialState = initialHealthState

export default createReducer<HealthState>(initialState, {
  HEALTH_UPDATE: (state, { health = { ...initialHealthState }, error }) => {
    const cernerFacilities =
      health?.facilities.filter((f) => {
        return f.isCerner
      }) || []
    return {
      ...state,
      ...health,
      error: error,
      cernerFacilities,
    }
  },
  HEALTH_CLEAR: () => {
    return {
      ...initialHealthState,
    }
  },
})

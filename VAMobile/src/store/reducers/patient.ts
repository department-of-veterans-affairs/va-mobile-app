import { CernerData, Facility } from '../api'
import createReducer from './createReducer'

export type PatientState = CernerData & {
  cernerFacilities: Array<Facility> // filtered version of facilities where isCerner = true
  error?: Error
}

export const initialPatientState: PatientState = {
  isCernerPatient: false,
  facilities: [],
  cernerFacilities: [],
}

const initialState = initialPatientState

export default createReducer<PatientState>(initialState, {
  CERNER_UPDATE: (state, { cerner = { ...initialPatientState }, error }) => {
    const cernerFacilities =
      cerner?.facilities.filter((f) => {
        return f.isCerner
      }) || []

    return {
      ...state,
      ...cerner,
      error: error,
      cernerFacilities,
    }
  },
  CERNER_CLEAR: () => {
    return {
      ...initialPatientState,
    }
  },
})

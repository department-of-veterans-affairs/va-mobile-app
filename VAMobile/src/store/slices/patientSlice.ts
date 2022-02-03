import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { CernerData, Facility } from 'store/api'

export type PatientState = CernerData & {
  cernerFacilities: Array<Facility> // filtered version of facilities where isCerner = true
  error?: Error
}

export const initialPatientState: PatientState = {
  isCernerPatient: false,
  facilities: [],
  cernerFacilities: [],
}

/**
 * Redux slice that will create the actions and reducers
 */
const patientSlice = createSlice({
  name: 'patient',
  initialState: initialPatientState,
  reducers: {
    dispatchUpdateCerner: (state, action: PayloadAction<{ cerner?: CernerData; error?: Error }>) => {
      const { cerner, error } = action.payload
      const cernerFacilities =
        cerner?.facilities.filter((f) => {
          return f.isCerner && !!f.facilityName
        }) || []

      return {
        ...state,
        ...cerner,
        error: error,
        cernerFacilities,
      }
    },
    dispatchClearCerner: () => {
      return {
        ...initialPatientState,
      }
    },
  },
})

export const { dispatchClearCerner, dispatchUpdateCerner } = patientSlice.actions
export default patientSlice.reducer

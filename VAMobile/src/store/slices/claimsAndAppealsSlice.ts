import { createSlice } from '@reduxjs/toolkit'

import * as api from '../api'
import { AppThunk } from 'store'
import { ClaimDocUploadData } from 'store/api/types'
import { contentTypes } from 'store/api/api'

export type ClaimsAndAppealsState = {
  error?: Error
}

export const initialClaimsAndAppealsState: ClaimsAndAppealsState = {}

/**
 * Redux action to upload a file to a claim
 */
export const uploadFileToClaim =
  (claimID: string): AppThunk =>
  async () => {
    try {
      const formData = new FormData()
      await api.post<ClaimDocUploadData>(`/v0/claim/${claimID}/documents`, formData as unknown as api.Params, contentTypes.multipart)
    } catch {}
  }

/**
 * Redux slice that will create the actions and reducers
 */
const claimsAndAppealsSlice = createSlice({
  name: 'claimsAndAppeals',
  initialState: initialClaimsAndAppealsState,
  reducers: {
    dispatchClearLoadedClaimsAndAppeals: () => {
      return { ...initialClaimsAndAppealsState }
    },
  },
})

export const { dispatchClearLoadedClaimsAndAppeals } = claimsAndAppealsSlice.actions
export default claimsAndAppealsSlice.reducer

import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type AuthState = {
  loading: boolean
  loggedIn: boolean
  loggingOut: boolean
  syncing: boolean
  displayBiometricsPreferenceScreen: boolean
}

export const initialAuthState: AuthState = {
  loading: false,
  loggedIn: false,
  loggingOut: false,
  syncing: false,
  displayBiometricsPreferenceScreen: true,
}

/**
 * Redux slice that will create the actions and reducers
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    dispatchUpdateLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    dispatchUpdateLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload
    },
    dispatchUpdateLoggingOut: (state, action: PayloadAction<boolean>) => {
      state.loggingOut = action.payload
    },
    dispatchUpdateSyncing: (state, action: PayloadAction<boolean>) => {
      state.syncing = action.payload
    },
    dispatchUpdateDisplayBiometricsPreferenceScreen: (state, action: PayloadAction<boolean>) => {
      state.displayBiometricsPreferenceScreen = action.payload
    },
  },
})

export const {
  dispatchUpdateLoading,
  dispatchUpdateLoggedIn,
  dispatchUpdateLoggingOut,
  dispatchUpdateSyncing,
  dispatchUpdateDisplayBiometricsPreferenceScreen,
} = authSlice.actions
export default authSlice.reducer

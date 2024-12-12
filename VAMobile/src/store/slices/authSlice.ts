import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type AuthState = {
  loadingRefreshToken: boolean
  loading: boolean
  loggedIn: boolean
  loggingOut: boolean
  syncing: boolean
  displayBiometricsPreferenceScreen: boolean
  enablePostLogin: boolean
}

export const initialAuthState: AuthState = {
  loadingRefreshToken: false,
  loading: false,
  loggedIn: false,
  loggingOut: false,
  syncing: false,
  displayBiometricsPreferenceScreen: true,
  enablePostLogin: true,
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
    dispatchUpdateLoadingRefreshToken: (state, action: PayloadAction<boolean>) => {
      state.loadingRefreshToken = action.payload
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
    dispatchUpdateEnablePostLogin: (state, action: PayloadAction<boolean>) => {
      state.enablePostLogin = action.payload
    },
  },
})

export const {
  dispatchUpdateLoadingRefreshToken,
  dispatchUpdateLoading,
  dispatchUpdateLoggedIn,
  dispatchUpdateLoggingOut,
  dispatchUpdateSyncing,
  dispatchUpdateDisplayBiometricsPreferenceScreen,
  dispatchUpdateEnablePostLogin,
} = authSlice.actions
export default authSlice.reducer

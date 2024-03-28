import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'

import accessabilityReducer from 'store/slices/accessibilitySlice'
import analyticsReducer from 'store/slices/analyticsSlice'
import appointmentsReducer from 'store/slices/appointmentsSlice'
import authReducer from 'store/slices/authSlice'
import demoReducer from 'store/slices/demoSlice'
import errorReducer from 'store/slices/errorSlice'
import secureMessagingReducer from 'store/slices/secureMessagingSlice'
import settingsReducer from 'store/slices/settingsSlice'
import snackbarReducer from 'store/slices/snackBarSlice'

// Creates the store
const store = configureStore({
  reducer: {
    auth: authReducer,
    accessibility: accessabilityReducer,
    demo: demoReducer,
    errors: errorReducer,
    analytics: analyticsReducer,
    appointments: appointmentsReducer,
    secureMessaging: secureMessagingReducer,
    snackBar: snackbarReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type ReduxToolkitStore = typeof store

//creates the typed dispatch to work with the thunk actions
export type AppDispatch = typeof store.dispatch

// creates the types root state
export type RootState = ReturnType<typeof store.getState>

// creates the types thunk action creator
export type AppThunk<ReturnType = Promise<void>> = ThunkAction<ReturnType, RootState, undefined, Action<string>>

export default store

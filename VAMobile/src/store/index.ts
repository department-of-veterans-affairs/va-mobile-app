import { AnyAction, ThunkAction, configureStore } from '@reduxjs/toolkit'
import accessabilityReducer from 'store/slices/accessibilitySlice'
import analyticsReducer from 'store/slices/analyticsSlice'
import appointmentsReducer from 'store/slices/appointmentsSlice'
import authReducer from 'store/slices/authSlice'
import claimsAndAppealsReducer from 'store/slices/claimsAndAppealsSlice'
import decisionLettersReducer from 'store/slices/decisionLettersSlice'
import demoReducer from 'store/slices/demoSlice'
import directDepositReducer from 'store/slices/directDepositSlice'
import disabilityRatingReducer from 'store/slices/disabilityRatingSlice'
import errorReducer from 'store/slices/errorSlice'
import lettersReducer from 'store/slices/lettersSlice'
import militaryServiceReducer from 'store/slices/militaryServiceSlice'
import notificationReducer from 'store/slices/notificationSlice'
import paymentsReducer from 'store/slices/paymentsSlice'
import prescriptionsReducer from 'store/slices/prescriptionSlice'
import secureMessagingReducer from 'store/slices/secureMessagingSlice'
import settingsReducer from 'store/slices/settingsSlice'
import snackbarReducer from 'store/slices/snackBarSlice'
import vaccineReducer from 'store/slices/vaccineSlice'

// Creates the store
const store = configureStore({
  reducer: {
    auth: authReducer,
    accessibility: accessabilityReducer,
    demo: demoReducer,
    errors: errorReducer,
    analytics: analyticsReducer,
    appointments: appointmentsReducer,
    claimsAndAppeals: claimsAndAppealsReducer,
    directDeposit: directDepositReducer,
    disabilityRating: disabilityRatingReducer,
    decisionLetters: decisionLettersReducer,
    letters: lettersReducer,
    militaryService: militaryServiceReducer,
    notifications: notificationReducer,
    secureMessaging: secureMessagingReducer,
    snackBar: snackbarReducer,
    vaccine: vaccineReducer,
    payments: paymentsReducer,
    prescriptions: prescriptionsReducer,
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
export type AppThunk<ReturnType = Promise<void>> = ThunkAction<ReturnType, RootState, unknown, AnyAction>

export default store

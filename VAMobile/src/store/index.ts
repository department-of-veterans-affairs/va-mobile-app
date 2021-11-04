import { AnyAction, ThunkAction, configureStore } from '@reduxjs/toolkit'

import accessabilityReducer from './slices/accessibilitySlice'
import analyticsReducer from './slices/analyticsSlice'
import appointmentsReducer from './slices/appointmentsSlice'
import authReducer from './slices/authSlice'
import authorizedServicesReducer from './slices/authorizedServicesSlice'
import claimsAndAppealsReducer from './slices/claimsAndAppealsSlice'
import demoReducer from './slices/demoSlice'
import directDepositReducer from './slices/directDepositSlice'
import disabilityRatingReducer from './slices/disabilityRatingSlice'
import errorReducer from './slices/errorSlice'
import lettersReducer from './slices/lettersSlice'
import logger from 'redux-logger'
import militaryServiceReducer from './slices/militaryServiceSlice'
import notificationReducer from './slices/notificationSlice'
import patientReducer from './slices/patientSlice'
import personalInformationReducer from './slices/personalInformationSlice'
import secureMessagingReducer from './slices/secureMessagingSlice'

// Creates the store
const store = configureStore({
  reducer: {
    auth: authReducer,
    accessability: accessabilityReducer,
    demo: demoReducer,
    personalInformation: personalInformationReducer,
    authorizedServices: authorizedServicesReducer,
    error: errorReducer,
    analytics: analyticsReducer,
    appointments: appointmentsReducer,
    claimsAndAppeals: claimsAndAppealsReducer,
    directDeposit: directDepositReducer,
    disabilityRating: disabilityRatingReducer,
    letters: lettersReducer,
    militaryService: militaryServiceReducer,
    notifications: notificationReducer,
    patient: patientReducer,
    secureMessaging: secureMessagingReducer,
  },
  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare({ serializableCheck: false }).concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
})

//creates the typed dispatch to work with the thunk actions
export type AppDispatch = typeof store.dispatch

// creates the types root state
export type RootState = ReturnType<typeof store.getState>

// creates the types thunk action creator
export type AppThunk<ReturnType = Promise<void>> = ThunkAction<ReturnType, RootState, unknown, AnyAction>

export default store

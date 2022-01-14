import { AnyAction, ThunkAction, configureStore } from '@reduxjs/toolkit'
import { allReducers } from './slices'
import logger from 'redux-logger'

// Creates the store
const store = configureStore({
  reducer: {
    ...allReducers,
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

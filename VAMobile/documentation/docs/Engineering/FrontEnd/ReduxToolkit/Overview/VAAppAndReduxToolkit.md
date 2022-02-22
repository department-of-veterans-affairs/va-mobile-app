# VA App and Redux Toolkit

## Why Redux Toolkit

The reasons the VA mobile team decided to move to Redux toolkit from the regular Redux implementation are:

- Redux Toolkit is the new modern way of writing Redux and is the new standard which most Redux's guides and documentation are moving to or suggesting to use.
- The standard Redux has too much boiler plate and to add a new state you have to modify or add files in many different locations. With Redux Toolkit everything is in one file.
- With Redux Toolkit we have devtools for debugging and the thunk middleware out of the box without extra configurations.


## VA App Redux Architectures
This section will show the difference from using the standard Redux and Redux Toolkit in our VA App. We will be using the disability rating as an example.

### With Standard Redux (older implementation)
**Folder Structure:** With the standard Redux you would need three folders actions, reducers, and types. To add a new state you would have to add a file in each of those different sections.

![Standard Redux Folders](/img/redux/standard_redux_folders_struct.png)

**Actions Folder:** Here is where the actions file would go. The action file would define the sync and async actions for a feature. Also the created file would need to be added to the actions index file.

![Standard Redux Action Folder](/img/redux/standard_redux_actions_folder.png)

``` jsx title="/src/store/actions/disabilityRating.ts
import * as api from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { RatingData, ScreenIDTypes } from '../api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from 'utils/common'

/**
 * Redux action to start disability ratings fetch
 *
 * @returns ReduxAction
 */
const dispatchStartGetRating = (): ReduxAction => {
  return {
    type: 'DISABILITY_RATING_START_GET_RATING',
    payload: {},
  }
}

/**
 * Redux action to set disability ratings data or error after fetch
 *
 * @returns ReduxAction
 */
const dispatchFinishGetRating = (ratingData?: RatingData, error?: Error): ReduxAction => {
  return {
    type: 'DISABILITY_RATING_FINISH_GET_RATING',
    payload: {
      ratingData,
      error,
    },
  }
}

/**
 * Redux action to reset disability ratings on logout
 *
 * @returns ReduxAction
 */
export const dispatchDisabilityRatingLogout = (): ReduxAction => {
  return {
    type: 'DISABILITY_RATING_ON_LOGOUT',
    payload: {},
  }
}

/**
 * Redux action to get the users disability ratings
 *
 * @returns AsyncReduxAction
 */
export const getDisabilityRating = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getDisabilityRating(screenID))))

    try {
      dispatch(dispatchStartGetRating())
      const ratingData = await api.get<api.DisabilityRatingData>('/v0/disability-rating')

      dispatch(dispatchFinishGetRating(ratingData?.data.attributes))
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishGetRating(undefined, err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
      }
    }
  }
}
```

```jsx title="/src/store/actions/index.ts
export * from './auth'
export * from './directDeposit'
export * from './disabilityRating'
```

**Reducers Folder:** Here is where the reducer file would go. The reducer file would define the initial state and reducer functions for a feature. Also the created file would need to be added to the reducers index file.

![Standard Redux Reducers Folder](/img/redux/standard_redux_reducers_folder.png)

``` jsx title="/src/store/reducers/disabilityRating.ts
import { RatingData } from 'store/api'
import createReducer from './createReducer'

export type DisabilityRatingState = {
  ratingData?: RatingData
  error?: Error
  loading: boolean
  needsDataLoad: boolean
  preloadComplete: boolean
}

export const initialDisabilityRatingState: DisabilityRatingState = {
  loading: false,
  needsDataLoad: true,
  preloadComplete: false,
}

export default createReducer<DisabilityRatingState>(initialDisabilityRatingState, {
  DISABILITY_RATING_START_GET_RATING: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  DISABILITY_RATING_FINISH_GET_RATING: (state, { ratingData, error }) => {
    return {
      ...state,
      error,
      ratingData,
      needsDataLoad: error ? true : false,
      preloadComplete: true,
      loading: false,
    }
  },
  DISABILITY_RATING_ON_LOGOUT: (_state, _payload) => {
    return {
      ...initialDisabilityRatingState,
    }
  },
})
```

``` jsx title="/src/store/reducers/index.ts
import { combineReducers } from 'redux'
import { ReduxAction } from 'store/types'
import auth, { AuthState, initialAuthState } from './auth'
import directDeposit, { DirectDepositState, initialDirectDepositState } from './directDeposit'
import disabilityRating, { DisabilityRatingState, initialDisabilityRatingState } from './disabilityRating'

export * from './auth'
export * from './directDeposit'
export * from './disabilityRating'

export interface StoreState {
  auth: AuthState
  directDeposit: DirectDepositState
  disabilityRating: DisabilityRatingState
}

export const InitialState: StoreState = {
  auth: initialAuthState,
  directDeposit: initialDirectDepositState,
  disabilityRating: initialDisabilityRatingState,
}

const allReducers = combineReducers<StoreState, ReduxAction>({
  auth,
  directDeposit,
  disabilityRating,
})

export default allReducers

```

**Types Folder:** Here is where the type file would go. The type file would define the action's payload type and action creators definitions. Also the created file would need to be added to the types index file.

![Standard Redux Types Folder](/img/redux/standard_redux_types_folder.png)

``` jsx title="/src/store/types/disabilityRating.ts
import { ActionDef, EmptyPayload } from './index'
import { RatingData } from 'store/api'

/**
 * Redux payload for DISABILITY_RATING_START_GET_RATING action
 */
export type DisabilityRatingStartGetRatingPayload = Record<string, unknown>

/**
 *  Redux payload for DISABILITY_RATING_FINISH_GET_RATING action
 */
export type DisabilityRatingPayload = {
  ratingData?: RatingData
  error?: Error
}

/**
 *  All disability rating actions
 */
export interface DisabilityRatingActions {
  /** Redux action to signify the initial start of getting the disablity rating*/
  DISABILITY_RATING_START_GET_RATING: ActionDef<'DISABILITY_RATING_START_GET_RATING', DisabilityRatingPayload>
  /** Redux action to signify that the disability rating is being retrieved */
  DISABILITY_RATING_FINISH_GET_RATING: ActionDef<'DISABILITY_RATING_FINISH_GET_RATING', DisabilityRatingPayload>
  /** Redux action to clear disability rating data on logout **/
  DISABILITY_RATING_ON_LOGOUT: ActionDef<'DISABILITY_RATING_ON_LOGOUT', EmptyPayload>
}
```

``` jsx title="/src/store/types/index.ts
import { ThunkAction } from 'redux-thunk'

import { AuthActions } from './auth'
import { DirectDepositActions } from './directDeposit'
import { DisabilityRatingActions } from './disabilityRating'

export * from './auth'
export * from './directDeposit'
export * from './disabilityRating'

type ActObjs<T extends keyof AllActionDefs> = AllActionDefs[T]
type ActObjsPayload<T extends keyof AllActionDefs> = AllActionDefs[T]['payload']

export interface ActionDef<T extends string, P extends ActObjsPayload<AllActionTypes>> {
  type: T
  payload: P
}

export type EmptyPayload = unknown

export type StoreStateFn = () => StoreState

export type AllActionDefs = AuthActions &
  DirectDepositActions &
  DisabilityRatingActions 

type AllActionTypes = keyof AllActionDefs

export type ReduxAction = ActObjs<AllActionTypes>

export type AsyncReduxAction = ThunkAction<Promise<void>, StoreState, undefined, ReduxAction>
```

**Store File:** Here is where the store would be configured.

``` jsx title="/src/store/index.tsx
import { ReduxAction } from './types'
import { Store, applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import rootReducer, { StoreState } from './reducers'
import thunk from 'redux-thunk'

export * from './reducers'
export * from './actions'
export * from './types'

const configureStore = (state?: StoreState): Store<StoreState, ReduxAction> => {
  const middleware = applyMiddleware(thunk, logger)

  return createStore(rootReducer, state, middleware) as Store<StoreState, ReduxAction>
}

export default configureStore
```

### With Redux Toolkit (current implementation)
**Folder Structure:** With Redux Toolkit you would need one folder slices. To add a new state you would have to add one file to the slices folder.

![Redux Toolkit Folders](/img/redux/redux_toolkit_folder_struct.png)

**Slices Folder:** Here is where you will define your slice file. This file is where everything will be added. With redux toolkit actions creators, types and reducers are created for you in the slice. Also the creted file needs to be added to the slices index file.

![Redux Toolkit Slices Folder](/img/redux/redux_toolkit_slices_folder.png)

``` jsx title="/src/store/slices/disabilityRatingSlice.ts
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as api from 'store/api'
import { AppThunk } from 'store'
import { RatingData, ScreenIDTypes } from 'store/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from 'utils/common'

export type DisabilityRatingState = {
  ratingData?: RatingData
  error?: Error
  loading: boolean
  needsDataLoad: boolean
  preloadComplete: boolean
}

export const initialDisabilityRatingState: DisabilityRatingState = {
  loading: false,
  needsDataLoad: true,
  preloadComplete: false,
}

/**
 * Redux action to get the users disability ratings
 */
export const getDisabilityRating =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getDisabilityRating(screenID))))

    try {
      dispatch(dispatchStartGetRating())
      const ratingData = await api.get<api.DisabilityRatingData>('/v0/disability-rating')

      dispatch(dispatchFinishGetRating({ ratingData: ratingData?.data.attributes }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetRating({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux slice that will create the actions and reducers
 */
const disabilitRatingSlice = createSlice({
  name: 'disabilityRating',
  initialState: initialDisabilityRatingState,
  reducers: {
    dispatchStartGetRating: (state) => {
      state.loading = true
    },

    dispatchFinishGetRating: (state, action: PayloadAction<{ ratingData?: RatingData; error?: Error }>) => {
      const { ratingData, error } = action.payload
      state.ratingData = ratingData
      state.error = error
      state.needsDataLoad = error ? true : false
      state.preloadComplete = true
      state.loading = false
    },

    dispatchDisabilityRatingLogout: () => {
      return { ...initialDisabilityRatingState }
    },
  },
})

export const { dispatchDisabilityRatingLogout, dispatchFinishGetRating, dispatchStartGetRating } = disabilitRatingSlice.actions
export default disabilitRatingSlice.reducer
```

``` jsx title="/src/store/slices/index.tsx
import { RootState } from 'store'
import { initialAuthState } from 'store/slices/authSlice'
import { initialDirectDepositState } from 'store/slices/directDepositSlice'
import { initialDisabilityRatingState } from 'store/slices/disabilityRatingSlice'

export * from './authSlice'
export * from './directDepositSlice'
export * from './disabilityRatingSlice'

export const InitialState: RootState = {
  auth: initialAuthState,
  directDeposit: initialDirectDepositState,
  disabilityRating: initialDisabilityRatingState,
}
```

**Store File:** Here is where the store would be configured.

``` jsx title="/src/store/index.tsx
import { AnyAction, ThunkAction, configureStore } from '@reduxjs/toolkit'
import authReducer from 'store/slices/authSlice'
import directDepositReducer from 'store/slices/directDepositSlice'
import disabilityRatingReducer from 'store/slices/disabilityRatingSlice'

// Creates the store
const store = configureStore({
  reducer: {
    auth: authReducer,
    directDeposit: directDepositReducer,
    disabilityRating: disabilityRatingReducer,
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
```


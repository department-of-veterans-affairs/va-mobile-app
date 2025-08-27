# Redux Toolkit Overview

## Purpose

The **Redux Toolkit** package was built with the intention on being the standard way of writing Redux logic. It was mainly created to help address the three common concerns of Redux.

- "Configuring a Redux store is too complicated"
- "I have to add a lot of packages to get Redux to do anything useful"
- "Redux requires too much boilerplate code"


## Benefits

Some benefits of using **Redux Toolkit** are:

- **Simple :**  Includes utilities to simplify common use cases like store setup, creating reducers, immutable update logic, and more.
- **Opinionated :**  Provides good defaults for store setup out of the box, and includes the most commonly used Redux addons built-in.
- **Powerful :**  Takes inspiration from libraries like Immer and Autodux to let you write "mutative" immutable update logic, and even create entire "slices" of state automatically.
- **Effective :**  Lets you focus on the core logic your app needs, so you can do more work with less code.


More information on the purpose and installation of Redux Toolkit can be found on their [page](https://redux-toolkit.js.org/introduction/getting-started).

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

# Add a New Feature State

## Intro
This tutorial will consists of adding a new Redux state for the military service feature. This will be the same steps for adding any new Redux state to the VA mobile app.

## Creating the Slice File
1. Right click the slice folder **(src/store/slice)** and select new file.

   ![Create Slice File](/img/redux/create_slice_file.png)

2. Enter the name of the file **[your file name]Slice.ts**. Example: (militaryServiceSlice.ts)

   ![Create Slice File](/img/redux/military_service_slice_file.png)

3. Add the Redux toolkit import to the created slice file.

    ```jsx title="/src/store/slices/militaryServiceSlice.ts"
    import { PayloadAction, createSlice } from '@reduxjs/toolkit'
    ```

4. Add the Redux initial state.
    ```jsx title="/src/store/slices/militaryServiceSlice.ts"
    import { PayloadAction, createSlice } from '@reduxjs/toolkit'

    export type MilitaryServiceState = {
    serviceHistory: api.ServiceHistoryData
    loading: boolean
    error?: Error
    mostRecentBranch?: string
    needsDataLoad: boolean
    preloadComplete: boolean
    }

    export const initialMilitaryServiceState: MilitaryServiceState = {
    serviceHistory: [] as api.ServiceHistoryData,
    loading: false,
    needsDataLoad: true,
    preloadComplete: false,
    }
    ```

5. Create the Redux slice and add the initial state created in the previouse step to the create slice function.
     ```jsx title="/src/store/slices/militaryServiceSlice.ts"
    import { PayloadAction, createSlice } from '@reduxjs/toolkit'

    export type MilitaryServiceState = {
    serviceHistory: api.ServiceHistoryData
    loading: boolean
    error?: Error
    mostRecentBranch?: string
    needsDataLoad: boolean
    preloadComplete: boolean
    }

    export const initialMilitaryServiceState: MilitaryServiceState = {
    serviceHistory: [] as api.ServiceHistoryData,
    loading: false,
    needsDataLoad: true,
    preloadComplete: false,
    }

    const militaryServiceSlice = createSlice({
        name: 'militaryService',
        initialState: initialMilitaryServiceState,
        reducers: {
        
        },
    })
    ```

6. Add the reducers that will be updating the state. The name that you give to the reducer will be the same name the action creator and type is going to use typescript will infere that name.

    ```jsx title="/src/store/slices/militaryServiceSlice.ts"
    import { PayloadAction, createSlice } from '@reduxjs/toolkit'

    export type MilitaryServiceState = {
    serviceHistory: api.ServiceHistoryData
    loading: boolean
    error?: Error
    mostRecentBranch?: string
    needsDataLoad: boolean
    preloadComplete: boolean
    }

    export const initialMilitaryServiceState: MilitaryServiceState = {
    serviceHistory: [] as api.ServiceHistoryData,
    loading: false,
    needsDataLoad: true,
    preloadComplete: false,
    }

    const militaryServiceSlice = createSlice({
        name: 'militaryService',
        initialState: initialMilitaryServiceState,
        reducers: {
            dispatchStartGetHistory: (state) => {
                state.loading = true
            },

            dispatchFinishGetHistory: (state, action: PayloadAction<{ serviceHistory?: api.ServiceHistoryData; error?: Error }>) => {
                const { serviceHistory, error } = action.payload
                const history = serviceHistory || state.serviceHistory

                const latestHistory = max(history, (historyItem) => {
                    return getDateFromString(historyItem.endDate)
                }) as ServiceData

                return {
                    ...state,
                    error,
                    mostRecentBranch: latestHistory?.branchOfService,
                    serviceHistory: history,
                    loading: false,
                    needsDataLoad: !!error,
                    preloadComplete: true,
                }
            },
        },
    })
    ```
   :::info
   The **PayloadAction** param only takes one value if you need to pass more than one param use an object as above. Also the reducer functions created inside the slice uses the **[Immer package](https://immerjs.github.io/immer/)**. Which allows you to write mutated code as the **dispatchStartGetHistory** reducer function above. You can also return an immutable object as the **dispatchFinishGetHistory** function above. Here is more information on what you can do with immer inside the reducer functions **[Redux Immer Page](https://redux-toolkit.js.org/usage/immer-reducers)**
   :::

7. Export the reducer and actions to be used in other files or async Redux function.

     ```jsx title="/src/store/slices/militaryServiceSlice.ts"
    import { PayloadAction, createSlice } from '@reduxjs/toolkit'

    export type MilitaryServiceState = {
    serviceHistory: api.ServiceHistoryData
    loading: boolean
    error?: Error
    mostRecentBranch?: string
    needsDataLoad: boolean
    preloadComplete: boolean
    }

    export const initialMilitaryServiceState: MilitaryServiceState = {
    serviceHistory: [] as api.ServiceHistoryData,
    loading: false,
    needsDataLoad: true,
    preloadComplete: false,
    }

    const militaryServiceSlice = createSlice({
        name: 'militaryService',
        initialState: initialMilitaryServiceState,
        reducers: {
            dispatchStartGetHistory: (state) => {
                state.loading = true
            },

            dispatchFinishGetHistory: (state, action: PayloadAction<{ serviceHistory?: api.ServiceHistoryData; error?: Error }>) => {
                const { serviceHistory, error } = action.payload
                const history = serviceHistory || state.serviceHistory

                const latestHistory = max(history, (historyItem) => {
                    return getDateFromString(historyItem.endDate)
                }) as ServiceData

                return {
                    ...state,
                    error,
                    mostRecentBranch: latestHistory?.branchOfService,
                    serviceHistory: history,
                    loading: false,
                    needsDataLoad: !!error,
                    preloadComplete: true,
                }
            },
        },
    })

    export const { dispatchFinishGetHistory, dispatchMilitaryHistoryLogout, dispatchStartGetHistory } = militaryServiceSlice.actions
    export default militaryServiceSlice.reducer
    ```

8. Add the async function that will fetch the data from the server and call the actions. Here we are adding the **getServiceHistory** async thunk function.

      ```jsx title="/src/store/slices/militaryServiceSlice.ts"
    import { PayloadAction, createSlice } from '@reduxjs/toolkit'

    export type MilitaryServiceState = {
    serviceHistory: api.ServiceHistoryData
    loading: boolean
    error?: Error
    mostRecentBranch?: string
    needsDataLoad: boolean
    preloadComplete: boolean
    }

    export const initialMilitaryServiceState: MilitaryServiceState = {
    serviceHistory: [] as api.ServiceHistoryData,
    loading: false,
    needsDataLoad: true,
    preloadComplete: false,
    }

    /**
     * Redux action to get service history for user
    */
    export const getServiceHistory =
    (screenID?: ScreenIDTypes): AppThunk =>
    async (dispatch) => {
        dispatch(dispatchClearErrors(screenID))
        dispatch(dispatchSetTryAgainFunction(() => dispatch(getServiceHistory(screenID))))

        try {
        dispatch(dispatchStartGetHistory())
        const mshData = await api.get<api.MilitaryServiceHistoryData>('/v0/military-service-history')

        dispatch(dispatchFinishGetHistory({ serviceHistory: mshData?.data.attributes.serviceHistory }))
        } catch (error) {
        if (isErrorObject(error)) {
            dispatch(dispatchFinishGetHistory({ error }))
            dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
        }
        }
    }

    const militaryServiceSlice = createSlice({
        name: 'militaryService',
        initialState: initialMilitaryServiceState,
        reducers: {
            dispatchStartGetHistory: (state) => {
                state.loading = true
            },

            dispatchFinishGetHistory: (state, action: PayloadAction<{ serviceHistory?: api.ServiceHistoryData; error?: Error }>) => {
                const { serviceHistory, error } = action.payload
                const history = serviceHistory || state.serviceHistory

                const latestHistory = max(history, (historyItem) => {
                    return getDateFromString(historyItem.endDate)
                }) as ServiceData

                return {
                    ...state,
                    error,
                    mostRecentBranch: latestHistory?.branchOfService,
                    serviceHistory: history,
                    loading: false,
                    needsDataLoad: !!error,
                    preloadComplete: true,
                }
            },
        },
    })

    export const { dispatchFinishGetHistory, dispatchMilitaryHistoryLogout, dispatchStartGetHistory } = militaryServiceSlice.actions
    export default militaryServiceSlice.reducer
    ```

   :::info
   The **getServiceHistory** is a thunk async function which will give you two params (dispatch, getState). The **dispatch** is what will be use to call the actions. The **getState** is if you need to pull any value from the current Redux store state.
   :::


## Adding the Exported Reducer to the Store

1. Open the store file **(src/store/index.ts)** and import the exported reducer from the created slice above. And add it to the reducer object in the **configureStore** function.

    ```jsx title="/src/store/index.ts"
    import { AnyAction, ThunkAction, configureStore } from '@reduxjs/toolkit'
    import accessabilityReducer from 'store/slices/accessibilitySlice'
    import militaryServiceReducer from 'store/slices/militaryServiceSlice'

    // Creates the store
    const store = configureStore({
    reducer: {
        accessibility: accessabilityReducer,
        militaryService: militaryServiceReducer,
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
    ```

## Adding to the Slices Folder Index.ts File.

1. Open the slices folder index.ts file **(src/store/slices/index.ts)**. Here you are going to add the initialState export and a export everything for the slice created above.

    ```jsx title="/src/store/index.ts"
    import { RootState } from 'store'

    import { initialAccessibilityState } from 'store/slices/accessibilitySlice'
    import { initialMilitaryServiceState } from 'store/slices/militaryServiceSlice'

    export * from './accessibilitySlice'
    export * from './militaryServiceSlice'

    export const InitialState: RootState = {
        militaryService: initialMilitaryServiceState,
        accessibility: initialAccessibilityState,
    }
    ```

## Using the Slice In a Component

This section will show you how to retrieve the state and dispatch any thunk function in a component.

```jsx title="src/screens/ProfileScreen/MilitaryInformationScreen/MilitaryInformationScreen.tsx"
import { MilitaryServiceState, getServiceHistory } from 'store/slices/militaryServiceSlice'
import { RootState } from 'store'
import { useAppDispatch } from 'utils/hooks'
import { useSelector } from 'react-redux'

const MilitaryInformationScreen: FC = () => {
const dispatch = useAppDispatch()
const { serviceHistory, loading, needsDataLoad } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)

useEffect(() => {
    if (needsDataLoad && militaryInfoAuthorization && mhNotInDowntime) {
    dispatch(getServiceHistory(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID))
    }
}, [dispatch, needsDataLoad, militaryInfoAuthorization, mhNotInDowntime])

const historyItems: Array<DefaultListItemObj> = map(serviceHistory, (service: ServiceData) => {
    const branch = t('militaryInformation.branch', { branch: service.branchOfService })

    const textLines: Array<TextLine> = [
    {
        text: branch,
        variant: 'MobileBodyBold',
        color: 'primaryTitle',
    },
    {
        text: t('militaryInformation.history', { begin: service.formattedBeginDate, end: service.formattedEndDate }),
    },
    ]
    return {
    textLines,
    testId: `${branch} ${t('militaryInformation.historyA11yLabel', {
        begin: service.formattedBeginDate,
        end: service.formattedEndDate,
    })}`,
    }
})

return (
    <VAScrollView {...testIdProps('Military-Information-page')}>
    <Box mb={theme.dimensions.standardMarginBetween}>
        <DefaultList items={historyItems} title={t('militaryInformation.periodOfService')} />
    </Box>
    <TextView {...linkProps}>{t('militaryInformation.incorrectServiceInfo')}</TextView>
    </VAScrollView>
)
}

export default MilitaryInformationScreen
```
:::info
To dispatch an action in a component use the **useAppDispatch** hook from the src/utils/hook.tsx file. To get the current state value for the slice use **useSelector** function from Redux as shown above.
:::

# Updating or Adding to an Existing Feature State

## Intro
This tutorial will consists of adding state to an existing feature state.

## Adding a New State
Here we are going to add a new reducer to clear the data on logout to the existing militaryServiceSlice.ts.

**Current Slice Code**
```jsx title="/src/store/slices/militaryServiceSlice.ts"
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as api from 'store/api'
import { AppThunk } from 'store'
import { ScreenIDTypes, ServiceData } from '../api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getDateFromString } from 'utils/formattingUtils'
import { isErrorObject } from 'utils/common'
import { max } from 'underscore'

export type MilitaryServiceState = {
  serviceHistory: api.ServiceHistoryData
  loading: boolean
  error?: Error
  mostRecentBranch?: string
  needsDataLoad: boolean
  preloadComplete: boolean
}

export const initialMilitaryServiceState: MilitaryServiceState = {
  serviceHistory: [] as api.ServiceHistoryData,
  loading: false,
  needsDataLoad: true,
  preloadComplete: false,
}

/**
 * Redux action to get service history for user
 */
export const getServiceHistory =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getServiceHistory(screenID))))

    try {
      dispatch(dispatchStartGetHistory())
      const mshData = await api.get<api.MilitaryServiceHistoryData>('/v0/military-service-history')

      dispatch(dispatchFinishGetHistory({ serviceHistory: mshData?.data.attributes.serviceHistory }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetHistory({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux slice that will create the actions and reducers
 */
const militaryServiceSlice = createSlice({
  name: 'militaryService',
  initialState: initialMilitaryServiceState,
  reducers: {
    dispatchStartGetHistory: (state) => {
      state.loading = true
    },

    dispatchFinishGetHistory: (state, action: PayloadAction<{ serviceHistory?: api.ServiceHistoryData; error?: Error }>) => {
      const { serviceHistory, error } = action.payload
      const history = serviceHistory || state.serviceHistory

      const latestHistory = max(history, (historyItem) => {
        return getDateFromString(historyItem.endDate)
      }) as ServiceData

      return {
        ...state,
        error,
        mostRecentBranch: latestHistory?.branchOfService,
        serviceHistory: history,
        loading: false,
        needsDataLoad: !!error,
        preloadComplete: true,
      }
    },
  },
})

export const { dispatchFinishGetHistory, dispatchStartGetHistory } = militaryServiceSlice.actions
export default militaryServiceSlice.reducer
```

**Code after adding the logout reducer**

Here we added the **dispatchMilitaryHistoryLogout** reducer function which we will extract an action to be dispatch on the logout Redux thunk.

```jsx title="/src/store/slices/militaryServiceSlice.ts"
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as api from 'store/api'
import { AppThunk } from 'store'
import { ScreenIDTypes, ServiceData } from '../api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getDateFromString } from 'utils/formattingUtils'
import { isErrorObject } from 'utils/common'
import { max } from 'underscore'

export type MilitaryServiceState = {
  serviceHistory: api.ServiceHistoryData
  loading: boolean
  error?: Error
  mostRecentBranch?: string
  needsDataLoad: boolean
  preloadComplete: boolean
}

export const initialMilitaryServiceState: MilitaryServiceState = {
  serviceHistory: [] as api.ServiceHistoryData,
  loading: false,
  needsDataLoad: true,
  preloadComplete: false,
}

/**
 * Redux action to get service history for user
 */
export const getServiceHistory =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getServiceHistory(screenID))))

    try {
      dispatch(dispatchStartGetHistory())
      const mshData = await api.get<api.MilitaryServiceHistoryData>('/v0/military-service-history')

      dispatch(dispatchFinishGetHistory({ serviceHistory: mshData?.data.attributes.serviceHistory }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetHistory({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux slice that will create the actions and reducers
 */
const militaryServiceSlice = createSlice({
  name: 'militaryService',
  initialState: initialMilitaryServiceState,
  reducers: {
    dispatchStartGetHistory: (state) => {
      state.loading = true
    },

    dispatchFinishGetHistory: (state, action: PayloadAction<{ serviceHistory?: api.ServiceHistoryData; error?: Error }>) => {
      const { serviceHistory, error } = action.payload
      const history = serviceHistory || state.serviceHistory

      const latestHistory = max(history, (historyItem) => {
        return getDateFromString(historyItem.endDate)
      }) as ServiceData

      return {
        ...state,
        error,
        mostRecentBranch: latestHistory?.branchOfService,
        serviceHistory: history,
        loading: false,
        needsDataLoad: !!error,
        preloadComplete: true,
      }
    },

     dispatchMilitaryHistoryLogout: () => {
      return {
        ...initialMilitaryServiceState,
      }
    },

  },
})

export const { dispatchFinishGetHistory, dispatchMilitaryHistoryLogout, dispatchStartGetHistory } = militaryServiceSlice.actions
export default militaryServiceSlice.reducer
```

That is all it takes to add a new state to an existing slice file. Now the **dispatchMilitaryHistoryLogout** could be imported to any file and be dispatched.







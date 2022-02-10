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

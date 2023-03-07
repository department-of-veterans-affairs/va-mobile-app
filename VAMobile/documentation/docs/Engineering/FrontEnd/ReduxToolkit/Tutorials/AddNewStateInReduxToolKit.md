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



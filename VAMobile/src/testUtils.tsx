/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'

import { NavigationContainer } from '@react-navigation/native'

import { SnackbarProvider } from '@department-of-veterans-affairs/mobile-component-library'
import { AnyAction, Store, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider, QueryKey, UseMutationResult } from '@tanstack/react-query'
import { render as rtlRender } from '@testing-library/react-native'
import { renderHook as rtlRenderHook } from '@testing-library/react-native/build/render-hook'
import path from 'path'
import { ThemeProvider } from 'styled-components'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { RootState } from 'store'
import { InitialState } from 'store/slices'
import accessabilityReducer from 'store/slices/accessibilitySlice'
import analyticsReducer from 'store/slices/analyticsSlice'
import authReducer from 'store/slices/authSlice'
import demoReducer from 'store/slices/demoSlice'
import errorReducer from 'store/slices/errorSlice'
import settingsReducer from 'store/slices/settingsSlice'
import theme from 'styles/themes/standardTheme'
import i18nReal from 'utils/i18n'

type fn = () => any
type ActionState = AnyAction & {
  state: RootState
  payload: any
}

export class TrackedStore {
  constructor(state?: RootState) {
    this.actions = []
    this.realStore = getConfiguredStore(state) as any
    this.subscribe = this.realStore.subscribe
  }

  subscribe: (listener: any) => void
  actions: Array<ActionState>
  realStore: Store<RootState, AnyAction>

  //&ts-ignore
  dispatch(action: AnyAction | fn | any): Promise<AnyAction> | AnyAction {
    if ((action as AnyAction).type) {
      const result = this.realStore.dispatch(action as AnyAction)
      //@ts-ignore
      this.actions.push({ ...(action as AnyAction), state: this.realStore.getState() })
      return result
    } else {
      //@ts-ignore
      return action(
        (providedAction: AnyAction | fn | any) => this.dispatch(providedAction),
        () => this.realStore.getState(),
      )
    }
  }

  getState() {
    return this.realStore.getState()
  }

  getActions() {
    return this.actions
  }

  getStateField = <T extends keyof RootState, P extends keyof RootState[T]>(stateType: T, field: P) => {
    const state = this.realStore.getState()[stateType]
    return state[field]
  }
}

const getConfiguredStore = (state?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      auth: authReducer as any,
      accessibility: accessabilityReducer as any,
      demo: demoReducer as any,
      errors: errorReducer as any,
      analytics: analyticsReducer as any,
      settings: settingsReducer as any,
    },
    middleware: (getDefaultMiddleWare) => getDefaultMiddleWare({ serializableCheck: false }),
    preloadedState: { ...state },
  })
}

export const realStore = (state?: Partial<RootState>) => {
  return new TrackedStore({ ...InitialState, ...state })
}

export const mockStore = (state?: Partial<RootState>) => {
  return getConfiguredStore({ ...InitialState, ...state })
}

//@ts-ignore
const realFetch = global.fetch

export const fetch: jest.Mock = realFetch as jest.Mock

export const generateRandomString = (): string => {
  // generate a random number between 0 and 1
  // convert to base 36 (a-z,0-9)
  // drop the leading "0."
  // these are generally 11 chars long
  const gen = (): string => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require('crypto')
    const buf = crypto.randomBytes(36)
    return buf.toString('hex')
  }
  return gen()
}

export const mockNavProps = (props?: any, navigationMock?: any, routeMock?: any) => ({
  navigation: navigationMock || { navigate: jest.fn() },
  route: routeMock || {},
  ...props,
})

const { describe: origDescribe } = global

const buildRecurse = (vals: Array<string>, fn: () => void, only?: boolean, skip?: boolean): void => {
  let fnDesc: any = origDescribe
  if (only) {
    fnDesc = origDescribe.only
  } else if (skip) {
    fnDesc = origDescribe.skip
  }
  if (vals.length > 1) {
    const name = vals.shift() || ''
    return fnDesc(name, () => buildRecurse(vals, fn))
  } else {
    return fnDesc(vals[0], fn)
  }
}

// @ts-ignore
const ctxFn = (name: string, fn: () => void) => {
  return ctxReq(name, fn)
}

const ctxReq = (name: string, fn: () => void, only?: boolean, skip?: boolean) => {
  const dir = path.dirname(module?.parent?.filename || '')
  const cwd = process.cwd()
  const relPath = dir.substr((cwd + '/src/').length)
  const pathParts = relPath.split('/')
  return buildRecurse(pathParts.concat(name), fn, only, skip)
}

//@ts-ignore
ctxFn.only = (name: string, fn: () => void) => {
  return ctxReq(name, fn, true, false)
}

//@ts-ignore
ctxFn.skip = (name: string, fn: () => void) => {
  return ctxReq(name, fn, false, true)
}

export const context = ctxFn

export type QueriesData = Array<{
  queryKey: QueryKey
  data: any
}>

export type RenderParams = {
  preloadedState?: any // TODO: Update this type to Partial<RootState> and fix broken tests
  navigationProvided?: boolean
  queriesData?: QueriesData
}

//@ts-ignore
function render(ui, { preloadedState, navigationProvided = false, queriesData, ...renderOptions }: RenderParams = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  //@ts-ignore
  function Wrapper({ children }) {
    const store = mockStore(preloadedState)

    queryClient.setQueryData(authorizedServicesKeys.authorizedServices, {
      appeals: true,
      appointments: true,
      claims: true,
      decisionLetters: true,
      directDepositBenefits: true,
      directDepositBenefitsUpdate: true,
      disabilityRating: true,
      lettersAndDocuments: true,
      militaryServiceHistory: true,
      paymentHistory: true,
      preferredName: true,
      prescriptions: true,
      scheduleAppointments: true,
      secureMessaging: true,
      userProfileUpdate: true,
    })
    if (queriesData?.length) {
      queriesData.forEach(({ queryKey, data }) => {
        queryClient.setQueryData(queryKey, data)
      })
    }
    if (navigationProvided) {
      return (
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nReal}>
              <ThemeProvider theme={theme}>
                <SafeAreaProvider>
                  <SnackbarProvider>{children}</SnackbarProvider>
                </SafeAreaProvider>
              </ThemeProvider>
            </I18nextProvider>
          </Provider>
        </QueryClientProvider>
      )
    }
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nReal}>
            <NavigationContainer initialState={{ routes: [] }}>
              <ThemeProvider theme={theme}>
                <SafeAreaProvider>
                  <SnackbarProvider>{children}</SnackbarProvider>
                </SafeAreaProvider>
              </ThemeProvider>
            </NavigationContainer>
          </I18nextProvider>
        </Provider>
      </QueryClientProvider>
    )
  }

  // Return queryClient to validate client state changes not present in the ui
  return { queryClient, screen: rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) }
}

/**
 * Used to unit test query hooks.
 * @param useHook - The query hook to be tested
 * @returns An object containing:
 * - `queryClient`: QueryClient instance to test the state
 * - `result`: The result of the hook
 */
const renderQuery = <T,>(useHook: () => T) => {
  const queryClient = new QueryClient()
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <NavigationContainer initialState={{ routes: [] }}>{children}</NavigationContainer>
      </QueryClientProvider>
    )
  }

  const { result } = rtlRenderHook(useHook, { wrapper })

  return { queryClient, result }
}

/**
 * Used to unit test mutation hooks
 * @param useHook - The mutation hook to be tested
 * @returns An object containing:
 * - `queryClient`: QueryClient instance to test the state
 * - `mutate`: Function to trigger the mutation
 * - `result`: The result of the hook
 */
const renderMutation = (useHook: () => UseMutationResult<any, Error, any, any>) => {
  const queryClient = new QueryClient()
  const wrapper = ({ children }: { children: Element }) => (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer initialState={{ routes: [] }}>{children}</NavigationContainer>
    </QueryClientProvider>
  )
  const { result } = rtlRenderHook(useHook, { wrapper })

  const mutate = async (props: any) => {
    // Need to wrap in a try/catch as this will throw an error when testing error state
    try {
      await result.current.mutateAsync(props)
    } catch {}
  }

  return { queryClient, mutate, result }
}

// re-export everything
export * from '@testing-library/react-native'
// override render method
export { render, renderQuery, renderMutation }
export * from 'jest-when'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'

import { NavigationContainer } from '@react-navigation/native'

import { AnyAction, Store, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider, QueryKey } from '@tanstack/react-query'
import { render as rtlRender } from '@testing-library/react-native'
import path from 'path'
import { ThemeProvider } from 'styled-components'

import { authKeys } from 'api/auth'
import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { UserAuthSettings } from 'api/types'
import { RootState } from 'store'
import { InitialState } from 'store/slices'
import accessabilityReducer from 'store/slices/accessibilitySlice'
import analyticsReducer from 'store/slices/analyticsSlice'
import demoReducer from 'store/slices/demoSlice'
import errorReducer from 'store/slices/errorSlice'
import settingsReducer from 'store/slices/settingsSlice'
import snackbarReducer from 'store/slices/snackBarSlice'
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
      accessibility: accessabilityReducer as any,
      demo: demoReducer as any,
      errors: errorReducer as any,
      analytics: analyticsReducer as any,
      snackBar: snackbarReducer as any,
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
  //@ts-ignore
  function Wrapper({ children }) {
    const store = mockStore(preloadedState)
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    queryClient.setQueryData(authorizedServicesKeys.authorizedServices, {
      appeals: true,
      appointments: true,
      claims: true,
      decisionLetters: true,
      directDepositBenefits: true,
      directDepositBenefitsUpdate: true,
      disabilityRating: true,
      genderIdentity: true,
      lettersAndDocuments: true,
      militaryServiceHistory: true,
      paymentHistory: true,
      preferredName: true,
      prescriptions: true,
      scheduleAppointments: true,
      secureMessaging: true,
      userProfileUpdate: true,
    })
    queryClient.setQueryData(authKeys.settings, {
      canStoreWithBiometric: true,
      displayBiometricsPreferenceScreen: true,
      firstTimeLogin: false,
      loading: false,
      loggedIn: false,
      loggingOut: false,
      shouldStoreWithBiometric: true,
      supportedBiometric: '',
      syncing: false,
      codeVerifier: '',
      codeChallenge: '',
    } as UserAuthSettings)
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
                <SafeAreaProvider>{children}</SafeAreaProvider>
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
                <SafeAreaProvider>{children}</SafeAreaProvider>
              </ThemeProvider>
            </NavigationContainer>
          </I18nextProvider>
        </Provider>
      </QueryClientProvider>
    )
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react-native'
// override render method
export { render }
export * from 'jest-when'

import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { render as rtlRender } from '@testing-library/react-native'
import { ThemeProvider } from 'styled-components'
import React, { ElementType } from 'react'
import i18nReal from 'utils/i18n'
import { RootState } from 'store'
import path from 'path'
import { AnyAction, configureStore, Store } from '@reduxjs/toolkit'
import { NavigationContainer } from '@react-navigation/native'
import { ReactTestInstance } from 'react-test-renderer'
import { QueryClient, QueryClientProvider, QueryKey } from '@tanstack/react-query'

import accessabilityReducer from 'store/slices/accessibilitySlice'
import analyticsReducer from 'store/slices/analyticsSlice'
import appointmentsReducer from 'store/slices/appointmentsSlice'
import authReducer from 'store/slices/authSlice'
import claimsAndAppealsReducer from 'store/slices/claimsAndAppealsSlice'
import demoReducer from 'store/slices/demoSlice'
import directDepositReducer from 'store/slices/directDepositSlice'
import disabilityRatingReducer from 'store/slices/disabilityRatingSlice'
import errorReducer from 'store/slices/errorSlice'
import decisionLettersReducer from 'store/slices/decisionLettersSlice'
import lettersReducer from 'store/slices/lettersSlice'
import militaryServiceReducer from 'store/slices/militaryServiceSlice'
import notificationReducer from 'store/slices/notificationSlice'
import secureMessagingReducer from 'store/slices/secureMessagingSlice'
import snackbarReducer from 'store/slices/snackBarSlice'
import vaccineReducer from 'store/slices/vaccineSlice'
import paymentsReducer from 'store/slices/paymentsSlice'
import prescriptionsReducer from 'store/slices/prescriptionSlice'
import settingsReducer from 'store/slices/settingsSlice'
import { InitialState } from 'store/slices'
import theme from 'styles/themes/standardTheme'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export const findByTypeWithName = (testInstance: ReactTestInstance, type: ElementType, name: string): ReactTestInstance | null => {
  try {
    return testInstance.find((el) => {
      return el.type === type && (el.props.name === name || el.props.label === name || el.props.children === name)
    })
  } catch {
    return null
  }
}

export const findByTypeWithSubstring = (testInstance: ReactTestInstance, type: ElementType, text: string): ReactTestInstance | null => {
  try {
    return testInstance.find((el) => {
      return el.type === type && (el.props.title?.includes(text) || el.props.children?.includes(text))
    })
  } catch {
    return null
  }
}

export const findByTestID = (testInstance: ReactTestInstance, testID: string): ReactTestInstance => {
  return testInstance.findByProps({ testID })
}

export const findByTypeWithText = (testInstance: ReactTestInstance, type: ElementType, text: string): ReactTestInstance | null => {
  try {
    return testInstance.find((el) => {
      return el.type === type && (el.props.title === text || el.props.children === text)
    })
  } catch {
    return null
  }
}

export const findByOnPressFunction = (testInstance: ReactTestInstance, type: ElementType, text: string): ReactTestInstance | null => {
  try {
    return testInstance.find((el) => {
      return el.type === type && el.props.onPress.name === text
    })
  } catch {
    return null
  }
}

type fn = () => any
type ActionState = AnyAction & {
  state: RootState
  payload: any
}

export class TrackedStore {
  constructor(state?: RootState) {
    this.actions = []
    this.realStore = getConfiguredStore(state)
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
        (action: any) => this.dispatch(action),
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
    let state = this.realStore.getState()[stateType]
    return state[field]
  }
}

const getConfiguredStore = (state?: Partial<RootState>) => {
  return configureStore({
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

//@ts-ignore
const ctxFn: any = (name: string, fn: () => void) => {
  return ctxReq(name, fn)
}

const ctxReq: any = (name: string, fn: () => void, only?: boolean, skip?: boolean) => {
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

type RenderParams = {
  preloadedState?: any // TODO: Update this type to Partial<RootState> and fix broken tests
  navigationProvided?: boolean,
  queriesData?: QueriesData
}

//@ts-ignore
function render(ui, { preloadedState, navigationProvided = false, queriesData, ...renderOptions }: RenderParams = {}) {
  //@ts-ignore
  function Wrapper({ children }) {
    let store = mockStore(preloadedState)
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
      logger: {
        log: console.log,
        warn: console.warn,
        // Silence the error console
        error: () => {},
      },
    });
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
            <NavigationContainer>
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

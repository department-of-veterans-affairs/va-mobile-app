import React, { ElementType, FC, ReactElement } from 'react'

import { Store } from 'redux'
import { I18nextProvider } from 'react-i18next'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { ReactTestInstance } from 'react-test-renderer'
import { SuiteFunction } from 'mocha'
import { ThemeProvider } from 'styled-components'
import configureMockStore from 'redux-mock-store'
import path from 'path'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

import configureStore, { ReduxAction, InitialState, StoreState } from './store'
import i18nReal from 'utils/i18n'
import theme from 'styles/themes/standardTheme'
export * from 'jest-when'
const createMockStore = configureMockStore([thunk])

export const renderWithProviders = (element: ReactElement, store?: any) => {
  return renderer.create(<TestProviders store={store}>{element}</TestProviders>)
}

export const TestProviders: FC<{ store?: any; i18n?: any; navContainerProvided?: boolean }> = ({
  store = mockStore(),
  i18n = i18nReal,
  children,
  navContainerProvided,
}) => {
  if (navContainerProvided) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </I18nextProvider>
      </Provider>
    )
  }
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </NavigationContainer>
      </I18nextProvider>
    </Provider>
  )
}

export const findByTestID = (testInstance: ReactTestInstance, testID: string): ReactTestInstance => {
  return testInstance.findByProps({ testID })
}

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

type ActionState = ReduxAction & {
  state: StoreState
  payload: any
}

export class TrackedStore {
  constructor(state?: StoreState) {
    this.actions = []
    this.realStore = configureStore(state)
    this.subscribe = this.realStore.subscribe
  }

  subscribe: (listener: any) => void
  actions: Array<ActionState>
  realStore: Store<StoreState, ReduxAction>

  //&ts-ignore
  dispatch(action: ReduxAction | fn | any): Promise<ReduxAction> | ReduxAction {
    if ((action as ReduxAction).type) {
      const result = this.realStore.dispatch(action as ReduxAction)
      //@ts-ignore
      this.actions.push({ ...(action as ReduxAction), state: this.realStore.getState() })
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
}

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

export const context: SuiteFunction = ctxFn

export const mockStore = (state?: Partial<StoreState>) => {
  return createMockStore({
    ...InitialState,
    ...state,
  })
}

export const realStore = (state?: Partial<StoreState>): TrackedStore => {
  //	const store = configureStore(state)
  return new TrackedStore({
    ...InitialState,
    ...state,
  })
}

//@ts-ignore
const realFetch = global.fetch

export const fetch: jest.Mock = realFetch as jest.Mock
/*	Promise.reject({
		status: 999,
		text: () => Promise.resolve("NOT MOCKED"),
		json: () => Promise.resolve({ error: "NOT MOCKED" }),
	})
)*/

export const generateRandomString = (): string => {
  // generate a random number between 0 and 1
  // convert to base 36 (a-z,0-9)
  // drop the leading "0."
  // these are generally 11 chars long
  const gen = (): string => {
    return Math.random().toString(36).substring(2)
  }
  return gen() + gen()
}

export const mockNavProps = (props?: any, navigationMock?: any, routeMock?: any) => ({
  navigation: navigationMock || { navigate: jest.fn() },
  route: routeMock || {}, ...props })

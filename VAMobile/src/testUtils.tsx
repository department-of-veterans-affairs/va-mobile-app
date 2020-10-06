import React, { FC } from 'react'

import { AnyAction, Store } from 'redux'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import path from 'path'
import thunk from 'redux-thunk'
import { NavigationContainer } from '@react-navigation/native'
import { ReactTestInstance } from 'react-test-renderer'

import { SuiteFunction } from 'mocha'
import configureStore, { StoreState } from './store'
import i18nReal from 'utils/i18n'

const createMockStore = configureMockStore([thunk])

export const TestProviders: FC<{ store?: any; i18n?: any, navContainerProvided?:boolean }> = ({ store = createMockStore([thunk]), i18n = i18nReal, children, navContainerProvided }) => {
	if (navContainerProvided) {
		return (
			<Provider store={store}>
				<I18nextProvider i18n={i18n}>
						{children}
				</I18nextProvider>
			</Provider>
		)
	}
	return (
		<Provider store={store}>
			<I18nextProvider i18n={i18n}>
				<NavigationContainer>
					{children}
				</NavigationContainer>
			</I18nextProvider>
		</Provider>
	)
}

export const findByTestID = (testInstance: ReactTestInstance, testID: string): ReactTestInstance => {
    return testInstance.findByProps({ testID })
}

type fn = () => any

type ActionState = AnyAction & {
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
	realStore: Store<StoreState, AnyAction>

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
	return createMockStore(state)
}

export const realStore = (state?: StoreState): TrackedStore => {
	//	const store = configureStore(state)
	return new TrackedStore(state)
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

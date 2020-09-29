import { AnyAction, Store } from 'redux'
import configureMockStore from 'redux-mock-store'
import path from 'path'
import thunk from 'redux-thunk'

import configureStore, { StoreState } from './store'

const createMockStore = configureMockStore([thunk])

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
				(action:any) => this.dispatch(action),
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

const buildRecurse = (vals: Array<string>, fn: () => void): void => {
	if (vals.length > 1) {
		const name = vals.shift() || ''
		origDescribe(name, () => buildRecurse(vals, fn))
	} else {
		origDescribe(vals[0], fn)
	}
}

export const context = (name: string, fn: () => void) => {
	const dir = path.dirname(module?.parent?.filename || '')
	const cwd = process.cwd()
	const relPath = dir.substr((cwd + '/src/').length)
	const pathParts = relPath.split('/')
	buildRecurse(pathParts.concat(name), fn)
}

export const mockStore = (state?: Partial<StoreState>) => {
	return createMockStore(state)
}

export const realStore = (state?: StoreState): TrackedStore => {
	//	const store = configureStore(state)
	return new TrackedStore(state)
}

//@ts-ignore
const realFetch = global.fetch

export const fetch:jest.Mock = realFetch as jest.Mock
/*	Promise.reject({
		status: 999,
		text: () => Promise.resolve("NOT MOCKED"),
		json: () => Promise.resolve({ error: "NOT MOCKED" }),
	})
)*/
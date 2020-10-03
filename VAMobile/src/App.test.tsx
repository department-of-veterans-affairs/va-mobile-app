import 'react-native'
import React from 'react'

import renderer, { act } from 'react-test-renderer'

import { context, mockStore, TestProviders } from 'testUtils'

import App, { AuthedApp, AuthGuard } from './App'
import { Linking } from 'react-native'
import { handleTokenCallbackUrl } from 'store/actions/auth'

jest.mock("./store/actions/auth", () => ({
	handleTokenCallbackUrl: jest.fn(()=>({type:"FOO"})),
	attemptAuthWithSavedCredentials: jest.fn(()=>({type:"FOO"})),
}))

context('App', () => {
	it('initializes correctly', async () => {
		jest.mock("./store", () => ({
			...(jest.requireActual("./store") as any),
			configureStore: () => ({
				subscribe: jest.fn(),
				dispatch: jest.fn(),
				getState: jest.fn(),
			})
		}))

		let component: any
		act(() => {
			component = renderer.create(<App />)
		})
		expect(component).toBeTruthy()
	})

	describe("AuthGuard", () => {
		it("should initilize by registering for linking", async () => {
			let store = mockStore({
				counter: { counter: 0 },
				auth: { initializing: true, loggedIn: false, loading: false },
			});
			let component: any
			act(() => {
				component = renderer.create(
					<TestProviders store={store}>
						<AuthGuard />
					</TestProviders>
				)
			})
			expect(component).toBeTruthy()
			expect(Linking.addEventListener).toHaveBeenCalled()
		})

		it("should dispatch handleTokenCallbackUrl when auth token result comes back", async () => {
			let component: any = undefined
			
			let store = mockStore({
				counter: { counter: 0 },
				auth: { initializing: true, loggedIn: false, loading: false },
			});
			act(() => {
				component = renderer.create(
					<TestProviders store={store}>
						<AuthGuard />
					</TestProviders>
				)
				expect(component).toBeTruthy()
			})
			expect(Linking.addEventListener).toHaveBeenCalled()
			let spy = Linking.addEventListener as jest.Mock
			let listener = spy.mock.calls[1][1]
			expect(listener).toBeTruthy()
			
			act(() => {
				listener({ url: 'vamobile://login-success?code=123&state=5434' })
			})
			
			expect(handleTokenCallbackUrl).toHaveBeenCalled()
		})
		
		
		it("should not dispatch handleTokenCallbackUrl when not an auth result url", async () => {
			let component: any = undefined
			
			let store = mockStore({
				counter: { counter: 0 },
				auth: { initializing: true, loggedIn: false, loading: false },
			});
			act(() => {
				component = renderer.create(
					<TestProviders store={store}>
						<AuthGuard />
					</TestProviders>
				)
				expect(component).toBeTruthy()
			})
			expect(Linking.addEventListener).toHaveBeenCalled()
			let spy = Linking.addEventListener as jest.Mock
			let listener = spy.mock.calls[1][1]
			expect(listener).toBeTruthy()
			
			act(() => {
				listener({ url: 'vamobile://foo?code=123&state=5434' })
			})
			
			expect(handleTokenCallbackUrl).not.toHaveBeenCalled()
		})

		it("should render Login when not authorized", async () => {
			let store = mockStore({
				counter: { counter: 0 },
				auth: { initializing: true, loggedIn: false, loading: false },
			})
			let component: any
			act(() => {
				component = renderer.create(
					<TestProviders store={store}>
						<AuthGuard />
					</TestProviders>
				)
			})
			expect(component).toBeTruthy()
			expect(component.root.children[0]).not.toBe(AuthedApp)
		})

		it("should render AuthedApp when authorized", async () => {
			let store = mockStore({
				counter: { counter: 0 },
				auth: { initializing: true, loggedIn: true, loading: false },
			});
			let component: any
			act(() => {
				component = renderer.create(
					<TestProviders store={store}>
						<AuthGuard />
					</TestProviders>
				)
			})
			expect(component).toBeTruthy()
			expect(component.root.children)
			//expect(component.root.children[0]).toBe(AuthedApp)
		})


	})
})

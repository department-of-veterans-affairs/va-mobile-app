import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer'
import { context, mockStore, TestProviders } from 'testUtils'

import HomeScreen from './HomeScreen'

context('HomeScreen', () => {
	let store:any
	let component:any

	beforeEach(() => {
		store = mockStore({
			counter: {counter:0},
			auth: { initializing:true, loggedIn: false, loading: false },
		});
		
		act(() => {
			component = renderer.create(
				<TestProviders store={store}>
					<HomeScreen />
				</TestProviders>
			)
		})
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})
})

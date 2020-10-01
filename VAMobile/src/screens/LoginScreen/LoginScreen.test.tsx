import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'
import { context, mockStore } from 'testUtils'

import LoginScreen from './LoginScreen'
import { Provider } from 'react-redux'

context('LoginScreen', () => {
	let store
	let component:any

	beforeEach(() => {
		store = mockStore({
			auth: { initializing:true, loggedIn: false, loading: false },
		});

		component = renderer.create(
			<Provider store={store}>
				<LoginScreen />
			</Provider>
		)
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})
})

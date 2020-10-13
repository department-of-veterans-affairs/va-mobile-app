import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act } from 'react-test-renderer'
import { context, mockStore, renderWithProviders } from 'testUtils'

import SettingsScreen from './index'

context('SettingsScreen', () => {
	let store:any
	let component:any

	beforeEach(() => {
		store = mockStore({
			auth: { initializing:true, loggedIn: false, loading: false },
		});

		act(() => {
			component = renderWithProviders(<SettingsScreen />, store) 
		})
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})
})

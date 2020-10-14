import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act } from 'react-test-renderer'
import 'jest-styled-components'

import ContactVAScreen from './ContactVAScreen'
import { context, renderWithProviders } from 'testUtils'

context('ContactVAScreen', () => {
	let component:any

	beforeEach(() => {
		act(() => {
			component = renderWithProviders(<ContactVAScreen />)
		})
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})
})

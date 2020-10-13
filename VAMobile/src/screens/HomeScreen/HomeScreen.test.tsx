import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer'
import 'jest-styled-components'

import HomeScreen from './index'
import { context, TestProviders } from 'testUtils'

context('HomeScreen', () => {
	let component:any

	beforeEach(() => {
		component = renderer.create(
		  <TestProviders>
			  	<HomeScreen />
		  </TestProviders>)
	})

	it('initializes correctly', async () => {
		await act(async () => {
			expect(component).toBeTruthy()
		})
	})
})

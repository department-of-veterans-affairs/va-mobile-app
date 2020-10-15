import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act } from 'react-test-renderer'
import 'jest-styled-components'

import CrisisLineCta from './CrisisLineCta'
import { context, renderWithProviders } from 'testUtils'

context('CrisisLineCta', () => {
	let component:any

	beforeEach(() => {
		act(() => {
			component = renderWithProviders(<CrisisLineCta />)
		})
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})
})

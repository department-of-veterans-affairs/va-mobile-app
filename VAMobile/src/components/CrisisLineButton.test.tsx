import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'
import { ThemeProvider } from 'styled-components/native'
import Mock = jest.Mock;

import CrisisLineButton from './CrisisLineButton'
import { context } from 'testUtils'
import theme from 'styles/theme'

context('CrisisLineButton', () => {
	let component: any
	let testInstance: ReactTestInstance
	let onPressSpy: Mock

	beforeEach(() => {
		onPressSpy = jest.fn(() => {})
		component = renderer.create(
			<ThemeProvider theme={theme}>
				<CrisisLineButton/>
			</ThemeProvider>)
		testInstance = component.root;
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})
})

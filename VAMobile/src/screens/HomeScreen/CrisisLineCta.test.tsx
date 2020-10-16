import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act } from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock

import CrisisLineCta from './CrisisLineCta'
import { context, renderWithProviders } from 'testUtils'

context('CrisisLineCta', () => {
	let component:any
    let onPressSpy: Mock

	beforeEach(() => {
        onPressSpy = jest.fn(() => {})
		act(() => {
			component = renderWithProviders(<CrisisLineCta onPress={onPressSpy} />)
		})
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})
})

import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act } from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock

import ContactVAScreen from './ContactVAScreen'
import { context, renderWithProviders } from 'testUtils'

context('ContactVAScreen', () => {
	let component:any
    let navigationSpy: Mock
    let routeSpy: Mock
    const createTestProps = (props?: any) => ({ navigation: { navigate: jest.fn() }, route: {}, ...props });

	beforeEach(() => {
	    navigationSpy = jest.fn(() => {})
        routeSpy = jest.fn(() => {})

        const props = createTestProps()

		act(() => {
			component = renderWithProviders(<ContactVAScreen {...props} />)
		})
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})
})

import { Linking } from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'

import PhoneLink from './PhoneLink'
import {context, renderWithProviders, findByTestID} from 'testUtils'

context('PhoneLink', () => {
	let component: any
	let testInstance: ReactTestInstance

	beforeEach(() => {
		act(() => {
			component = renderWithProviders(<PhoneLink text={'111-453-3234'} accessibilityHint={'hint'}/>)
		})
		testInstance = component.root;
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})

	it('should call Linking.openURL', async () => {
		findByTestID(testInstance, '111-453-3234').props.onPress()
		expect(Linking.openURL).toBeCalledWith('tel:1114533234')
	})
})

import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act } from 'react-test-renderer'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types'
import 'jest-styled-components'
import Mock = jest.Mock

import ContactVAScreen from './ContactVAScreen'
import { context, renderWithProviders } from 'testUtils'
import { HomeStackParamList } from '../HomeScreen'


context('ContactVAScreen', () => {
	let component:any
    let navigationSpy: Mock
    let routeSpy: Mock

	beforeEach(() => {
	    navigationSpy = jest.fn(() => {})
        routeSpy = jest.fn(() => {})

		act(() => {
			component = renderWithProviders(<ContactVAScreen navigation={navigationSpy as unknown as StackNavigationProp<HomeStackParamList, 'ContactVA'>} route={routeSpy as unknown as RouteProp<HomeStackParamList, 'ContactVA'>} />)
		})
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})
})

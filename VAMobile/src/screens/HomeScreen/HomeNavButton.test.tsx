import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { act, ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock;

import HomeNavButton from './HomeNavButton'
import { context, TestProviders, findByTestID } from 'testUtils'

context('HomeNavButton', () => {
	let component: any
	let testInstance: ReactTestInstance
	let onPressSpy: Mock

	beforeEach(() => {
		onPressSpy = jest.fn(() => {})
		act(() => {
			component = renderer.create(
				<TestProviders>
					<HomeNavButton title={'My Title'} subText={'My Subtext'} a11yHint={'a11y'} onPress={onPressSpy}/>
				</TestProviders>)
		})

		testInstance = component.root;
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
		expect(findByTestID(testInstance, 'my-title-home-nav-button-title').props.children).toEqual('My Title')
		expect(findByTestID(testInstance, 'my-title-home-nav-button-subtext').props.children).toEqual('My Subtext')
	})

	it('should call onPress', async () => {
		testInstance.findByType(HomeNavButton).props.onPress()
		expect(onPressSpy).toBeCalled()
	})
})

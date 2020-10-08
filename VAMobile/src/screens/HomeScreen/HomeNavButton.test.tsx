import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock;

import HomeNavButton, { Title, SubText, StyledView } from './HomeNavButton'
import { context, TestProviders } from 'testUtils'

context('HomeNavButton', () => {
	let component: any
	let testInstance: ReactTestInstance
	let onPressSpy: Mock

	beforeEach(() => {
		onPressSpy = jest.fn(() => {})
		component = renderer.create(
		  <TestProviders>
		  	<HomeNavButton title={'My Title'} subText={'My Subtext'} a11yHint={'a11y'} onPress={onPressSpy}/>
		  </TestProviders>)
		testInstance = component.root;
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
		expect(testInstance.findByType(Title).props.children).toEqual('My Title')
		expect(testInstance.findByType(SubText).props.children).toEqual('My Subtext')
	})

	it('should call onPress', () => {
		testInstance.findByType(StyledView).props.onPress()
		expect(onPressSpy).toBeCalled()
	})
})

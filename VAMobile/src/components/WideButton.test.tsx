import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock;

import WideButton, { StyledText, StyledView } from './WideButton'
import { context, TestProviders } from 'testUtils'

context('WideButton', () => {
	let component: any
	let testInstance: ReactTestInstance
	let onPressSpy: Mock

	beforeEach(() => {
		onPressSpy = jest.fn(() => {})
		component = renderer.create(
			<TestProviders>
				<WideButton title={'My Title'} a11yHint={'a11y'} onPress={onPressSpy}/>
			</TestProviders>)
		testInstance = component.root;
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
		expect(testInstance.findByType(StyledText).props.children).toEqual('My Title')
	})

	it('should call onPress', () => {
		testInstance.findByType(StyledView).props.onPress()
		expect(onPressSpy).toBeCalled()
	})
})

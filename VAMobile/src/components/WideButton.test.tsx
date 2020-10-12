import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { act, ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock;

import WideButton from './WideButton'
import { context, TestProviders, findByTestID } from 'testUtils'

context('WideButton', () => {
	let component: any
	let testInstance: ReactTestInstance
	let onPressSpy: Mock

	beforeEach(() => {
		onPressSpy = jest.fn(() => {})
		act(() => {
			component = renderer.create(
				<TestProviders>
					<WideButton listOfText={['My Title']} a11yHint={'a11y'} onPress={onPressSpy} isFirst={false}/>
				</TestProviders>)
		})
		testInstance = component.root;
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})

	it('should call onPress', async () => {
		testInstance.findByType(WideButton).props.onPress()
		expect(onPressSpy).toBeCalled()
	})
})

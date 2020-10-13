import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { act, ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock;

import TextArea from './TextArea'
import { context, TestProviders } from 'testUtils'

context('TextArea', () => {
	let component: any
	let testInstance: ReactTestInstance
	let onPressSpy: Mock

	beforeEach(() => {
		onPressSpy = jest.fn(() => {})
		act(() => {
			component = renderer.create(
				<TestProviders>
					<TextArea/>
				</TestProviders>)
		})
		testInstance = component.root;
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})
})

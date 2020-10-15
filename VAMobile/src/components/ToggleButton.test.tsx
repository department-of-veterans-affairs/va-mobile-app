import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { act, ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock;

import ToggleButton from './ToggleButton'
import { context, TestProviders, findByTestID } from 'testUtils'

context('ToggleButton', () => {
	let component: any
	let testInstance: ReactTestInstance
	let onChangeSpy: Mock

	beforeEach(() => {
		onChangeSpy = jest.fn(() => {})
		act(() => {
			component = renderer.create(
				<TestProviders>
					<ToggleButton values={['0','1']} titles={['tab0','tab1']} onChange={onChangeSpy} />
				</TestProviders>)
		})
		testInstance = component.root;
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})

  it('should call onChange', async () => {
		testInstance.findByType(ToggleButton).props.onChange()
		expect(onChangeSpy).toBeCalled()
	})
})

import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { act, ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'

import PhoneLink from './PhoneLink'
import {context, findByTestID, TestProviders} from 'testUtils'

context('PhoneLink', () => {
	let component: any
	let testInstance: ReactTestInstance

	beforeEach(() => {
		act(() => {
			component = renderer.create(
				<TestProviders>
					<PhoneLink text={'111-453-3234'}/>
				</TestProviders>)
		})
		testInstance = component.root;
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})

	// TODO add test for calling Linking.openUrl
})

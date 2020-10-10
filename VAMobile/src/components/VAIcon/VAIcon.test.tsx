import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, {act, ReactTestInstance} from 'react-test-renderer'
import 'jest-styled-components'

import VAIcon, {VA_ICON_TYPES} from './VAIcon'
import {context, TestProviders} from 'testUtils'
import Appointments_Selected from 'images/navIcon/appointments_selected.svg'

jest.mock('../utils/common', () => ({
	useFontScale: () => {
		return (value:number) => {
			return 3 * value
		}
	}
}))



context('VAIconTests', () => {
	let component: any
	let testInstance: ReactTestInstance

	beforeEach(() => {
		act(() => {
			component = renderer.create(
				<TestProviders>
					<VAIcon name={"Home"} fill="#fff"/>
				</TestProviders>)
		})

		testInstance = component.root
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})

	describe('optional parameters', () => {
		it('should get passed to svg component', async () => {
			act(() => {
				component = renderer.create(
					<TestProviders>
						<VAIcon name={"Home"} id={'myId'} height={1} width={2} />
					</TestProviders>)
			})

			testInstance = component.root
			const icon: ReactTestInstance = testInstance.findByType(Appointments_Selected);
			expect(icon).toBeTruthy()
			expect(icon.props).toEqual({
				height: 3,
				id: 'myId',
				width: 6,
			})
		})
	});
})

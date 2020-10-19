import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import 'jest-styled-components'

import { TextArea } from 'components'
import ContactVAScreen from './ContactVAScreen'
import CrisisLineCta from '../CrisisLineCta'
import { context, mockNavProps, renderWithProviders } from 'testUtils'

context('ContactVAScreen', () => {
	let component:any
	let testInstance: ReactTestInstance

	beforeEach(() => {
        const props = mockNavProps()

		act(() => {
			component = renderWithProviders(<ContactVAScreen {...props} />)
		})
		testInstance = component.root;
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()

		expect(testInstance.findByType(CrisisLineCta)).toBeTruthy()

		const parent = testInstance.findByType(TextArea)
		const children = parent.props.children

		expect(children.length).toBe(5)
		expect(children[0].props.children).toBe('Call VA311')
		expect(children[1].props.children).toBe('VA311 is a national toll-free number through which Veterans can access all VA has to offer.')
        expect(children[2].props.displayedText).toBe('844-698-2311')
		expect(children[3].props.children).toBe('If you have hearing loss, call TTY:')
		expect(children[4].props.displayedText).toBe('711')
	})
})

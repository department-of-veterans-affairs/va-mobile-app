import 'react-native'
import React from 'react'
import { Linking } from 'react-native'
// Note: test renderer must be required after react-native.
import renderer, { act, ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'

import HomeScreen from './index'
import { context, findByTestID, TestProviders } from 'testUtils'

context('HomeScreen', () => {
	let component:any
    let testInstance: ReactTestInstance

	beforeEach(() => {
		component = renderer.create(
		  <TestProviders>
			  	<HomeScreen />
		  </TestProviders>)

        testInstance = component.root
	})

	it('initializes correctly', async () => {
		await act(async () => {
			expect(component).toBeTruthy()
		})
	})

    describe('when the covid 19 screening tool button is clicked', () => {
        it('should call Linking openUrl with the parameter https://www.va.gov/covid19screen/', async () => {
            findByTestID(testInstance, 'covid-19-screening-tool').props.onPress()
            expect(Linking.openURL).toHaveBeenCalledWith('https://www.va.gov/covid19screen/')
        })
    })
})

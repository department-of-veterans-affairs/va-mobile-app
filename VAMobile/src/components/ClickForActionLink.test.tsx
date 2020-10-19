import { Linking } from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'

import ClickForActionLink from './ClickForActionLink'
import {context, renderWithProviders, findByTestID} from 'testUtils'
import VAIcon from './VAIcon'

context('ClickForActionLink', () => {
	let component: any
	let testInstance: ReactTestInstance

	beforeEach(() => {
		act(() => {
			component = renderWithProviders(<ClickForActionLink text={'111-453-3234'} accessibilityHint={'hint'} linkType={'call'}/>)
		})
		testInstance = component.root
	})

	it('initializes correctly', async () => {
		expect(component).toBeTruthy()
	})

    describe('when linkType is call', () => {
        it('should call Linking.openURL with the parameter tel:number', async () => {
            findByTestID(testInstance, '111-453-3234').props.onPress()
            expect(Linking.openURL).toBeCalledWith('tel:1114533234')
        })

        it('should render the VAIcon with name Phone', async () => {
            expect(testInstance.findByType(VAIcon).props.name).toEqual('Phone')
        })
    })

    describe('when linkType is text', () => {
        beforeEach(() => {
            act(() => {
                component = renderWithProviders(<ClickForActionLink text={'111-453-3234'} accessibilityHint={'hint'} linkType={'text'}/>)
            })
            testInstance = component.root
        })
        it('should call Linking.openURL with the parameter sms:number', async () => {
            findByTestID(testInstance, '111-453-3234').props.onPress()
            expect(Linking.openURL).toBeCalledWith('sms:1114533234')
        })

        it('should render the VAIcon with name Text', async () => {
            expect(testInstance.findByType(VAIcon).props.name).toEqual('Text')
        })
    })

    describe('when linkType is url', () => {
        beforeEach(() => {
            act(() => {
                component = renderWithProviders(<ClickForActionLink text={'click me to go to google'} urlLink={'https://google.com'} accessibilityHint={'hint'} linkType={'url'}/>)
            })
            testInstance = component.root
        })
        it('should call Linking.openURL with the parameter given to urlLink, https://google.com', async () => {
            findByTestID(testInstance, 'click me to go to google').props.onPress()
            expect(Linking.openURL).toBeCalledWith('https://google.com')
        })

        it('should render the VAIcon with name Chat', async () => {
            expect(testInstance.findByType(VAIcon).props.name).toEqual('Chat')
        })
    })
})

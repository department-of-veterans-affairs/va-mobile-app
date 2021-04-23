import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders} from 'testUtils'
import {FooterButton} from 'components'
import ReplyMessageFooter from "./ReplyMessageFooter";

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
    let original = jest.requireActual("utils/hooks")
    let theme = jest.requireActual("styles/themes/standardTheme").default
    return {
        ...original,
        useTheme: jest.fn(()=> {
            return {...theme}
        }),
        useRouteNavigation: () => { return () => mockNavigationSpy},
    }
})

context('ReplyMessageFooter', () => {
    let component: any
    let testInstance: ReactTestInstance

    beforeEach(() => {
        act(() => {
            component = renderWithProviders(<ReplyMessageFooter messageID={1} />)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    describe('on click of the footer button', () => {
        it('should call useRouteNavigation', async () => {
            testInstance.findByType(FooterButton).props.onPress()
            expect(mockNavigationSpy).toHaveBeenCalled()
        })
    })
})

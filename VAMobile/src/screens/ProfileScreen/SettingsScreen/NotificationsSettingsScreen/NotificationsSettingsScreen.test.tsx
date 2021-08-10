import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {Switch as RNSwitch} from 'react-native'

import { Switch, TextView } from 'components'
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import { InitialState } from "../../../../store";
import { PushPreference } from "../../../../store/api";
import NotificationsSettingsScreen from "./NotificationsSettingsScreen";

let mockPushEnabled = false
jest.mock('../../../../utils/notifications', () => {
    return {
        notificationsEnabled: jest.fn(() => {
            return Promise.resolve(mockPushEnabled)
        })
    }
})

context('NotificationsSettingsScreen', () => {
    let store: any
    let component: any
    let testInstance: ReactTestInstance


    const apptPrefOn: PushPreference = {
        preferenceId: 'appointment_reminders',
        preferenceName: 'Appointment Reminders',
        value: true
    }

    const apptPrefOff: PushPreference = {
        preferenceId: 'appointment_reminders',
        preferenceName: 'Appointment Reminders',
        value: false
    }

    const initializeTestInstance = (notificationsEnabled: boolean, systemNotificationsOn: boolean, preferences: PushPreference[]) => {
        const props = mockNavProps()
        mockPushEnabled = notificationsEnabled
        store = mockStore({
            ...InitialState,
            notifications:{
                ...InitialState.notifications,
                preferences,
                systemNotificationsOn
            }
        })

        act(() => {
            component = renderWithProviders(<NotificationsSettingsScreen {...props} />, store)
        })

        testInstance = component.root
    }
    beforeEach(() => {
        initializeTestInstance(false, true, [apptPrefOn])
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    describe('appointment reminders switch', () => {
        it('value should be true when pref is set to true', async () => {
          const rnSwitch = testInstance.findAllByType(RNSwitch)[0]
          expect(rnSwitch.props.value).toEqual(true)
        })

        it('value should be false when pref is set to true', async () => {
            initializeTestInstance(false, true, [apptPrefOff])
            const rnSwitch = testInstance.findAllByType(RNSwitch)[0]
            expect(rnSwitch.props.value).toEqual(false)
          })
    })

})

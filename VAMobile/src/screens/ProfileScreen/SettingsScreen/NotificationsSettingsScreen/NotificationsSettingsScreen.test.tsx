import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import { InitialState } from "../../../../store";
import { PushPreference } from "../../../../store/api";
import NotificationsSettingsScreen from "./NotificationsSettingsScreen";
import { AlertBox, TextView } from "../../../../components";

let mockPushEnabled = true
jest.mock('../../../../utils/notifications', () => {
    return {
        notificationsEnabled: jest.fn(() => {
            return Promise.resolve(mockPushEnabled)
        })
    }
})

jest.mock('../../../../utils/deviceData', () => {
    return {
        deviceName: jest.fn(() => {
            return 'Test Device Name'
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

    const initializeTestInstance = (notificationsEnabled: boolean, preferences?: PushPreference[]) => {
        const props = mockNavProps()
        mockPushEnabled = notificationsEnabled
        store = mockStore({
            ...InitialState,
            notifications:{
                ...InitialState.notifications,
                ...preferences
            }
        })

        act(() => {
            component = renderWithProviders(<NotificationsSettingsScreen {...props} />, store)
        })

        testInstance = component.root
    }
    beforeEach(() => {
        initializeTestInstance(true, [apptPrefOn])
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    describe('when system notifications are off', () => {
        it('should render the alert box', async () => {
            initializeTestInstance(true, [apptPrefOn])
            const alertBox = testInstance.findAllByType(AlertBox)[0]
            expect(alertBox).toBeTruthy()
            expect(alertBox.findAllByType(TextView)[0].props.childer).toEqual('Turn on push notifications')
            expect(alertBox.findAllByType(TextView)[1].props.childer).toEqual('To get notifications from the VA mobile app, you\'ll need to turn them on in your system settings.')
        })
    })

})

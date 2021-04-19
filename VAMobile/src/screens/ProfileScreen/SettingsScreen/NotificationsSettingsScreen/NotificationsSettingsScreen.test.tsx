import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
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
        initializeTestInstance(false, [apptPrefOn])
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

})

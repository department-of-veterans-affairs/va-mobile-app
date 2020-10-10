import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, {act, ReactTestInstance} from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock;

import ProfileBanner from './ProfileBanner'
import { context, TestProviders } from 'testUtils'

context('WideButton', () => {
    let component: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock

    beforeEach(() => {
        onPressSpy = jest.fn(() => {})

        act(() => {
            component = renderer.create(
                <TestProviders>
                    <ProfileBanner name={'Jerry Mills'} mostRecentBranch={'United States Air Force'}/>
                </TestProviders>)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    describe('when the military branch is United States Air Force', () => {
        it('should display the Air_Force component', async () => {
            const airForce = testInstance.findByProps({ id: 'airForce' })
            expect(airForce).toBeTruthy()
        })
    })

    describe('when the military branch is United States Army', () => {
        it('should display the Army component', async () => {
            act(() => {
                component = renderer.create(
                    <TestProviders>
                        <ProfileBanner name={'Jerry Mills'} mostRecentBranch={'United States Army'}/>
                    </TestProviders>)
            })

            testInstance = component.root
            const army = testInstance.findByProps({ id: 'army' })
            expect(army).toBeTruthy()
        })
    })

    describe('when the military branch is United States Coastal Guard', () => {
        it('should display the Coastal_Guard component', async () => {
            act(() => {
                component = renderer.create(
                    <TestProviders>
                        <ProfileBanner name={'Jerry Mills'} mostRecentBranch={'United States Coastal Guard'}/>
                    </TestProviders>)
            })

            testInstance = component.root
            const coastalGuard = testInstance.findByProps({ id: 'coastalGuard' })
            expect(coastalGuard).toBeTruthy()
        })
    })

    describe('when the military branch is United States Marine Corps', () => {
        it('should display the Marine_Corps component', async () => {
            act(() => {
                component = renderer.create(
                    <TestProviders>
                        <ProfileBanner name={'Jerry Mills'} mostRecentBranch={'United States Marine Corps'}/>
                    </TestProviders>)
            })

            testInstance = component.root
            const marineCorps = testInstance.findByProps({ id: 'marineCorps' })
            expect(marineCorps).toBeTruthy()
        })
    })

    describe('when the military branch is United States Navy', () => {
        it('should display the Navy component', async () => {
            act(() => {
                component = renderer.create(
                    <TestProviders>
                        <ProfileBanner name={'Jerry Mills'} mostRecentBranch={'United States Navy'}/>
                    </TestProviders>)
            })

            testInstance = component.root
            const navy = testInstance.findByProps({ id: 'navy' })
            expect(navy).toBeTruthy()
        })
    })
})

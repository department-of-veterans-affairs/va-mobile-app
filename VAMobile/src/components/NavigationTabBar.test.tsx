import 'react-native'
import React from 'react'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'
import { TouchableWithoutFeedback } from 'react-native'
// Note: test renderer must be required after react-native.
import renderer, { act, ReactTestInstance } from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock;

import NavigationTabBar from './NavigationTabBar'
import { context, TestProviders } from 'testUtils'

context('NavigationTabBar', () => {
    let component: any
    let testInstance: ReactTestInstance
    let emitSpy: Mock
    let navigateSpy: Mock
    let routes: Array<any>
    const t = jest.fn(() => {})

    beforeEach(() => {
        emitSpy = jest.fn(() => {})
        navigateSpy = jest.fn(() => {})

        routes = [
            { name: 'Home', key: 'Home-1' },
            { name: 'Claims', key: 'Claims-1' },
            { name: 'Appointments', key: 'Appointments-1' },
            { name: 'Profile', key: 'Profile-1' },
        ]

        act(() => {
            component = renderer.create(
                <TestProviders>
                    <NavigationTabBar state={{ index: 0, routes: routes } as unknown as TabNavigationState}
                                      navigation={{ emit: emitSpy, navigate: navigateSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>}
                                      tabBarVisible={true} translation={t} />
                </TestProviders>)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    describe('when the tabBarVisible prop is false', () => {
        it('should return null', async () => {
            act(() => {
                component = renderer.create(
                    <TestProviders navContainerProvided>
                        <NavigationTabBar state={{ index: 0, routes: routes } as unknown as TabNavigationState}
                                          navigation={{ emit: emitSpy, navigate: navigateSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>}
                                          tabBarVisible={false} translation={t} />
                    </TestProviders>)
            })

            testInstance = component.root
            expect(component.toJSON()).toBeFalsy()
        })
    })

    describe('when a tab option is pressed', () => {
        it('should call the navigation emit spy', async () => {
            testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
            expect(emitSpy).toBeCalled()
        })

        describe('when isFocused is false and navigation emit returns false for defaultPrevented', () => {
            it('should call navigation emit and navigate spy', async () => {
                emitSpy.mockReturnValue({ defaultPrevented: false })
                testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
                expect(emitSpy).toBeCalled()
                expect(navigateSpy).toBeCalled()
            })
        })
    })

    describe('when a tab option is long pressed', () => {
        it('should call the navigation emit spy', async () => {
            testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onLongPress()
            expect(emitSpy).toBeCalled()
        })
    })

    describe('when the focused tab name is Home', () => {
        it('should return the Home Selected component', async () => {
            act(() => {
                component = renderer.create(
                    <TestProviders navContainerProvided>
                        <NavigationTabBar state={{ index: 0, routes: routes } as unknown as TabNavigationState}
                                          navigation={{ emit: emitSpy, navigate: navigateSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>}
                                          tabBarVisible={true} translation={t} />
                    </TestProviders>)
            })

            testInstance = component.root

            const homeSelected = testInstance.findByProps({ id: 'homeSelected' })
            expect(homeSelected).toBeTruthy()
        })
    })

    describe('when the focused tab name is Claims', () => {
        it('should return the Claims Selected component', async () => {
            act(() => {
                component = renderer.create(
                    <TestProviders navContainerProvided>
                        <NavigationTabBar state={{ index: 1, routes: routes } as unknown as TabNavigationState}
                                          navigation={{ emit: emitSpy, navigate: navigateSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>}
                                          tabBarVisible={true} translation={t} />
                    </TestProviders>)
            })

            testInstance = component.root
            const claimsSelected = testInstance.findByProps({ id: 'claimsSelected' })
            expect(claimsSelected).toBeTruthy()
        })
    })

    describe('when the focused tab name is Appointments', () => {
        it('should return the Appointments Selected component', async () => {
            act(() => {
                component = renderer.create(
                    <TestProviders navContainerProvided>
                        <NavigationTabBar state={{ index: 2, routes: routes } as unknown as TabNavigationState}
                                          navigation={{ emit: emitSpy, navigate: navigateSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>}
                                          tabBarVisible={true} translation={t} />
                    </TestProviders>)
            })

            testInstance = component.root
            const appointmentsSelected = testInstance.findByProps({ id: 'appointmentsSelected' })
            expect(appointmentsSelected).toBeTruthy()
        })
    })

    describe('when the focused tab name is Profile', () => {
        it('should return the Profile Selected component', async () => {
            act(() => {
                component = renderer.create(
                    <TestProviders navContainerProvided>
                        <NavigationTabBar state={{ index: 3, routes: routes } as unknown as TabNavigationState}
                                          navigation={{ emit: emitSpy, navigate: navigateSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>}
                                          tabBarVisible={true} translation={t} />
                    </TestProviders>)
            })

            testInstance = component.root
            const profileSelected = testInstance.findByProps({ id: 'profileSelected' })
            expect(profileSelected).toBeTruthy()
        })
    })

    describe('when the focused tab name does not exist', () => {
       it('should return an empty string for that icon', async () => {
           routes = [
               { name: 'Home', key: 'Home-1' },
               { name: 'Claims', key: 'Claims-1' },
               { name: 'Appointments', key: 'Appointments-1' },
               { name: 'Random field', key: 'Random-1' },
           ]

           act(() => {
               component = renderer.create(
                   <TestProviders navContainerProvided>
                       <NavigationTabBar state={{ index: 3, routes: routes } as unknown as TabNavigationState}
                                         navigation={{ emit: emitSpy, navigate: navigateSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>}
                                         tabBarVisible={true} translation={t} />
                   </TestProviders>)
           })

           testInstance = component.root
           const icon = component.toJSON().children[0].children[3].children[0].children[0]
           expect(icon).toBe('')
       })
    })
})

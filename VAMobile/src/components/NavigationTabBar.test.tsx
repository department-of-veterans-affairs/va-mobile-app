import React from 'react'

import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'

import { fireEvent, screen, userEvent } from '@testing-library/react-native'
import { TFunction } from 'i18next'

import { context, render } from 'testUtils'

import NavigationTabBar from './NavigationTabBar'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('NavigationTabBar', () => {
  const emitSpy = jest.fn()

  const routes = [
    { name: 'Home', key: 'Home-1' },
    { name: 'Benefits', key: 'Benefits-1' },
    { name: 'Health', key: 'Health-1' },
    { name: 'Payments', key: 'Payments-1' },
  ]

  const renderWithRoute = (index = 0) => {
    jest.resetAllMocks()
    render(
      <NavigationTabBar
        state={{ index, routes } as unknown as TabNavigationState<ParamListBase>}
        navigation={
          { emit: emitSpy, navigate: mockNavigationSpy } as unknown as NavigationHelpers<
            ParamListBase,
            BottomTabNavigationEventMap
          >
        }
        translation={jest.fn() as unknown as TFunction}
      />,
    )
  }

  beforeEach(() => {
    renderWithRoute(0)
  })

  it('navigates when tab is pressed', () => {
    fireEvent.press(screen.getByRole('tab', { name: 'Home' }))
    expect(emitSpy).toBeCalled()
  })

  it('navigates when tab is long pressed', async () => {
    await userEvent.longPress(screen.getByRole('tab', { name: 'Benefits' }))
    expect(emitSpy).toBeCalled()
  })

  it('calls nav and emit spies when tab is not focused and defaultPrevented is false', () => {
    emitSpy.mockReturnValue({ defaultPrevented: false })
    fireEvent.press(screen.getByRole('tab', { name: 'Benefits' }))
    expect(emitSpy).toBeCalled()
    expect(mockNavigationSpy).toBeCalled()
  })

  it('selects correct tab for Home route', () => {
    expect(screen.getByRole('tab', { name: 'Home', selected: true })).toBeTruthy()
  })

  it('selects correct tab for Benefits route', () => {
    renderWithRoute(1)
    expect(screen.getByRole('tab', { name: 'Benefits', selected: true })).toBeTruthy()
  })

  it('selects correct tab for Health route', () => {
    renderWithRoute(2)
    expect(screen.getByRole('tab', { name: 'Health', selected: true })).toBeTruthy()
  })

  it('selects correct tab for Payments route', () => {
    renderWithRoute(3)
    expect(screen.getByRole('tab', { name: 'Payments', selected: true })).toBeTruthy()
  })
})

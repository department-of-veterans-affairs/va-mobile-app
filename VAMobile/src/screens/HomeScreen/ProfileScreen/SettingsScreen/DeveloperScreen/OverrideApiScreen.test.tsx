import React from 'react'

import { fireEvent, screen, within } from '@testing-library/react-native'
import { t } from 'i18next'

import OverrideAPIScreen, {
  APIGroupings,
} from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/OverrideApiScreen'
import { QueriesData, context, mockNavProps, render } from 'testUtils'

context('OverrideApiScreen', () => {
  const initializeTestInstance = (queriesData?: QueriesData) => {
    const props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: jest.fn(),
      },
    )
    render(<OverrideAPIScreen {...props} />, { queriesData })
  }

  it('renders correctly', () => {
    initializeTestInstance()
    expect(screen.getByRole('header', { name: t('overrideAPI') })).toBeTruthy()
  })

  it('selects the network checkbox', () => {
    initializeTestInstance()
    expect(screen.getByRole('header', { name: t('overrideAPI') })).toBeTruthy()
    const allEndpoints = APIGroupings.flatMap((group) => group.endpoints)

    allEndpoints.forEach((endpoint, index) => {
      const networkCheckbox = screen.getByTestId(`${endpoint}_network`)
      expect(screen.queryAllByA11yState({ checked: true })).toHaveLength(index)
      fireEvent.press(networkCheckbox)
      expect(screen.queryAllByA11yState({ checked: true })).toHaveLength(index + 1)
    })
  })

  it('selects the backend override checkbox', () => {
    initializeTestInstance()
    const allEndpoints = APIGroupings.flatMap((group) => group.endpoints)

    allEndpoints.forEach((endpoint) => {
      const beOverrideCheckbox = screen.getByTestId(`${endpoint}_backendOverride`)
      const beTitle = `${endpoint}_backendOverride_title`
      const beBody = `${endpoint}_backendOverride_body`
      const bePhone = `${endpoint}_backendOverride_telephone`
      const beRefreshable = `${endpoint}_backendOverride_refreshable`
      expect(within(beOverrideCheckbox).getByRole('checkbox').props.accessibilityState.checked).toBe(false)
      expect(screen.queryByTestId(beTitle)).toBeFalsy()
      expect(screen.queryByTestId(beBody)).toBeFalsy()
      expect(screen.queryByTestId(bePhone)).toBeFalsy()
      expect(screen.queryByTestId(beRefreshable)).toBeFalsy()
      fireEvent.press(beOverrideCheckbox)
      expect(within(beOverrideCheckbox).getByRole('checkbox').props.accessibilityState.checked).toBe(true)

      const beTitleInput = screen.getByTestId(beTitle)
      expect(beTitleInput).toBeTruthy()
      fireEvent.changeText(beTitleInput, 'BE Title')
      expect(beTitleInput.props.value).toEqual('BE Title')

      const beBodyInput = screen.getByTestId(beBody)
      expect(beBodyInput).toBeTruthy()
      fireEvent.changeText(beBodyInput, 'BE Body')
      expect(beBodyInput.props.value).toEqual('BE Body')

      const bePhoneInput = screen.getByTestId(bePhone)
      expect(bePhoneInput).toBeTruthy()
      fireEvent.changeText(bePhoneInput, '12345')
      expect(bePhoneInput.props.value).toEqual('12345')

      const refreshableCheckBox = screen.getByTestId(beRefreshable)
      expect(refreshableCheckBox).toBeTruthy()
      expect(within(refreshableCheckBox).getByRole('checkbox').props.accessibilityState.checked).toBe(false)
      fireEvent.press(refreshableCheckBox)
      expect(within(refreshableCheckBox).getByRole('checkbox').props.accessibilityState.checked).toBe(true)
    })
  })

  it('selects the other codes checkbox', () => {
    initializeTestInstance()
    const allEndpoints = APIGroupings.flatMap((group) => group.endpoints)

    allEndpoints.forEach((endpoint) => {
      const otherCodesCheckbox = screen.getByTestId(`otherSelector-${endpoint}`)
      expect(within(otherCodesCheckbox).getByRole('checkbox').props.accessibilityState.checked).toBe(false)
      expect(screen.queryByTestId(`otherStatus-${endpoint}`)).toBeFalsy()

      fireEvent.press(otherCodesCheckbox)

      expect(within(otherCodesCheckbox).getByRole('checkbox').props.accessibilityState.checked).toBe(true)
      const otherStatusInput = screen.getByTestId(`otherStatus-${endpoint}`)
      expect(otherStatusInput).toBeTruthy()
      fireEvent.changeText(otherStatusInput, '12345')
      expect(otherStatusInput.props.value).toEqual('12345')
    })
  })
})

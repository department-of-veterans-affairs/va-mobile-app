import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import WaygateEditScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/WaygateEditScreen'
import { QueriesData, context, mockNavProps, render } from 'testUtils'

context('WaygateEditScreen', () => {
  const goBackFn = jest.fn()
  const initializeTestInstance = (queriesData?: QueriesData) => {
    const props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: goBackFn,
      },
      {
        params: {
          waygateName: 'testWGName',
          waygate: { appUpdateButton: false, enabled: true },
        },
      },
    )

    render(<WaygateEditScreen {...props} />, { queriesData })
  }

  it('renders correctly', () => {
    initializeTestInstance()
    expect(screen.getByRole('header', { name: 'Edit: testWGName' })).toBeTruthy()
  })

  it('changes input correctly', () => {
    initializeTestInstance()

    const typeInput = screen.getByTestId('AFTypeTestID')
    fireEvent.changeText(typeInput, 'AllowFunction')
    expect(typeInput.props.value).toEqual('AllowFunction')

    const errMsgTitleInput = screen.getByTestId('AFErrorMsgTitleTestID')
    fireEvent.changeText(errMsgTitleInput, 'Error title')
    expect(errMsgTitleInput.props.value).toEqual('Error title')

    const errMsgBodyInput = screen.getByTestId('AFErrorMsgBodyTestID')
    fireEvent.changeText(errMsgBodyInput, 'Error body')
    expect(errMsgBodyInput.props.value).toEqual('Error body')

    const errMsgBody2Input = screen.getByTestId('AFErrorMsgBodyV2TestID')
    fireEvent.changeText(errMsgBody2Input, 'Error body 2')
    expect(errMsgBody2Input.props.value).toEqual('Error body 2')

    const errPhoneInput = screen.getByTestId('AFErrorPhoneNumberTestID')
    fireEvent.changeText(errPhoneInput, 'Error phone')
    expect(errPhoneInput.props.value).toEqual('Error phone')
  })

  it('calls save and navigates back', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByText(t('save')))
    expect(goBackFn).toHaveBeenCalled()
  })

  it('toggles switches', () => {
    initializeTestInstance()

    const enabledToggle = screen.getByRole('switch', { name: 'Enabled' })
    expect(enabledToggle.props.accessibilityState.checked).toBe(true)
    fireEvent.press(enabledToggle)
    expect(enabledToggle.props.accessibilityState.checked).toBe(false)

    const appUpdateToggle = screen.getByRole('switch', { name: 'appUpdateButton' })
    expect(appUpdateToggle.props.accessibilityState.checked).toBe(false)
    fireEvent.press(appUpdateToggle)
    expect(appUpdateToggle.props.accessibilityState.checked).toBe(true)
  })
})

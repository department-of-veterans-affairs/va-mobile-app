import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import InAppRecruitmentScreen from './InAppRecruitmentScreen'

const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useBeforeNavBackListener: jest.fn(),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useNavigationState: () => jest.fn(),
  }
})

mockNavigationSpy.mockReturnValue(jest.fn())

context('InAppRecruitmentScreen', () => {
  beforeEach(() => {
    render(<InAppRecruitmentScreen {...mockNavProps(undefined, { setOptions: jest.fn(), navigate: jest.fn() })} />)
  })

  it('renders screen correctly', () => {
    expect(screen.getByLabelText('Give feedback')).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Make this app better for all Veterans' })).toBeTruthy()
    expect(screen.getByText('You can help us improve this app by being part of online feedback sessions.')).toBeTruthy()
    expect(screen.getByText('Register once by completing a 5-minute questionnaire.')).toBeTruthy()
    expect(screen.getByText('Wait to be matched with a session.')).toBeTruthy()
    expect(screen.getByText('Get paid for each session you complete (excludes VA employees).')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Go to questionnaire' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Learn more about the Veteran Usability Project' })).toBeTruthy()
    expect(screen.getByText('VA contracts: 36C10B22C0011 & 36C10X18C0061')).toBeTruthy()
  })

  it('goes to the questionnaire when button is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Go to questionnaire' }))
    const expectNavArgs = {
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSfRb0OtW34qKm8tGoQwwwDFs8IqwOMCLTde3DeM-ukKOEZBnA/viewform',
      displayTitle: 'va.gov',
      loadingMessage: 'Loading questionnaire...',
    }
    expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', expectNavArgs)
  })

  it('goes to the Veteran Usability Project when link is pressed', () => {
    fireEvent.press(screen.getByRole('link', { name: 'Learn more about the Veteran Usability Project' }))
    expect(Alert.alert).toBeCalled()
  })
})

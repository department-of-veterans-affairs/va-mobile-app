import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { context, mockNavProps, render } from 'testUtils'
import InAppRecruitmentScreen from './InAppRecruitmentScreen'

const mockNavigationSpy = jest.fn()
const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('CollapsibleMessage', () => {

  const initializeTestInstance = () => {
    render(<InAppRecruitmentScreen {...mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })}/>)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('renders screen correctly', () => {
    expect(screen.getByLabelText('Give feedback')).toBeTruthy()
    expect(screen.getByText('Make this app better for all Veterans')).toBeTruthy()
    expect(screen.getByText('You can help us improve this app by being part of online feedback sessions.')).toBeTruthy()
    expect(screen.getByText('Register once by completing a 5-minute questionnaire.')).toBeTruthy()
    expect(screen.getByText('Wait to be matched with a session.')).toBeTruthy()
    expect(screen.getByText('Get paid for each session you complete (excludes VA employees).')).toBeTruthy()
    expect(screen.getByText('Go to questionnaire')).toBeTruthy()
    expect(screen.getByText('Learn more about the Veteran Usability Project')).toBeTruthy()
    expect(screen.getByText('VA contracts: 36C10B22C0011 & 36C10X18C0061')).toBeTruthy()
  })

  it('Goes to the questionnaire when button pressed', () => {
    fireEvent.press(screen.getByText('Go to questionnaire'))
    const expectNavArgs = {
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSfRb0OtW34qKm8tGoQwwwDFs8IqwOMCLTde3DeM-ukKOEZBnA/viewform',
        displayTitle: 'va.gov',
        loadingMessage: 'Loading questionnaire...',
    }
    expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', expectNavArgs)
  })

  it('Goes to the Veteran Usability Project when link pressed', () => {
    fireEvent.press(screen.getByText('Learn more about the Veteran Usability Project'))
    expect(mockExternalLinkSpy).toBeCalledWith('https://veteranusability.us/')
  })
})

import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

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
    expect(screen.getByLabelText(t('giveFeedback'))).toBeTruthy()
    expect(screen.getByRole('header', { name: t('inAppRecruitment.makeAppBetter.header') })).toBeTruthy()
    expect(screen.getByText(t('inAppRecruitment.makeAppBetter.body'))).toBeTruthy()
    expect(screen.getByText(t('inAppRecruitment.makeAppBetter.bullet.1'))).toBeTruthy()
    expect(screen.getByText(t('inAppRecruitment.makeAppBetter.bullet.2'))).toBeTruthy()
    expect(screen.getByText(t('inAppRecruitment.makeAppBetter.bullet.3'))).toBeTruthy()
    expect(screen.getByRole('button', { name: t('inAppRecruitment.goToQuestionnaire') })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('inAppRecruitment.learnMore') })).toBeTruthy()
    expect(screen.getByText(t('inAppRecruitment.contracts'))).toBeTruthy()
  })

  it('goes to the questionnaire when button is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: t('inAppRecruitment.goToQuestionnaire') }))
    const expectNavArgs = {
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSfRb0OtW34qKm8tGoQwwwDFs8IqwOMCLTde3DeM-ukKOEZBnA/viewform',
      displayTitle: t('webview.vagov'),
      loadingMessage: t('inAppRecruitment.goToQuestionnaire.loading'),
    }
    expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', expectNavArgs)
  })

  it('goes to the Veteran Usability Project when link is pressed', () => {
    fireEvent.press(screen.getByRole('link', { name: t('inAppRecruitment.learnMore') }))
    expect(Alert.alert).toBeCalled()
  })
})

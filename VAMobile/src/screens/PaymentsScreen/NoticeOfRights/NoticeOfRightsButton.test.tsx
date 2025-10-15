import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import NoticeOfRightsButton from 'screens/PaymentsScreen/NoticeOfRights/NoticeOfRightsButton'
import { context, render } from 'testUtils'

const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('NoticeOfRightsButton', () => {
  const initializeTestInstance = () => {
    render(<NoticeOfRightsButton />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('renders the button with the correct title', () => {
    initializeTestInstance()
    expect(screen.getByText(t('debts.noticeOfRights.title'))).toBeTruthy()
  })

  it('calls navigateTo when pressed', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByText(t('debts.noticeOfRights.title')))
    expect(mockNavigationSpy).toHaveBeenCalledWith('NoticeOfRights')
  })
})

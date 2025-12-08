import React from 'react'

import { t } from 'i18next'

import NoticeOfRightsScreen from 'screens/PaymentsScreen/NoticeOfRights/NoticeOfRightsScreen'
import { context, fireEvent, mockNavProps, render, screen, waitFor } from 'testUtils'

const accordions = [
  t('debts.noticeOfRights.collection.header'),
  t('debts.noticeOfRights.lateCharges.header'),
  t('debts.noticeOfRights.rightToDispute.header'),
  t('debts.noticeOfRights.rightToRequestWaiver.header'),
  t('debts.noticeOfRights.effectOfWaiverRequest.header'),
  t('debts.noticeOfRights.oralHearing.header'),
  t('debts.noticeOfRights.copaysHardship.header'),
  t('debts.noticeOfRights.overpaymentsHardship.header'),
  t('debts.noticeOfRights.representation.header'),
  t('debts.noticeOfRights.questionsAboutPayments.header'),
  t('debts.noticeOfRights.vaPrivacy.header'),
  t('debts.noticeOfRights.managingStress.header'),
]

const mockNavigationBack = jest.fn()
const mockNavigationSpy = jest.fn()

context('NoticeOfRightsScreen', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps(
      {},
      {
        goBack: mockNavigationBack,
        navigate: mockNavigationSpy,
      },
    )

    render(<NoticeOfRightsScreen {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('renders the screen with the correct title', async () => {
    initializeTestInstance()
    await waitFor(() => expect(screen.getByRole('header', { name: t('debts.noticeOfRights.title') })).toBeTruthy())
  })

  it('renders all accordion headers', async () => {
    for (const header of accordions) {
      await waitFor(() => expect(screen.getByRole('header', { name: header })).toBeTruthy())
    }
  })

  it('calls navigation.goBack when back label is pressed', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('noticeOfRightsBackTestID'))
    expect(mockNavigationBack).toHaveBeenCalled()
  })
})

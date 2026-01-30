import React from 'react'

import { t } from 'i18next'

import { DebtRecord } from 'api/types/DebtData'
import DebtDetailsScreen from 'screens/PaymentsScreen/Debts/DebtDetails/DebtDetailsScreen'
import { context, fireEvent, mockNavProps, render, screen, waitFor } from 'testUtils'

const debtDataMock = {
  id: '1',
  type: 'debt',
  attributes: {
    deductionCode: '11',
    diaryCode: '600',
    benefitType: 'Compensation',
    currentAr: 123.45,
    originalAr: 678.9,
    debtHistory: [
      {
        date: '09/18/2012',
        letterCode: '100',
        description: 'First Demand Letter - Inactive Benefits - Due Process',
      },
    ],
  },
} as DebtRecord

const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('DebtDetailsScreen', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps(
      {},
      {
        navigate: mockNavigationSpy,
      },
      {
        params: { debt: debtDataMock },
      },
    )

    render(<DebtDetailsScreen {...props} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    initializeTestInstance()
  })

  it('renders the screen with the correct title', async () => {
    initializeTestInstance()
    await waitFor(() => expect(screen.getByRole('header', { name: t('debts.details.title') })).toBeTruthy())
  })

  it('renders the updated date', async () => {
    initializeTestInstance()
    await waitFor(() =>
      expect(screen.getByText(t('debts.details.updated', { date: 'September 18, 2012' }))).toBeTruthy(),
    )
  })

  it('renders the alert', async () => {
    initializeTestInstance()
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: t('debts.details.alert.header.continueMonthlyPayments') }),
      ).toBeTruthy(),
    )
  })

  it('renders the why debt link and navigates to DebtHelp screen on press', async () => {
    initializeTestInstance()
    const whyDebtLink = await screen.findByTestId('debtsHelpWhyLinkID')
    expect(whyDebtLink).toBeTruthy()
    fireEvent.press(whyDebtLink)
    expect(mockNavigationSpy).toHaveBeenCalledWith('DebtHelp', { helpType: 'whyEducationDebt', titleKey: t('help') })
  })

  it('renders the debt card header, current balance, original amound and due date', async () => {
    initializeTestInstance()
    await waitFor(() => expect(screen.getByText(t('debts.deductionCode.post911Books'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText('$123.45')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('$678.90')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('October 18, 2012')).toBeTruthy())
  })

  it('renders the debt history accordion', async () => {
    initializeTestInstance()
    await waitFor(() => expect(screen.getByText(t('debts.letter.history.header'))).toBeTruthy())
  })

  it('renders the notice of rights and navigates to NoticeOfRights screen on press', async () => {
    initializeTestInstance()
    const noticeOfRightsButton = screen.getByText(t('debts.noticeOfRights.title'))
    await waitFor(() => expect(noticeOfRightsButton).toBeTruthy())
    fireEvent.press(noticeOfRightsButton)
    await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalledWith('NoticeOfRights'))
  })

  it('renders the help section', async () => {
    initializeTestInstance()
    await waitFor(() => expect(screen.getByText(t('debts.help.questions.header'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('debts.help.questions.body.1'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('debts.help.questions.body.2'))).toBeTruthy())
  })
})

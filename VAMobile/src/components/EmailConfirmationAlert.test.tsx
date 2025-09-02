import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { contactInformationKeys } from 'api/contactInformation'
import { EmailData, UserContactInformation } from 'api/types'
import { EmailConfirmationAlert } from 'components'
import { QueriesData, context, mockNavProps, render } from 'testUtils'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  return {
    ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('EmailConfirmationAlert', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderWithData = (contactInfo: Partial<UserContactInformation>, inContactInfoScreen?: boolean) => {
    let queriesData: QueriesData | undefined
    const props = mockNavProps({ inContactInfoScreen }, { navigate: mockNavigationSpy })

    if (contactInfo) {
      queriesData = [
        {
          queryKey: contactInformationKeys.contactInformation,
          data: {
            ...contactInfo,
          },
        },
      ]
    }
    render(<EmailConfirmationAlert {...props} />, { queriesData })
  }

  context('Update email', () => {
    const contactEmail: EmailData = {
      emailAddress: 'testUpdate@test.com',
      id: '12345',
    }

    it('renders correctly with email associated', async () => {
      renderWithData({ contactEmail })
      expect(screen.findByText(t('email.alert.title'))).toBeTruthy()
      expect(screen.findByText(t('email.alert.body'))).toBeTruthy()
      expect(screen.findByText(contactEmail.emailAddress)).toBeTruthy()
      expect(screen.findByRole('button', { name: t('confirm') })).toBeTruthy()
      expect(screen.findByRole('button', { name: t('email.alert.confirm.secondary.action') })).toBeTruthy()
    })

    it('renders correctly within contact information screen', async () => {
      renderWithData({ contactEmail }, true)
      expect(screen.findByText(t('email.alert.contact.title'))).toBeTruthy()
      expect(screen.findByRole('button', { name: t('confirm') })).toBeTruthy()
    })

    it('navigates to edit email screen on secondary click', async () => {
      renderWithData({ contactEmail })
      const secondaryButton = await screen.findByRole('button', { name: t('email.alert.confirm.secondary.action') })
      fireEvent.press(secondaryButton)
      expect(mockNavigationSpy).toHaveBeenCalledWith('EditEmail')
    })

    it('dismisses the alert by confirming', async () => {
      const setEmailMock = AsyncStorage.setItem as jest.Mock
      renderWithData({ contactEmail })
      const primaryButton = await screen.findByRole('button', { name: t('confirm') })
      fireEvent.press(primaryButton)
      expect(setEmailMock).toHaveBeenCalledWith('@confirm_email_alert_dismissed', 'true')
    })
  })

  context('Add email', () => {
    const contactEmail = null

    it('renders correctly for with no email associated', async () => {
      renderWithData({ contactEmail })
      expect(screen.findByText(t('email.alert.title'))).toBeTruthy()
      expect(screen.findByText(t('email.alert.body'))).toBeTruthy()
      expect(screen.findByRole('button', { name: t('email.alert.add.primary.action') })).toBeTruthy()
      expect(screen.findByRole('button', { name: t('email.alert.add.secondary.action') })).toBeTruthy()
    })

    it('renders within contact information screen', async () => {
      renderWithData({ contactEmail }, true)
      expect(screen.findByText(t('email.alert.contact.title'))).toBeTruthy()
    })

    it('navigates to edit email screen on primary click', async () => {
      renderWithData({ contactEmail })
      const primaryButton = await screen.findByRole('button', { name: t('email.alert.add.primary.action') })
      fireEvent.press(primaryButton)
      expect(mockNavigationSpy).toHaveBeenCalledWith('EditEmail')
    })

    it('dismisses the alert by denying', async () => {
      const setEmailMock = AsyncStorage.setItem as jest.Mock
      renderWithData({ contactEmail })
      const secondaryButton = await screen.findByRole('button', { name: t('email.alert.add.secondary.action') })
      fireEvent.press(secondaryButton)
      expect(setEmailMock).toHaveBeenCalledWith('@confirm_email_alert_dismissed', 'true')
    })
  })
})

import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { contactInformationKeys } from 'api/contactInformation'
import { EmailData, UserContactInformation } from 'api/types'
import { EmailConfirmationAlert } from 'components'
import { put } from 'store/api'
import { QueriesData, context, mockNavProps, render } from 'testUtils'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  return {
    ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const beforeMarch2025 = new Date('2025-02-28T12:00:00.000Z').toISOString()
const afterMarch2025 = new Date('2025-03-02T12:00:00.000Z').toISOString()

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
    return render(<EmailConfirmationAlert {...props} />, { queriesData })
  }

  context('Update email', () => {
    const contactEmail: EmailData = {
      emailAddress: 'testUpdate@test.com',
      id: '12345',
    }

    it('renders correctly with email associated', async () => {
      renderWithData({ contactEmail })
      expect(screen.findByText(t('email.alert.confirm.title'))).toBeTruthy()
      expect(screen.findByText(t('email.alert.body'))).toBeTruthy()
      expect(screen.findByText(contactEmail.emailAddress)).toBeTruthy()
      expect(screen.findByRole('button', { name: t('confirm') })).toBeTruthy()
      expect(screen.findByRole('button', { name: t('email.alert.confirm.secondary.action') })).toBeTruthy()
    })

    it('renders correctly within contact information screen', async () => {
      renderWithData({ contactEmail }, true)
      expect(screen.findByText(t('email.alert.contact.confirm.title'))).toBeTruthy()
      expect(screen.findByRole('button', { name: t('confirm') })).toBeTruthy()
    })

    it('navigates to edit email screen on secondary click', async () => {
      renderWithData({ contactEmail })
      const secondaryButton = await screen.findByRole('button', { name: t('email.alert.confirm.secondary.action') })
      fireEvent.press(secondaryButton)
      expect(mockNavigationSpy).toHaveBeenCalledWith('EditEmail')
    })

    it('dismisses the alert by confirming', async () => {
      const payload = {
        id: contactEmail.id,
        emailAddress: contactEmail.emailAddress,
        confirmationDate: expect.anything(),
      }
      renderWithData({ contactEmail })
      const primaryButton = await screen.findByRole('button', { name: t('confirm') })
      fireEvent.press(primaryButton)
      await waitFor(() => expect(put as jest.Mock).toBeCalledWith('/v0/user/emails', payload))
    })
  })

  context('Add email', () => {
    const contactEmail = null

    it('renders correctly for with no email associated', async () => {
      renderWithData({ contactEmail })
      expect(screen.findByText(t('email.alert.add.title'))).toBeTruthy()
      expect(screen.findByText(t('email.alert.body'))).toBeTruthy()
      expect(screen.findByRole('button', { name: t('email.alert.add.primary.action') })).toBeTruthy()
      expect(screen.findByRole('button', { name: t('email.alert.add.secondary.action') })).toBeTruthy()
    })

    it('renders within contact information screen', async () => {
      renderWithData({ contactEmail }, true)
      expect(screen.findByText(t('email.alert.contact.add.title'))).toBeTruthy()
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

  context('Alert Hidden', () => {
    it('hides alert if email has been confirmed after March 1, 2025', () => {
      const contactEmail: EmailData = {
        emailAddress: 'testUpdate@test.com',
        id: '12345',
        confirmationDate: afterMarch2025,
      }
      renderWithData({ contactEmail })
      expect(screen.queryByText(t('email.alert.confirm.title'))).toBeFalsy()
    })

    it('shows alert if email is stale', async () => {
      const contactEmail: EmailData = {
        emailAddress: 'testUpdate@test.com',
        id: '12345',
        confirmationDate: beforeMarch2025,
      }
      renderWithData({ contactEmail })

      const alertTitle = await screen.findByText(t('email.alert.confirm.title'))
      expect(alertTitle).toBeTruthy()
    })
  })
})

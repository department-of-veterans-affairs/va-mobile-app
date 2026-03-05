import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import ContactUsDebtButton from 'screens/PaymentsScreen/Debts/ContactUs/ContactUsDebtButton'
import { context, render } from 'testUtils'

const mockShowActionSheetWithOptions = jest.fn()
const mockLaunchExternalLink = jest.fn()

jest.mock('utils/hooks', () => ({
  useTheme: () => ({
    dimensions: { buttonPadding: 2 },
  }),
  useShowActionSheet: () => mockShowActionSheetWithOptions,
  useExternalLink: () => mockLaunchExternalLink,
}))

jest.mock('utils/env', () => () => ({
  LINK_URL_ASK_VA_GOV: 'https://www.va.gov/contact-us/ask-va/introduction',
}))

context('ContactUsDebtButton', () => {
  const initializeTestInstance = (props = {}) => {
    render(<ContactUsDebtButton {...props} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders button with correct label', () => {
    initializeTestInstance()

    expect(screen.getByRole('button', { name: t('debts.contactUs') })).toBeTruthy()
  })

  it('calls showActionSheet with correct options when pressed', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByRole('button', { name: t('debts.contactUs') }))

    expect(mockShowActionSheetWithOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        options: [
          `${t('debts.contactUs.tollFree')}: 800-827-0648`,
          `${t('debts.contactUs.tty')}: 711`,
          `${t('debts.contactUs.international')}: +1-612-713-6415`,
          t('debts.contactUs.askVa'),
          t('cancel'),
        ],
        title: t('debts.contactUs.title'),
        message: t('debts.contactUs.subTitle'),
        cancelButtonIndex: 4,
      }),
      expect.any(Function),
    )
  })

  it('does not include Ask VA option when showAskVAOption is false', () => {
    initializeTestInstance({ showAskVAOption: false })

    fireEvent.press(screen.getByRole('button', { name: t('debts.contactUs') }))

    expect(mockShowActionSheetWithOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        options: [
          `${t('debts.contactUs.tollFree')}: 800-827-0648`,
          `${t('debts.contactUs.tty')}: 711`,
          `${t('debts.contactUs.international')}: +1-612-713-6415`,
          t('cancel'),
        ],
        title: t('debts.contactUs.title'),
        message: t('debts.contactUs.subTitle'),
        cancelButtonIndex: 3,
      }),
      expect.any(Function),
    )
  })

  it('launches toll free phone number when selected', async () => {
    initializeTestInstance()

    fireEvent.press(screen.getByRole('button', { name: t('debts.contactUs') }))
    const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

    await actionSheetCallback(0)

    expect(mockLaunchExternalLink).toHaveBeenCalledWith('tel:8008270648')
  })

  it('launches TTY phone number when selected', async () => {
    initializeTestInstance()

    fireEvent.press(screen.getByRole('button', { name: t('debts.contactUs') }))
    const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

    await actionSheetCallback(1)

    expect(mockLaunchExternalLink).toHaveBeenCalledWith('tel:711')
  })

  it('launches international phone number when selected', async () => {
    initializeTestInstance()

    fireEvent.press(screen.getByRole('button', { name: t('debts.contactUs') }))
    const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

    await actionSheetCallback(2)

    expect(mockLaunchExternalLink).toHaveBeenCalledWith('tel:+16127136415')
  })

  it('launches Ask VA link when selected', async () => {
    initializeTestInstance()

    fireEvent.press(screen.getByRole('button', { name: t('debts.contactUs') }))
    const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

    await actionSheetCallback(3)

    expect(mockLaunchExternalLink).toHaveBeenCalledWith('https://www.va.gov/contact-us/ask-va/introduction')
  })

  it('launches custom Ask VA link when provided', async () => {
    const customUrl = 'https://www.example.com/ask-va'
    initializeTestInstance({ askVaUrl: customUrl })

    fireEvent.press(screen.getByRole('button', { name: t('debts.contactUs') }))
    const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

    await actionSheetCallback(3)

    expect(mockLaunchExternalLink).toHaveBeenCalledWith(customUrl)
  })

  it('does nothing when cancel is selected', async () => {
    initializeTestInstance()

    fireEvent.press(screen.getByRole('button', { name: t('debts.contactUs') }))
    const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

    await actionSheetCallback(4)

    expect(mockLaunchExternalLink).not.toHaveBeenCalled()
  })
})

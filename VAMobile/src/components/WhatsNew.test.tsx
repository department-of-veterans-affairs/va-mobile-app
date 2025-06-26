import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { InitialState } from 'store/slices'
import { context, render, when } from 'testUtils'
import { getLocalVersion, getVersionSkipped, setVersionSkipped } from 'utils/homeScreenAlerts'
import { featureEnabled } from 'utils/remoteConfig'

import WhatsNew from './WhatsNew'

jest.mock('utils/remoteConfig')

const mockT = jest.fn()
jest.mock('react-i18next', () => {
  const original = jest.requireActual('react-i18next')
  return {
    ...original,
    useTranslation: () => {
      return {
        t: mockT,
      }
    },
  }
})

const NEWS_LIST = {
  SSO_TEXT: `Single sign on for VA has been updated`,
  SSO_TEXT_A11Y: `Single sign on for V-A has been updated`,
  BULLET1: 'Prescriptions SS to webview',
  BULLET2: 'Medication SSO to webview',
}

context('WhatsNew', () => {
  const initializeTestInstance = (mockWhatsNewUI: boolean, localVersion = '0.0', skippedVersion = '0.0') => {
    when(featureEnabled as jest.Mock)
      .calledWith('whatsNewUI')
      .mockReturnValue(mockWhatsNewUI)
    when(getLocalVersion).mockReturnValue(Promise.resolve(localVersion))
    when(getVersionSkipped).mockReturnValue(Promise.resolve(skippedVersion))

    // const BODY_PREFIX = `whatsNew.bodyCopy.${localVersion}`
    // const body = t(BODY_PREFIX)
    // body !== BODY_PREFIX -> requires us to mock out our own translation (t) so that we can render the component
    when(mockT)
      .calledWith('whatsNew.title')
      .mockReturnValue(t('whatsNew.title'))
      .calledWith('whatsNew.dismissMessage')
      .mockReturnValue(t('whatsNew.dismissMessage'))
      .calledWith(`whatsNew.bodyCopy.${localVersion}`)
      .mockReturnValue(NEWS_LIST.SSO_TEXT)
      .calledWith(`whatsNew.bodyCopy.${localVersion}.a11yLabel`)
      .mockReturnValue(NEWS_LIST.SSO_TEXT_A11Y)
      .defaultReturnValue('')
      .calledWith(`whatsNew.bodyCopy.${localVersion}.bullet.1`)
      .mockReturnValue(NEWS_LIST.BULLET1)
      .calledWith(`whatsNew.bodyCopy.${localVersion}.bullet.2`)
      .mockReturnValue(NEWS_LIST.BULLET2)

    render(<WhatsNew />, {
      preloadedState: {
        ...InitialState,
        demo: {
          demoMode: true,
        },
      },
    })
  }

  it('should not render when "whatsNewUI" is not enabled', async () => {
    initializeTestInstance(false)
    await waitFor(() => expect(screen.queryByText(t('whatsNew.title'))).toBeFalsy())
  })

  it('should not render when "whatsNewUI" is enabled and version is skipped', async () => {
    initializeTestInstance(true, '1.1', '1.1')
    await waitFor(() => expect(screen.queryByText(t('whatsNew.title'))).toBeFalsy())
  })

  it('should render when "whatsNewUI" is enabled and version is not skipped', async () => {
    initializeTestInstance(true, '1.1', '1.0')
    await waitFor(async () => {
      const title = await screen.findByText(t('whatsNew.title'))
      return expect(title).toBeTruthy()
    })
  })

  it('should render details when expanded ', async () => {
    initializeTestInstance(true, '1.1', '1.0')
    await waitFor(() => fireEvent.press(screen.getByRole('tab', { name: t('whatsNew.title') })))
    expect(screen.getByText(NEWS_LIST.SSO_TEXT)).toBeTruthy()
    expect(screen.getByText(NEWS_LIST.BULLET1)).toBeTruthy()
    expect(screen.getByText(NEWS_LIST.BULLET2)).toBeTruthy()
  })

  it('should set the next skip version when dismissed ', async () => {
    initializeTestInstance(true, '1.1', '1.0')
    expect(setVersionSkipped).not.toBeCalled()

    await waitFor(() => fireEvent.press(screen.getByRole('tab', { name: t('whatsNew.title') })))
    await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('whatsNew.dismissMessage') })))

    expect(setVersionSkipped).toBeCalledWith(undefined, '1.1')
  })
})

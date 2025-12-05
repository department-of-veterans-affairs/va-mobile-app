import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import WhatsNew, { getWhatsNewConfig } from 'components/WhatsNew'
import { InitialState } from 'store/slices'
import { context, render, when } from 'testUtils'
import { FeatureToggleType, featureEnabled } from 'utils/remoteConfig'

const mockGetConfig = jest.fn()
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

jest.mock('components/WhatsNew', () => {
  const original = jest.requireActual('components/WhatsNew')

  return {
    ...original,
    getWhatsNewConfig: mockGetConfig,
  }
})

const featureConfigs = {
  empty: [],
  oneFeatureNoFlag: [
    {
      featureName: 'testFeatureNoFlag',
    },
  ],
  twoFeaturesOneFlag: [
    {
      featureName: 'testFeature',
      featureFlag: 'featureflag1',
    },
    {
      featureName: 'testFeatureNoFlag',
    },
  ],
}

context('WhatsNew', () => {
  const initializeTestInstance = (featureName: string, featureFlag?: string, flagEnabled?: boolean) => {
    when(mockGetConfig).calledWith().mockReturnValue(featureConfigs[featureName])

    if (featureFlag) {
      when(featureEnabled)
        .calledWith(featureFlag as FeatureToggleType)
        .mockReturnValue(flagEnabled)
    }

    // The component uses translation keys to hide and show its element, therefore we need to mock out translation to get it to render
    when(mockT)
      .calledWith('whatsNew.title')
      .mockReturnValue(t('whatsNew.title'))
      .calledWith('whatsNew.dismissMessage')
      .mockReturnValue(t('whatsNew.dismissMessage'))
      .calledWith(`whatsNew.bodyCopy.${featureName}`)
      .mockReturnValue(`${featureName} main text`)
      .calledWith(`whatsNew.bodyCopy.${featureName}.a11yLabel`)
      .mockReturnValue(`${featureName} a11y label`)
      .defaultReturnValue('')
      .calledWith(`whatsNew.bodyCopy.${featureName}.bullet.1`)
      .mockReturnValue(`${featureName} bullet 1`)
      .calledWith(`whatsNew.bodyCopy.${featureName}.bullet.2`)
      .mockReturnValue(`${featureName} bullet 2`)

    render(<WhatsNew />, {
      preloadedState: {
        ...InitialState,
        demo: {
          demoMode: true,
        },
      },
    })
  }

  it('should not render when no features are listed', async () => {
    initializeTestInstance('empty')
    await waitFor(() => expect(screen.queryByText(t('whatsNew.title'))).toBeFalsy())
  })

  // it('should render a feature that has not been skipped', async () => {
  //   initializeTestInstance('oneFeatureNoFlag')
  //   await waitFor(async () => {
  //     const title = await screen.findByText(t('whatsNew.title'))
  //     return expect(title).toBeTruthy()
  //   })
  // })

  // it('should render details when expanded ', async () => {
  //   initializeTestInstance('1.1', '1.0')
  //   await waitFor(() => fireEvent.press(screen.getByRole('tab', { name: t('whatsNew.title') })))
  //   expect(screen.getByText(NEWS_LIST.SSO_TEXT)).toBeTruthy()
  //   expect(screen.getByText(NEWS_LIST.BULLET1)).toBeTruthy()
  //   expect(screen.getByText(NEWS_LIST.BULLET2)).toBeTruthy()
  // })
  //
  // it('should set the next skip version when dismissed ', async () => {
  //   initializeTestInstance('1.1', '1.0')
  //   expect(setVersionSkipped).not.toBeCalled()
  //
  //   await waitFor(() => fireEvent.press(screen.getByRole('tab', { name: t('whatsNew.title') })))
  //   await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('whatsNew.dismissMessage') })))
  //
  //   expect(setVersionSkipped).toBeCalledWith(undefined, '1.1')
  // })
})

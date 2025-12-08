import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import WhatsNew from 'components/WhatsNew'
import { WhatsNewConfigItem } from 'constants/whatsNew'
import { InitialState } from 'store/slices'
import { context, render, when } from 'testUtils'
import { FeatureToggleType } from 'utils/remoteConfig'
import { APP_FEATURES_WHATS_NEW_SKIPPED_VAL } from 'utils/whatsNew'

jest.mock('react-i18next', () => {
  const original = jest.requireActual('react-i18next')
  return {
    ...original,
    useTranslation: () => {
      return {
        t: (key: string) => key,
      }
    },
  }
})

let mockGetConfig: jest.Mock<WhatsNewConfigItem[]>
jest.mock('constants/whatsNew', () => {
  const original = jest.requireActual('constants/whatsNew')
  mockGetConfig = jest.fn()

  return {
    ...original,
    getWhatsNewConfig: mockGetConfig,
  }
})

let mockFeatureEnabled: jest.Mock
jest.mock('utils/remoteConfig', () => {
  const original = jest.requireActual('utils/remoteConfig')
  mockFeatureEnabled = jest.fn()

  return {
    ...original,
    featureEnabled: mockFeatureEnabled,
  }
})

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

const featureConfigs: Record<string, WhatsNewConfigItem[]> = {
  empty: [],
  oneFeatureNoFlag: [
    {
      featureName: 'testFeatureNoFlag',
    },
  ],
  twoFeaturesOneFlag: [
    {
      featureName: 'testFeature',
      featureFlag: 'testFeature',
    },
    {
      featureName: 'testFeatureNoFlag',
    },
  ],
}

context('WhatsNew', () => {
  const initializeTestInstance = (featureName: string, featureFlag?: string, flagEnabled?: boolean) => {
    mockGetConfig.mockImplementation(() => featureConfigs[featureName])
    if (featureFlag) {
      when(mockFeatureEnabled)
        .calledWith(featureFlag as FeatureToggleType)
        .mockReturnValue(!!flagEnabled)
    }

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

  it('should render a feature that has not been skipped', async () => {
    initializeTestInstance('oneFeatureNoFlag')
    await waitFor(() => fireEvent.press(screen.getByRole('tab', { name: 'whatsNew.title' })))
    await waitFor(async () => {
      expect(screen.getByText('whatsNew.bodyCopy.testFeatureNoFlag')).toBeTruthy()
    })
  })

  it('should not render feature behind disabled feature flag', async () => {
    initializeTestInstance('twoFeaturesOneFlag', 'testFeature', false)
    await waitFor(() => fireEvent.press(screen.getByRole('tab', { name: 'whatsNew.title' })))
    await waitFor(async () => {
      expect(screen.getByText('whatsNew.bodyCopy.testFeatureNoFlag')).toBeTruthy()
      expect(screen.queryByText('whatsNew.bodyCopy.testFeature')).toBeFalsy()
    })
  })

  it('should render feature behind enabled feature flag', async () => {
    initializeTestInstance('twoFeaturesOneFlag', 'testFeature', true)
    await waitFor(() => fireEvent.press(screen.getByRole('tab', { name: 'whatsNew.title' })))
    await waitFor(async () => {
      expect(screen.getByText('whatsNew.bodyCopy.testFeatureNoFlag')).toBeTruthy()
      expect(screen.getByText('whatsNew.bodyCopy.testFeature')).toBeTruthy()
    })
  })

  it('should set the features as skipped when dismissed ', async () => {
    initializeTestInstance('twoFeaturesOneFlag', 'testFeature', true)

    await waitFor(() => fireEvent.press(screen.getByRole('tab', { name: 'whatsNew.title' })))
    await waitFor(() => fireEvent.press(screen.getByRole('button', { name: 'whatsNew.dismissMessage' })))

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        APP_FEATURES_WHATS_NEW_SKIPPED_VAL,
        '["testFeature","testFeatureNoFlag"]',
      )
    })
  })

  it('should not set features behind disabled feature flag as skipped when dismissed', async () => {
    initializeTestInstance('twoFeaturesOneFlag', 'testFeature', false)

    await waitFor(() => fireEvent.press(screen.getByRole('tab', { name: 'whatsNew.title' })))
    await waitFor(() => fireEvent.press(screen.getByRole('button', { name: 'whatsNew.dismissMessage' })))

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(APP_FEATURES_WHATS_NEW_SKIPPED_VAL, '["testFeatureNoFlag"]')
    })
  })
})

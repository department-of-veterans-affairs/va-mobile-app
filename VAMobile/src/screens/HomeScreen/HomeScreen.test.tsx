import 'react-native'
import React from 'react'
import { DateTime, Settings } from 'luxon'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import { mocked } from 'ts-jest/utils'

import { context, findByTypeWithSubstring, findByTestID, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import { HomeScreen } from './HomeScreen'
import { AlertBox, LargeNavButton, TextView, VAButton } from 'components'
import { when } from 'jest-when'
import { featureEnabled } from 'utils/remoteConfig'
import { getStoreVersion, getVersionSkipped, getLocalVersion } from 'utils/homeScreenAlerts'

const mockNavigateToSpy = jest.fn()
const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigateToSpy
        .mockReturnValueOnce(() => {})
        .mockReturnValueOnce(() => {})
        .mockReturnValueOnce(() => {})
        .mockReturnValue(() => {})
    },
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
  }
})

jest.mock('utils/remoteConfig')

context('HomeScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any

  const initializeTestInstance = (inAppUpdatesEnabled: boolean = true, skippedVersion: string = '1.0.0.', localVersion: string = '0.0.0', storeVersion: string = '2.0.0') => {
    when(mocked(featureEnabled)).calledWith('inAppUpdates').mockReturnValue(inAppUpdatesEnabled)
    mocked(getVersionSkipped).mockReturnValueOnce(Promise.resolve(skippedVersion))
    mocked(getLocalVersion).mockReturnValueOnce(Promise.resolve(localVersion))
    mocked(getStoreVersion).mockReturnValueOnce(Promise.resolve(storeVersion))

    props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })

    component = render(<HomeScreen {...props} />)

    testInstance = component.container
  }

  beforeEach(() => {
    when(mocked(featureEnabled)).calledWith('inAppUpdates').mockReturnValue(true)
    mocked(getVersionSkipped).mockReturnValueOnce(Promise.resolve('1.0.0.'))
    mocked(getLocalVersion).mockReturnValueOnce(Promise.resolve('0.0.0'))
    mocked(getStoreVersion).mockReturnValueOnce(Promise.resolve('2.0.0.'))
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when VA COVID-19 updates is pressed', () => {
    it('should navigate to https://www.va.gov/coronavirus-veteran-frequently-asked-questions', async () => {
      await waitFor(() => {
        findByTestID(testInstance, 'V\ufeffA COVID-19 updates').props.onPress()
        const expectNavArgs = {
          url: 'https://www.va.gov/coronavirus-veteran-frequently-asked-questions',
          displayTitle: 'va.gov',
          loadingMessage: 'Loading VA COVID-19 updates...',
        }
        expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', expectNavArgs)
      })
    })
  })

  describe('when showing the greeting', () => {
    it('should have the correct one for the morning', async () => {
      await waitFor(() => {
        const expectNow = DateTime.local(2021, 8, 10, 10)
        Settings.now = () => expectNow.toMillis()

        initializeTestInstance()
        expect(findByTypeWithSubstring(testInstance, TextView, 'morning')).toBeTruthy()
      })
    })

    it('should have the correct one for the afternoon', async () => {
      await waitFor(() => {
        const expectNow = DateTime.local(2021, 8, 10, 14)
        Settings.now = () => expectNow.toMillis()
        initializeTestInstance()
        expect(findByTypeWithSubstring(testInstance, TextView, 'afternoon')).toBeTruthy()
      })
    })

    it('should have the correct one for the evening', async () => {
      await waitFor(() => {
        const expectNow = DateTime.local(2021, 8, 10, 20)
        Settings.now = () => expectNow.toMillis()
        initializeTestInstance()
        expect(findByTypeWithSubstring(testInstance, TextView, 'evening')).toBeTruthy()
      })
    })
  })

  describe('rendering the update alert', () => {
    it('should render the UI', async () => {
      await waitFor(() => {
        expect(testInstance.findAllByType(AlertBox)[0].props.title).toEqual('Update available')
      })
    })
    it('should render the update now button', async () => {
      await waitFor(() => {
        expect(testInstance.findAllByType(VAButton)[0].props.label).toEqual('Update now')
      })
    })

    it('should render the skip this update button', async () => {
      await waitFor(() => {
        expect(testInstance.findAllByType(VAButton)[1].props.label).toEqual('Skip this update')
      })
    })

    it('should not render if skip version is the same as store version', async () => {
      await waitFor(() => {
        initializeTestInstance(false, '2.0.0.', '0.0.0')
        expect(() => component.getByText('Update available')).toThrow()
      })
    })

    it('should not render if local version is the same as store version', async () => {
      await waitFor(() => {
        initializeTestInstance(false, '1.0.0.', '2.0.0')
        expect(() => component.getByText('Update available')).toThrow()
      })
    })
  })
})

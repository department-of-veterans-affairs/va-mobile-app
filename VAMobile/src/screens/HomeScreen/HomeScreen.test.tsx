import 'react-native'
import { NativeModules } from 'react-native'
import React from 'react'
import { DateTime, Settings } from 'luxon'
import AsyncStorage from '@react-native-async-storage/async-storage'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, findByTypeWithSubstring, findByTestID, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import { HomeScreen } from './HomeScreen'
import { AlertBox, LargeNavButton, TextView, VAButton } from 'components'
import { when } from 'jest-when'
import { featureEnabled } from 'utils/remoteConfig'


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

const getItemMock = AsyncStorage.getItem as jest.Mock

NativeModules.DeviceData = {
  deviceName: 'Device Name',
  getDeviceName: jest.fn().mockReturnValue('Device Name'),
  versionName: 'v0.0.0',
  getVersionName: jest.fn().mockReturnValue('v0.0.0'),
  buildNumber: 0,
  getBuildNumber: jest.fn().mockReturnValue(0),
}

NativeModules.RNStoreVersion = {
  storeVersion: '2.0.0',
  requestStoreVersion: jest.fn().mockReturnValue('2.0.0'),
}

context('HomeScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let mockFeatureEnabled = featureEnabled as jest.Mock

  const initializeTestInstance = (prescriptionsEnabled: boolean = false) => {
    when(mockFeatureEnabled).calledWith('prescriptions').mockReturnValue(prescriptionsEnabled)
    when(getItemMock).calledWith('@store_app_version_skipped').mockResolvedValue('1.0.0')
    props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })

    component = render(<HomeScreen {...props} />)

    testInstance = component.container
  }

  beforeEach(() => {
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
      expect(testInstance.findAllByType(AlertBox)[0].props.title).toEqual('Update available')
    })
    it('should render the update now button', async () => {
      expect(testInstance.findAllByType(VAButton)[0].props.label).toEqual('Update now')
    })

    it('should render the skip this update button', async () => {
      expect(testInstance.findAllByType(VAButton)[1].props.label).toEqual('Skip this update')
    })
  })

  describe('when rendering the home nav buttons', () => {
    it('should render the claims button', async () => {
      await waitFor(() => {
        expect(testInstance.findAllByType(LargeNavButton)[0].props.title).toEqual('Claims and appeals')
      })
    })
    it('should render the health button', async () => {
      await waitFor(() => {
        expect(testInstance.findAllByType(LargeNavButton)[1].props.title).toEqual('Health care')
      })
    })
    it('should render the letters button', async () => {
      await waitFor(() => {
        expect(testInstance.findAllByType(LargeNavButton)[2].props.title).toEqual('Letters')
      })
    })

    it('should render the payments button', async () => {
      await waitFor(() => {
        expect(testInstance.findAllByType(LargeNavButton)[3].props.title).toEqual('Payments')
      })
    })
  })
})

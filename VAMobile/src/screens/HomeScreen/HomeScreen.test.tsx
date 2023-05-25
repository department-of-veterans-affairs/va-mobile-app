import 'react-native'
import React from 'react'
import { DateTime, Settings } from 'luxon'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, findByTypeWithSubstring, findByTestID, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import { HomeScreen } from './HomeScreen'
import { TextView } from 'components'

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
  }
})

jest.mock('utils/remoteConfig')

context('HomeScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any

  const initializeTestInstance = () => {
    props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })

    component = render(<HomeScreen {...props} />)

    testInstance = component.UNSAFE_root
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

        expect(findByTypeWithSubstring(testInstance, TextView, 'morning')).toBeTruthy()
      })
    })

    it('should have the correct one for the afternoon', async () => {
      await waitFor(() => {
        const expectNow = DateTime.local(2021, 8, 10, 14)
        Settings.now = () => expectNow.toMillis()
        expect(findByTypeWithSubstring(testInstance, TextView, 'afternoon')).toBeTruthy()
      })
    })

    it('should have the correct one for the evening', async () => {
      await waitFor(() => {
        const expectNow = DateTime.local(2021, 8, 10, 20)
        Settings.now = () => expectNow.toMillis()
        expect(findByTypeWithSubstring(testInstance, TextView, 'evening')).toBeTruthy()
      })
    })
  })
})

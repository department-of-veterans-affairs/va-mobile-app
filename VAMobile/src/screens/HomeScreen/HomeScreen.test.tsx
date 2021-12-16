import 'react-native'
import React from 'react'
import { DateTime, Settings } from 'luxon'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'

import { TestProviders, context, findByTypeWithSubstring, findByTestID, mockNavProps, renderWithProviders } from 'testUtils'
import { HomeScreen } from './HomeScreen'
import { LargeNavButton, TextView } from 'components'

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

context('HomeScreen', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  const initializeTestInstance = () => {
    props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })

    act(() => {
      component = renderWithProviders(<HomeScreen {...props} />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when VA COVID-19 updates is pressed', () => {
    it('should navigate to https://www.va.gov/coronavirus-veteran-frequently-asked-questions', async () => {
      findByTestID(testInstance, 'V\ufeffA COVID-19 updates').props.onPress()
      const expectNavArgs = {
        url: 'https://www.va.gov/coronavirus-veteran-frequently-asked-questions',
        displayTitle: 'va.gov',
      }
      expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', expectNavArgs)
    })
  })

  describe('when showing the greeting', () => {
    it('should have the correct one for the morning', async () => {
      const expectNow = DateTime.local(2021, 8, 10, 10)
      Settings.now = () => expectNow.toMillis()
      initializeTestInstance()
      expect(findByTypeWithSubstring(testInstance, TextView, 'morning')).toBeTruthy()
    })

    it('should have the correct one for the afternoon', async () => {
      const expectNow = DateTime.local(2021, 8, 10, 14)
      Settings.now = () => expectNow.toMillis()
      initializeTestInstance()
      expect(findByTypeWithSubstring(testInstance, TextView, 'afternoon')).toBeTruthy()
    })

    it('should have the correct one for the evening', async () => {
      const expectNow = DateTime.local(2021, 8, 10, 20)
      Settings.now = () => expectNow.toMillis()
      initializeTestInstance()
      expect(findByTypeWithSubstring(testInstance, TextView, 'evening')).toBeTruthy()
    })
  })

  describe('when rendering the home nav buttons', () => {
    it('should render the claims button', async () => {
      expect(testInstance.findAllByType(LargeNavButton)[0].props.title).toEqual('Claims and appeals')
    })
    it('should render the health button', async () => {
      expect(testInstance.findAllByType(LargeNavButton)[1].props.title).toEqual('Health care')
    })
    it('should render the letters button', async () => {
      expect(testInstance.findAllByType(LargeNavButton)[2].props.title).toEqual('Letters')
    })
  })
})

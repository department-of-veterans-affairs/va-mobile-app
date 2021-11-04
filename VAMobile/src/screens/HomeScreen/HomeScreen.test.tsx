import 'react-native'
import React from 'react'
import { DateTime, Settings } from 'luxon'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'

import { TestProviders, context, findByTestID, findByTypeWithSubstring } from 'testUtils'
import HomeScreen from './index'
import {LargeNavButton, TextView} from 'components'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
  }
})

context('HomeScreen', () => {
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    component = renderer.create(
      <TestProviders>
        <HomeScreen />
      </TestProviders>,
    )

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()  
  })

  it('initializes correctly', async () => {
    await act(async () => {
      expect(component).toBeTruthy()
    })
  })

  describe('when the covid 19 screening tool button is clicked', () => {
    it('should launch external link with the parameter https://www.va.gov/covid19screen/', async () => {
      expect(findByTestID(testInstance, 'covid-19-screening-tool').props.onPress())
      expect(mockExternalLinkSpy).toHaveBeenCalledWith('https://www.va.gov/covid19screen/')
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
    it('should render the covid form button', async () => {
      expect(testInstance.findAllByType(LargeNavButton)[0].props.title).toEqual('COVID-19 vaccines')
    })
    it('should render the claims button', async () => {
      expect(testInstance.findAllByType(LargeNavButton)[1].props.title).toEqual('Claims and appeals')
    })
    it('should render the health button', async () => {
      expect(testInstance.findAllByType(LargeNavButton)[2].props.title).toEqual('Health care')
    })
    it('should render the letters button', async () => {
      expect(testInstance.findAllByType(LargeNavButton)[3].props.title).toEqual('Letters')
    })
  })
})

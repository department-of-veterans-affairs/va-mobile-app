import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, mockStore, renderWithProviders } from 'testUtils'

import { TextView } from 'components'
import ProfileBanner from '../ProfileBanner'
import MilitaryInformationScreen from './index'

context('MilitaryInformationScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  const serviceHistory = [{
    branch_of_service: 'United States Marine Corps',
    begin_date: '1993-06-04',
    end_date: '1995-07-10',
    formatted_begin_date: 'June 04, 1993',
    formatted_end_date: 'July 10, 1995',
  }]

  beforeEach(() => {
    store = mockStore({
      auth: { initializing: true, loggedIn: false, loading: false },
      militaryService: { loading: false, serviceHistory }
    })

    act(() => {
      component = renderWithProviders(<MilitaryInformationScreen />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()

    const profileBanner = testInstance.findAllByType(ProfileBanner)
    expect(profileBanner).toBeTruthy()

    const header = testInstance.findByProps({accessibilityRole: 'header'})
    expect(header.props.children).toBe('Period of service')

    const texts = testInstance.findAllByType(TextView)
    expect(texts[3].props.children).toBe('United States Marine Corps')
    expect(texts[4].props.children).toBe('June 04, 1993 - July 10, 1995')

    const link = testInstance.findByProps({accessibilityRole: 'link'})
    expect(link.props.children).toBe('What if my military service information doesn\'t look right?')
  })
})

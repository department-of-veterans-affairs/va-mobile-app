import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, render, RenderAPI, mockNavProps, waitFor, when } from 'testUtils'
import NoRequestAppointmentAccess from './NoRequestAppointmentAccess'
import { TextView } from 'components'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('NoRequestAppointmentAccess', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let navigateToSpy: jest.Mock

  beforeEach(() => {
    const props = mockNavProps()

    navigateToSpy = jest.fn()
    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: 'va.gov', loadingMessage: 'Loading VA location finder...' })
      .mockReturnValue(navigateToSpy)

    component = render(<NoRequestAppointmentAccess {...props} />)

    testInstance = component.container
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render text fields correctly', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts[3].props.children).toBe("We can't find your facility registration")
    expect(texts[4].props.children).toBe('To request an appointment online, you need to be:')
    expect(texts[5].props.children[1]).toBe('Enrolled in VA health care,')
    expect(texts[6].props.children).toBe(' and')
    expect(texts[7].props.children[1]).toBe('Registered with at least 1 VA medical center that accepts online scheduling')
  })

  it('should use route navigation when Find facility button is pressed', async () => {
    await waitFor(() => {
      testInstance.findByProps({ label: 'Find health facility' }).props.onPress()
      expect(navigateToSpy).toHaveBeenCalled()
    })
  })
})

import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, findByTestID, mockNavProps, renderWithProviders } from 'testUtils'

import { Linking } from 'react-native'
import { TextView } from 'components'
import IncorrectServiceInfo from './index'

context('IncorrectServiceInfo', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    act(() => {
      component = renderWithProviders(<IncorrectServiceInfo {...props} />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()

    const texts = testInstance.findAllByType(TextView)
    expect(texts[0].props.children).toBe("What if my military service information doesn't look right?")
    expect(texts[1].props.children).toBe(
      'Some Veterans have reported seeing military service information in their VA.gov profiles that doesn’t seem right. When this happens, it’s because there’s an error in the information we’re pulling into VA.gov from the Defense Enrollment Eligibility Reporting System (DEERS).\n\nIf the military service information in your profile doesn’t look right, please call the Defense Manpower Data Center (DMDC). They’ll work with you to update your information in DEERS.\n\nTo reach the DMDC, call Monday through Friday (except federal holidays), 8:00 a.m. to 8:00 p.m. ET.',
    )
    expect(texts[2].props.children).toBe('800-538-9552')
  })

  it('should call DMDC on press', async () => {
    findByTestID(testInstance, '800-538-9552').props.onPress()
    expect(Linking.openURL).toHaveBeenCalledWith('tel:8005389552')
  })
})

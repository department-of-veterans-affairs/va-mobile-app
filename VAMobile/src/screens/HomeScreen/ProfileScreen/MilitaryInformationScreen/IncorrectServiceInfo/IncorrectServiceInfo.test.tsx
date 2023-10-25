import 'react-native'
import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { context, mockNavProps, render } from 'testUtils'
import { Linking } from 'react-native'
import IncorrectServiceInfo from './index'

context('IncorrectServiceInfo', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<IncorrectServiceInfo {...props} />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByText("What if my military service information doesn't look right?")).toBeTruthy()
    expect(screen.getByText("Some Veterans have reported seeing military service information in their VA.gov profiles that doesn’t seem right. When this happens, it’s because there’s an error in the information we’re pulling into VA.gov from the Defense Enrollment Eligibility Reporting System (DEERS).")).toBeTruthy()
    expect(screen.getByText("If the military service information in your profile doesn’t look right, please call the Defense Manpower Data Center (DMDC). They’ll work with you to update your information in DEERS.")).toBeTruthy()
    expect(screen.getByText('To reach the DMDC, call Monday through Friday (except federal holidays), 8:00 a.m. to 8:00 p.m. ET.')).toBeTruthy()
    expect(screen.getByText('800-538-9552')).toBeTruthy()
  })

  it('should call DMDC on press', async () => {
    fireEvent.press(screen.getByLabelText('8 0 0 5 3 8 9 5 5 2'))
    expect(Linking.openURL).toHaveBeenCalledWith('tel:8005389552')
  })
})

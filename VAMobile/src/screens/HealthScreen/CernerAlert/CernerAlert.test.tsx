import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import CernerAlert from './CernerAlert'

const mockExternalLinkSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

jest.mock('../../../api/facilities/getFacilitiesInfo', () => {
  let original = jest.requireActual('../../../api/facilities/getFacilitiesInfo')
  return {
    ...original,
    useFacilitiesInfo: jest.fn().mockReturnValueOnce({
      status: "success",
      data: [
        {
          id: "358",
          name: "FacilityOne",
          city: "Cheyenne",
          state: "WY",
          cerner: true,
          miles: "3.17"
        },
        {
          id: "359",
          name: "FacilityTwo",
          city: "Cheyenne",
          state: "WY",
          cerner: true,
          miles: "3.17"
        }
      ]
    }).mockReturnValueOnce({
      status: "success",
      data: [
        {
          id: "358",
          name: "FacilityOne",
          city: "Cheyenne",
          state: "WY",
          cerner: true,
          miles: "3.17"
        },
        {
          id: "359",
          name: "FacilityTwo",
          city: "Cheyenne",
          state: "WY",
          cerner: false,
          miles: "3.17"
        }
      ]
    }),
  }
})

context('CernerAlert', () => {
  const initializeTestInstance = (): void => {
    render(<CernerAlert />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('When only cerner facilities', () => {
    fireEvent.press(screen.getByLabelText('Your V-A health care team may be using the My V-A Health portal'))
    expect(screen.getByLabelText('FacilityOne (Now using My V-A Health)')).toBeTruthy()
    expect(screen.getByLabelText('FacilityTwo (Now using My V-A Health)')).toBeTruthy()
  })

  it('when some facilities are cerner and pressing the link', async () => {
    fireEvent.press(screen.getByLabelText('Some of your V-A health care team may be using the My V-A Health portal'))
    fireEvent.press(screen.getByLabelText('Go to My V-A Health'))
    expect(mockExternalLinkSpy).toBeCalledWith('https://patientportal.myhealth.va.gov/')
  })
})

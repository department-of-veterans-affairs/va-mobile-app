import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, findByTestID, findByTypeWithText, mockNavProps, render, RenderAPI, waitFor, when } from 'testUtils'

import FileRequestDetails from './FileRequestDetails'
import { ClaimEventData } from 'store/api'
import { TextView, VAButton } from 'components'

context('FileRequestDetails', () => {
  let component: RenderAPI
  let testInstance: any
  let props: any

  let request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
    displayName: 'Request 1',
    description: 'Need DD214',
  }

  const initializeTestInstance = (request: ClaimEventData) => {
    props = mockNavProps(undefined, { setOptions: jest.fn() }, { params: { request } })

    component = render(<FileRequestDetails {...props} />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance(request)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe("when the request hasn't had files uploaded", () => {
    it('should display the select a file and take or select photos buttons', async () => {
      await waitFor(() => {
        const buttons = testInstance.findAllByType(VAButton)
        expect(buttons.length).toEqual(2)
        expect(buttons[0].props.label).toEqual('Select a file')
        expect(buttons[1].props.label).toEqual('Take or select photos')
      })
    })

    it('should display request title and description', async () => {
      const textViews = testInstance.findAllByType(TextView)
      await waitFor(() => {
        expect(textViews[2].props.children).toEqual('Request 1')
        expect(textViews[4].props.children).toEqual('Need DD214')
      })
    })
  })
})

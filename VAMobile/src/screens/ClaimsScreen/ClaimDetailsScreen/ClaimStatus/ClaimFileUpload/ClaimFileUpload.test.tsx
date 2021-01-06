import React from 'react'

import {context, mockNavProps, renderWithProviders} from "testUtils"
import { act, ReactTestInstance } from "react-test-renderer"

import ClaimFileUpload from './ClaimFileUpload'
import {AlertBox, TextView, VAButton} from 'components'
import {ClaimEventData} from 'store/api/types'

const mockNavigationSpy = jest.fn()
jest.mock('../../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../../utils/hooks')
  const theme = jest.requireActual('../../../../../styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return () => mockNavigationSpy
    },
  }
})

context('ClaimFileUpload', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  let requests = [
    {
      type: 'still_need_from_you_list',
      date: '2020-07-16',
      status: 'NEEDED',
      uploaded: false,
      uploadsAllowed: true
    }
  ]

  const initializeTestInstance = (requests: ClaimEventData[], canRequestDecision?: boolean): void => {
    props = mockNavProps(undefined, undefined, { params: { requests, canRequestDecision }})

    act(() => {
      component = renderWithProviders(<ClaimFileUpload {...props} />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(requests)
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when number of requests is greater than 1', () => {
    it('should display the text "You have {{number}} file requests from VA"', async () => {
      let updatedRequests = [
        {
          type: 'still_need_from_you_list',
          date: '2020-07-16',
          status: 'NEEDED',
          uploaded: false,
          uploadsAllowed: true
        },
        {
          type: 'still_need_from_you_list',
          date: '2020-07-16',
          status: 'NEEDED',
          uploaded: false,
          uploadsAllowed: true
        }
      ]

      initializeTestInstance(updatedRequests)

      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('You have 2 file requests from VA')
    })
  })

  describe('when number of requests is equal to 1', () => {
    it('should display the text "You have 1 file request from VA"', async () => {
      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('You have 1 file request from VA')
    })
  })

  describe('when canRequestDecision is true', () => {
    it('should display an AlertBox', async () => {
      initializeTestInstance(requests, true)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
    })
  })
})

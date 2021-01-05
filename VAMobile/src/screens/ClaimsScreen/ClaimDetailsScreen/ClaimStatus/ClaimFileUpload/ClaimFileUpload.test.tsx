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

  const initializeTestInstance = (requests: ClaimEventData[], waiverSubmitted?: boolean, currentPhase?: number): void => {
    props = mockNavProps(undefined, undefined, { params: { requests, waiverSubmitted, currentPhase }})

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

  describe('when waiverSubmitted is false', () => {
    describe('when the current phase is 3', () => {
      it('should display an AlertBox', async () => {
        initializeTestInstance(requests, false, 3)
        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      })

      describe('on click of the view details button in the AlertBox', () => {
        it('should call useRouteNavigation', async () => {
          initializeTestInstance(requests, false, 3)
          const allButtons = testInstance.findAllByType(VAButton)
          allButtons[allButtons.length - 1].props.onPress()
          expect(mockNavigationSpy).toHaveBeenCalled()
        })
      })
    })
  })
})

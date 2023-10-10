import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import AppealStatus from './AppealStatus'
import { TextArea, TextView } from 'components'

context('AppealStatus', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (numAppealsAhead: number | undefined, isActiveAppeal?: boolean) => {
    props = mockNavProps({
      events: [
        {
          data: '2020-11-12',
          type: 'hlr_request',
        },
      ],
      status: {
        details: {},
        type: 'scheduled_hearing',
      },
      aoj: 'vba',
      appealType: 'higherLevelReview',
      numAppealsAhead,
      isActiveAppeal,
    })

    component = render(<AppealStatus {...props} />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance(undefined)
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when there are numAppealsAhead and isActiveAppeal is true', () => {
    it('should display that number formatted with commas as needed', async () => {
      initializeTestInstance(12345, true)
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('12,345')
      expect(testInstance.findAllByType(TextArea).length).toEqual(4)
    })
  })

  describe('when numAppealsAhead is undefined or isActiveAppeal is false', () => {
    it('should not render the num appeals ahead text area', async () => {
      initializeTestInstance(undefined, true)
      expect(testInstance.findAllByType(TextArea).length).toEqual(3)

      initializeTestInstance(123, false)
      expect(testInstance.findAllByType(TextArea).length).toEqual(3)
    })
  })
})

import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, render, RenderAPI } from 'testUtils'

import { InitialState } from 'store/slices'
import { TextView } from 'components'
import AppointmentReason from './AppointmentReason'
import { AppointmentMessages } from 'store/api'

context('AppointmentReason', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance
  let reasonText = 'New Issue: 22.4.55'
  let messages = [
    {
      "id": "9a48e8db6d70a38a016d72b354240002",
      "type": "messages",
      "attributes": {
        "messageText": "Testing",
        "messageDateTime": "11/11/2019 12:26:13",
        "appointmentRequestId": "9a48e8db6d70a38a016d72b354240002",
        "date": "2019-11-11T12:26:13.931+0000"
      }
    },
    {
      "id": "9a48e8db6d70a38a016d72b354240002",
      "type": "messages",
      "attributes": {
        "messageText": "Possible check up",
        "messageDateTime": "11/11/2019 12:26:13",
        "appointmentRequestId": "9a48e8db6d70a38a016d72b354240002",
        "date": "2019-11-11T12:26:13.931+0000"
      }
    }
  ]


  const initializeTestInstance = (reason: string | null, messages?: Array<AppointmentMessages>): void => {
    props = {
      attributes: {
        reason: reason,
      },
      messages
    }

    component = render(<AppointmentReason {...props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.container
  }

  it('initializes correctly', async () => {
    initializeTestInstance(reasonText)
    expect(component).toBeTruthy()
  })

  describe('when reason and messages does not exist', () => {
    it('should not render TextView', async () => {
      initializeTestInstance(null)
      const texts = testInstance.findAllByType(TextView)
      expect(texts.length).toBe(0)
    })
  })

  describe('when reason exists', () => {
    it('should render a TextView with the reason text', async () => {
      initializeTestInstance(reasonText)
      const texts = testInstance.findAllByType(TextView)
      expect(texts[0].props.children).toBe('You shared these details about your concern')
      expect(texts[1].props.children).toBe(reasonText)
    })
  })

  describe('when reason exists and is a pending appointment', () => {
    it('should render a TextView with the reason and message text', async () => {
      initializeTestInstance(reasonText, messages)
      const texts = testInstance.findAllByType(TextView)
      const messageText = messages[0].attributes.messageText
      expect(texts[0].props.children).toBe('You shared these details about your concern')
      expect(texts[1].props.children).toBe(`${reasonText}: ${messageText}`)
    })
  })
})

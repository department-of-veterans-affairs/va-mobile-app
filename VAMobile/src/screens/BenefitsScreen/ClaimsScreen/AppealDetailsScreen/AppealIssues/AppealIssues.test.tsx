import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'

import AppealIssues from './AppealIssues'
import { TextView } from 'components'

context('AppealIssues', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  beforeEach(async () => {
    props = mockNavProps()

    const issues = ['Service connection, Post-traumatic stress disorder', 'Eligibility for loan guaranty benefits', 'Service connected']

    component = render(<AppealIssues issues={issues} {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  it('should have the right number of items', async () => {
    const textViews = testInstance.findAllByType(TextView)
    expect(textViews.length).toEqual(4)

    expect(textViews[1].props.children[1]).toEqual('Service connection, Post-traumatic stress disorder')
    expect(textViews[2].props.children[1]).toEqual('Eligibility for loan guaranty benefits')
    expect(textViews[3].props.children[1]).toEqual('Service connected')
  })
})

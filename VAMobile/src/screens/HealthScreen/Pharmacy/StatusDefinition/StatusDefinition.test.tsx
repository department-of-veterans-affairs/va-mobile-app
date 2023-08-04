import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, RenderAPI, mockNavProps } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'

import StatusDefinition from './StatusDefinition'
import { RefillStatus, RefillStatusConstants } from 'store/api/types'
import { TextView } from 'components'

context('StatusDefinition', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (routeMock?: { display: string; value: RefillStatus }) => {
    const props = mockNavProps(
      {},
      {
        setOptions: jest.fn(),
        navigate: jest.fn(),
        addListener: jest.fn(),
      },
      { params: routeMock || { display: '', value: 'active' } },
    )

    component = render(<StatusDefinition {...props} />)
    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  it('should display a glossary definition for a refill status', async () => {
    initializeTestInstance({
      display: 'Active',
      value: RefillStatusConstants.ACTIVE,
    })

    const texts = testInstance.findAllByType(TextView)
    expect(texts[2].props.children).toEqual('Active')
    expect(texts[3].props.children).toEqual(
      'A prescription that can be filled at the local VA pharmacy. If this prescription is refillable, you may request a refill of this VA prescription.',
    )
  })
})

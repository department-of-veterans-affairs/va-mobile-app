import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { TestProviders, context, renderWithProviders } from 'testUtils'
import FooterButton from './FooterButton'
import { TextView } from './index'
import Compose from 'components/VAIcon/svgs/compose.svg'

context('FooterButton', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})
    act(() => {
      component = renderer.create(
        <TestProviders>
          <FooterButton text='test' />
        </TestProviders>,
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render text as "text"', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts.length).toBe(1)
    expect(texts[0].props.children).toBe('test')
  })

  describe('when the compose icon name is passed in as an icon prop', () => {
    it('should render the compose svg', async () => {
      act(() => {
        component = renderWithProviders(<FooterButton text="test" iconProps={{ name: 'Compose' }} />)
      })

      testInstance = component.root
      const icon: ReactTestInstance = testInstance.findByType(Compose)
      expect(icon).toBeTruthy()
    })
  })
})

import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import RemoveData from './RemoveData'
import {AlertBox, VAButton} from 'components'
import Mock = jest.Mock;

context('RemoveData', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onConfirmSpy: Mock

  beforeEach(() => {
    onConfirmSpy = jest.fn()

    act(() => {
      component = renderWithProviders(<RemoveData alertText={'text'} pageName={'home phone'} confirmFn={onConfirmSpy}/>)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when displayAlert is false', () => {
    it('should display the remove button', async () => {
      const buttons = testInstance.findAllByType(VAButton)
      expect(buttons.length).toEqual(1)
      expect(buttons[0].props.label).toEqual('Remove Home Phone')
    })
  })

  describe('when displayAlert is true', () => {
    it('should display an AlertBox with two buttons', async () => {
      act(() => {
        testInstance.findByType(VAButton).props.onPress()
      })

      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      const buttons = testInstance.findAllByType(VAButton)
      expect(buttons.length).toEqual(2)
      expect(buttons[0].props.label).toEqual('Confirm')
      expect(buttons[1].props.label).toEqual('Cancel')
    })

    describe('on click of the cancel button', () => {
      it('should remove the AlertBox and just display the remove button again', async () => {
        act(() => {
          testInstance.findByType(VAButton).props.onPress()
        })

        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)

        act(() => {
          testInstance.findAllByType(VAButton)[1].props.onPress()
        })

        expect(testInstance.findAllByType(AlertBox).length).toEqual(0)
        const buttons = testInstance.findAllByType(VAButton)
        expect(buttons.length).toEqual(1)
        expect(buttons[0].props.label).toEqual('Remove Home Phone')
      })
    })

    describe('on click of the confirm button', () => {
      it('should remove the AlertBox and just display the remove button again', async () => {
        act(() => {
          testInstance.findByType(VAButton).props.onPress()
        })

        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)

        act(() => {
          testInstance.findAllByType(VAButton)[0].props.onPress()
        })

        expect(onConfirmSpy).toBeCalled()
      })
    })
  })
})

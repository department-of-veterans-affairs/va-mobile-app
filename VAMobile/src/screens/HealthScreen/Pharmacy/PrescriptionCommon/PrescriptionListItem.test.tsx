import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, RenderAPI, waitFor } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'

import PrescriptionListItem, { PrescriptionListItemProps } from './PrescriptionListItem'
import { PrescriptionAttributeData } from 'store/api'
import { defaultPrescriptionsList as mockData, emptyStatePrescriptionList as emptyMockData } from 'utils/tests/prescription'
import { TextView } from 'components'

context('PrescriptionListItem', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (prescription: Partial<PrescriptionAttributeData> = {}, hideInstructions = false) => {
    const props = {
      prescription: {
        ...mockData[0].attributes,
        ...prescription,
      },
      hideInstructions,
    } as PrescriptionListItemProps

    component = render(<PrescriptionListItem {...props} />)
    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    await waitFor(() => {
      initializeTestInstance()
    })
    expect(component).toBeTruthy()
  })

  describe('when there is no data provided', () => {
    describe('and hideInstructions is set to true', () => {
      it('should show None noted for everything besides instructions', async () => {
        await waitFor(() => {
          initializeTestInstance(
            {
              ...emptyMockData[0].attributes,
              refillRemaining: undefined,
            },
            true,
          )
        })

        const texts = testInstance.findAllByType(TextView)
        expect(texts[1].props.children).toEqual('Rx #: None noted')
        expect(texts[2].props.children).toEqual('Refills left: None noted')
        expect(texts[3].props.children).toEqual('Fill date: None noted')
        expect(texts[4].props.children).toEqual('VA facility: None noted')
      })
    })

    describe('and hideInstructions is set to false', () => {
      it('should show None noted for everything including instructions', async () => {
        await waitFor(() => {
          initializeTestInstance(
            {
              ...emptyMockData[0].attributes,
              refillRemaining: undefined,
            },
            false,
          )
        })

        const texts = testInstance.findAllByType(TextView)
        expect(texts[1].props.children).toEqual('Rx #: None noted')
        expect(texts[2].props.children).toEqual('Instructions not noted')
        expect(texts[3].props.children).toEqual('Refills left: None noted')
        expect(texts[4].props.children).toEqual('Fill date: None noted')
        expect(texts[5].props.children).toEqual('VA facility: None noted')
      })
    })
  })
})

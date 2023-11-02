import React from 'react'
import { screen } from '@testing-library/react-native'

import { render, context } from 'testUtils'
import PrescriptionListItem, { PrescriptionListItemProps } from './PrescriptionListItem'
import { PrescriptionAttributeData } from 'store/api'
import { defaultPrescriptionsList as mockData, emptyStatePrescriptionList as emptyMockData } from 'utils/tests/prescription'

context('PrescriptionListItem', () => {
  const initializeTestInstance = (prescription: Partial<PrescriptionAttributeData> = {}, hideInstructions = false) => {
    const props = {
      prescription: {
        ...mockData[0].attributes,
        ...prescription,
      },
      hideInstructions,
    } as PrescriptionListItemProps

    render(<PrescriptionListItem {...props} />)
  }

  describe('when there is no data provided', () => {
    describe('and hideInstructions is set to true', () => {
      it('should show None noted for everything besides instructions', () => {
        initializeTestInstance(
          {
            ...emptyMockData[0].attributes,
            refillRemaining: undefined,
          },
          true,
        )
        expect(screen.getByText('Rx #: None noted')).toBeTruthy()
        expect(screen.getByText('Refills left: None noted')).toBeTruthy()
        expect(screen.getByText('Fill date: None noted')).toBeTruthy()
        expect(screen.getByText('VA facility: None noted')).toBeTruthy()
      })
    })

    describe('and hideInstructions is set to false', () => {
      it('should show None noted for everything including instructions', () => {
        initializeTestInstance(
          {
            ...emptyMockData[0].attributes,
            refillRemaining: undefined,
          },
          false,
        )
        expect(screen.getByText('Rx #: None noted')).toBeTruthy()
        expect(screen.getByText('Instructions not noted')).toBeTruthy()
        expect(screen.getByText('Refills left: None noted')).toBeTruthy()
        expect(screen.getByText('Fill date: None noted')).toBeTruthy()
        expect(screen.getByText('VA facility: None noted')).toBeTruthy()
      })
    })
  })
})

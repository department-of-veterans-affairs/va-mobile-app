import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { PrescriptionAttributeData } from 'api/types'
import PrescriptionListItem, {
  PrescriptionListItemProps,
} from 'screens/HealthScreen/Pharmacy/PrescriptionCommon/PrescriptionListItem'
import { context, render } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'
import {
  emptyStatePrescriptionList as emptyMockData,
  defaultPrescriptionsList as mockData,
} from 'utils/tests/prescription'

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

  it('renders prescription with data', () => {
    initializeTestInstance()
    expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy()
    expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 3 6 3 6 6 9 1`)).toBeTruthy()
    expect(screen.getByLabelText('TAKE ONE TABLET EVERY DAY FOR 30 DAYS TAKE WITH FOOD')).toBeTruthy()
    expect(screen.getByLabelText(`${t('prescription.refillsLeft')} 1`)).toBeTruthy()
    expect(screen.getByLabelText(`${t('fillDate')} September 21, 2021`)).toBeTruthy()
    expect(screen.getByLabelText(`${a11yLabelVA(t('prescription.vaFacility'))} SLC10 TEST LAB`)).toBeTruthy()
  })

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
        expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy()
        expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} None noted`)).toBeTruthy()
        expect(
          screen.getByLabelText(
            `${t('prescription.refillsLeft')} ${t('prescription.details.refillRemainingNotAvailable')}`,
          ),
        ).toBeTruthy()
        expect(screen.getByLabelText(`${t('fillDate')} ${t('prescription.details.fillDateNotAvailable')}`)).toBeTruthy()
        expect(
          screen.getByLabelText(
            `${a11yLabelVA(t('prescription.vaFacility'))} ${t('prescription.details.facilityNameNotAvailable')}`,
          ),
        ).toBeTruthy()
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
        expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy()
        expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} None noted`)).toBeTruthy()
        expect(screen.getByLabelText(`${t('prescription.details.instructionsNotAvailable')}`)).toBeTruthy()
        expect(
          screen.getByLabelText(
            `${t('prescription.refillsLeft')} ${t('prescription.details.refillRemainingNotAvailable')}`,
          ),
        ).toBeTruthy()
        expect(screen.getByLabelText(`${t('fillDate')} ${t('prescription.details.fillDateNotAvailable')}`)).toBeTruthy()
        expect(
          screen.getByLabelText(
            `${a11yLabelVA(t('prescription.vaFacility'))} ${t('prescription.details.facilityNameNotAvailable')}`,
          ),
        ).toBeTruthy()
      })
    })
  })
})

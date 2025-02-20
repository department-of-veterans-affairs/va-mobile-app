import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { PrescriptionAttributeData } from 'api/types'
import { context, render } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'
import {
  emptyStatePrescriptionList as emptyMockData,
  defaultPrescriptionsList as mockData,
} from 'utils/tests/prescription'

import PrescriptionListItem, { PrescriptionListItemProps } from './PrescriptionListItem'

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
    expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB.' })).toBeTruthy()
    expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 3 6 3 6 6 9 1.`)).toBeTruthy()
    expect(screen.getByLabelText('TAKE ONE TABLET EVERY DAY FOR 30 DAYS TAKE WITH FOOD.')).toBeTruthy()
    expect(screen.getByLabelText(`${t('prescription.refillsLeft')} 1.`)).toBeTruthy()
    expect(screen.getByLabelText(`${t('fillDate')} September 21, 2021.`)).toBeTruthy()
    expect(screen.getByLabelText(`${a11yLabelVA(t('prescription.vaFacility'))} SLC10 TEST LAB.`)).toBeTruthy()
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
        expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB.' })).toBeTruthy()
        expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} None noted.`)).toBeTruthy()
        expect(screen.getByLabelText(`${t('prescription.refillsLeft')} None noted.`)).toBeTruthy()
        expect(screen.getByLabelText(`${t('fillDate')} None noted.`)).toBeTruthy()
        expect(screen.getByLabelText(`${a11yLabelVA(t('prescription.vaFacility'))} None noted.`)).toBeTruthy()
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
        expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB.' })).toBeTruthy()
        expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} None noted.`)).toBeTruthy()
        expect(screen.getByLabelText(`${t('prescription.instructions.noneNoted')}.`)).toBeTruthy()
        expect(screen.getByLabelText(`${t('prescription.refillsLeft')} None noted.`)).toBeTruthy()
        expect(screen.getByLabelText(`${t('fillDate')} None noted.`)).toBeTruthy()
        expect(screen.getByLabelText(`${a11yLabelVA(t('prescription.vaFacility'))} None noted.`)).toBeTruthy()
      })
    })
  })
})

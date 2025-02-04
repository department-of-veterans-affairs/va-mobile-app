import React from 'react'

import { screen } from '@testing-library/react-native'
import { waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import * as api from 'store/api'
import { context, mockNavProps, render, when } from 'testUtils'

import VaccineListScreen from './VaccineListScreen'

context('VaccineListScreen', () => {
  const vaccineData = [
    {
      id: 'I2-A7XD2XUPAZQ5H4Y5D6HJ352GEQ000000',
      type: 'immunization',
      attributes: {
        cvxCode: 140,
        date: '2009-03-19T12:24:55Z',
        doseNumber: 'Booster',
        doseSeries: 1,
        groupName: 'FLU',
        manufacturer: null,
        note: 'Dose #45 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
    },
    {
      id: 'I2-N7A6Q5AU6W5C6O4O7QEDZ3SJXM000000',
      type: 'immunization',
      attributes: {
        cvxCode: 207,
        date: '2020-12-18T12:24:55Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'COVID-19',
        manufacturer: null,
        note: 'Dose #1 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.',
        shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
      },
    },
  ]

  const vaccineMissingData = [
    {
      id: 'I2-A7XD2XUPAZQ5H4Y5D6HJ352GEQ000000',
      type: 'immunization',
      attributes: {
        cvxCode: 140,
        date: '',
        doseNumber: 'Booster',
        doseSeries: 1,
        groupName: null,
        manufacturer: null,
        note: 'Dose #45 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
    },
  ]

  const initializeTestInstance = () => {
    render(<VaccineListScreen {...mockNavProps()} />)
  }

  it('initializes correctly', async () => {
    when(api.get as jest.Mock)
      .calledWith('/v1/health/immunizations', expect.anything())
      .mockResolvedValue({ data: vaccineData })
    initializeTestInstance()
    await waitFor(() => expect(screen.getByText('FLU vaccine')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('COVID-19 vaccine')).toBeTruthy())
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', () => {
      when(api.get as jest.Mock)
        .calledWith('/v1/health/immunizations', expect.anything())
        .mockResolvedValue({ data: vaccineData })
      initializeTestInstance()
      expect(screen.getByText('Loading your vaccine record...')).toBeTruthy()
    })
  })

  describe('when there are no vaccines', () => {
    it('should show no Vaccine Records', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v1/health/immunizations', expect.anything())
        .mockResolvedValue({ data: [] })

      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('heading', { name: t('noVaccineRecords.alert.title') })).toBeTruthy())
      await waitFor(() => expect(screen.getByText(t('noVaccineRecords.alert.text.1'))).toBeTruthy())
      await waitFor(() => expect(screen.getByText(t('noVaccineRecords.alert.text.2'))).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('link', { name: '800-698-2411' })).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy())
    })
  })

  describe('when vaccines have missing data', () => {
    it('should show vaccine with missing name and date', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v1/health/immunizations', expect.anything())
        .mockResolvedValue({ data: vaccineMissingData })
      initializeTestInstance()

      await waitFor(() => expect(screen.getByText(t('vaccine'))).toBeTruthy())
      await waitFor(() => expect(screen.getByText(t('vaccines.noDate'))).toBeTruthy())
    })
  })
})

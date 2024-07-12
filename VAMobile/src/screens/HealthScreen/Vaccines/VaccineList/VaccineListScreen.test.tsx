import React from 'react'

import { screen } from '@testing-library/react-native'
import { waitFor } from '@testing-library/react-native'

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
      await waitFor(() =>
        expect(
          screen.getByRole('header', { name: "We couldn't find information about your VA vaccines" }),
        ).toBeTruthy(),
      )
      await waitFor(() =>
        expect(
          screen.getByText(
            "We're sorry. We update your vaccine records every 24 hours, but new records can take up to 36 hours to appear.",
          ),
        ).toBeTruthy(),
      )
      await waitFor(() =>
        expect(
          screen.getByText(
            "If you think your vaccine records should be here, call our MyVA411 main information line. We're here 24/7.",
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByRole('link', { name: '800-698-2411' })).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy())
    })
  })
})

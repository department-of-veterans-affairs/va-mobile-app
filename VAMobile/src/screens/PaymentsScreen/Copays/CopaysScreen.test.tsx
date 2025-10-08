import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { medicalCopayKeys } from 'api/medicalCopays/queryKeys'
import { MedicalCopaysPayload } from 'api/types'
import CopaysScreen from 'screens/PaymentsScreen/Copays/CopaysScreen'
import { APIError } from 'store/api'
import { context, mockNavProps, render, waitFor } from 'testUtils'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const mockCopaysData: MedicalCopaysPayload = {
  data: [
    {
      id: '1',
      pSStatementDateOutput: '01/15/2024',
      pHAmtDue: 50.0,
      pSFacilityNum: '123',
      station: {
        facilitYNum: '123 - Test Facility',
      },
      details: [],
    },
    {
      id: '2',
      pSStatementDateOutput: '02/15/2024',
      pHAmtDue: 75.0,
      pSFacilityNum: '456',
      station: {
        facilitYNum: '456 - Another Facility',
      },
      details: [],
    },
  ],
  status: 200,
}

const emptyCopaysData: MedicalCopaysPayload = {
  data: [],
  status: 200,
}

context('CopaysScreen', () => {
  const initializeTestInstance = (data?: MedicalCopaysPayload, error?: APIError) => {
    const queriesData = [
      {
        queryKey: medicalCopayKeys.medicalCopays,
        data: data,
        error: error,
      },
    ]
    render(<CopaysScreen {...mockNavProps()} />, { queriesData })
  }

  describe('when loading', () => {
    it('should display loading component', () => {
      initializeTestInstance()
      expect(screen.getByText(t('copays.loading'))).toBeTruthy()
    })
  })

  describe('when there are copays', () => {
    it('should display copay cards', async () => {
      initializeTestInstance(mockCopaysData)
      await waitFor(() => {
        expect(screen.getByText(t('copays.subtitle'))).toBeTruthy()
        expect(screen.getByText(t('copays.subtitle.description'))).toBeTruthy()
      })
    })

    it('should display help button', async () => {
      initializeTestInstance(mockCopaysData)
      await waitFor(() => {
        expect(screen.getByTestId('copayHelpID')).toBeTruthy()
      })
    })

    it('should navigate to help when help button is pressed', async () => {
      initializeTestInstance(mockCopaysData)
      await waitFor(() => {
        fireEvent.press(screen.getByTestId('copayHelpID'))
        expect(mockNavigationSpy).toHaveBeenCalledWith('CopayHelp')
      })
    })
  })

  describe('when there are no copays', () => {
    it('should display empty state', async () => {
      initializeTestInstance(emptyCopaysData)
      await waitFor(() => {
        expect(screen.getByText(t('copays.none.header'))).toBeTruthy()
        expect(screen.getByText(t('copays.none.message'))).toBeTruthy()
      })
    })
  })
})

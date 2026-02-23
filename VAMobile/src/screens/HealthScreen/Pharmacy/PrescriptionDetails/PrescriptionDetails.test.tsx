import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { PrescriptionAttributeData, RefillStatusConstants } from 'api/types'
import PrescriptionDetails from 'screens/HealthScreen/Pharmacy/PrescriptionDetails/PrescriptionDetails'
import { context, mockNavProps, render } from 'testUtils'

jest.mock('api/authorizedServices/getAuthorizedServices')

const mockUseAuthorizedServices = useAuthorizedServices as jest.Mock

context('PrescriptionDetails', () => {
  const migratingFacilitiesList = [
    {
      migrationDate: '2026-05-01',
      facilities: [
        { facilityId: 989, facilityName: 'DAYT29' }, // Matches stationNumber in test prescription
      ],
      phases: {
        current: 'p3',
        p0: 'March 1, 2026',
        p1: 'March 15, 2026',
        p2: 'April 1, 2026',
        p3: 'April 24, 2026',
        p4: 'April 27, 2026',
        p5: 'May 1, 2026',
        p6: 'May 3, 2026',
        p7: 'May 8, 2026',
      },
    },
  ]

  const initializeTestInstance = (mockAttributeData: Partial<PrescriptionAttributeData> = {}) => {
    const props = mockNavProps(undefined, undefined, {
      params: {
        prescription: {
          type: 'Prescription',
          id: '13650544',
          attributes: {
            refillStatus: RefillStatusConstants.ACTIVE,
            refillSubmitDate: '2022-10-28T04:00:00.000Z',
            refillDate: '2022-10-28T04:00:00.000Z',
            refillRemaining: 5,
            facilityName: 'DAYT29',
            facilityPhoneNumber: '(217) 636-6712',
            isRefillable: false,
            isTrackable: false,
            orderedDate: '2022-10-28T04:00:00.000Z',
            quantity: 10,
            expirationDate: '2022-10-28T04:00:00.000Z',
            prescriptionNumber: '2719536',
            prescriptionName: 'SOMATROPIN 5MG INJ (VI)',
            instructions: 'TAKE 1 TABLET WITH FOOD 3 TIMES A DAY',
            dispensedDate: '2022-10-28T04:00:00.000Z',
            stationNumber: '989',
            ...mockAttributeData,
          },
        },
      },
    })

    render(<PrescriptionDetails {...props} />)
  }

  beforeEach(() => {
    // Default mock with no migrating facilities
    mockUseAuthorizedServices.mockReturnValue({
      data: {
        migratingFacilitiesList: [],
      },
    })
  })

  describe('when showing prescription details data', () => {
    it('should show prescription fields', () => {
      initializeTestInstance()
      expect(screen.getByRole('header', { name: t('prescription.details.instructionsHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.refillLeftHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('fillDate') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.quantityHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.expiresOnHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.orderedOnHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.vaFacilityHeader') })).toBeTruthy()
      expect(screen.getByRole('link', { name: '(217) 636-6712' })).toBeTruthy()
      expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
    })
  })

  describe('when there is no data provided', () => {
    it('should show None Noted for applicable properties', () => {
      initializeTestInstance({
        instructions: '',
        refillRemaining: undefined,
        quantity: undefined,
        refillDate: null,
        expirationDate: null,
        orderedDate: null,
        facilityName: '',
        prescriptionNumber: '',
      })
      expect(screen.getByRole('header', { name: 'SOMATROPIN 5MG INJ (VI)' })).toBeTruthy()
      expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} None noted`)).toBeTruthy()
      expect(screen.getByText(`${t('prescription.details.instructionsNotAvailable')}`)).toBeTruthy()
      expect(screen.getAllByText(`${t('prescription.details.refillRemainingNotAvailable')}`)).toBeTruthy()
      expect(screen.getAllByText(`${t('prescription.details.expirationDateNotAvailable')}`)).toBeTruthy()
      expect(screen.getByText(`${t('prescription.details.facilityNameNotAvailable')}`)).toBeTruthy()
    })
  })

  describe('Go to My VA Health button', () => {
    describe('when status is RefillStatusConstants.TRANSFERRED', () => {
      it('should display FooterButton', () => {
        initializeTestInstance({
          refillStatus: RefillStatusConstants.TRANSFERRED,
        })
        expect(screen.getByRole('button', { name: t('goToMyVAHealth') })).toBeTruthy()
      })
    })

    describe('when status is not RefillStatusConstants.TRANSFERRED', () => {
      it('should not display FooterButton', () => {
        initializeTestInstance()
        expect(screen.queryByRole('button', { name: t('goToMyVAHealth') })).toBeFalsy()
      })
    })
  })

  describe('RequestRefillButton', () => {
    describe('when isRefillable is true', () => {
      it('should display FooterButton', () => {
        initializeTestInstance({
          isRefillable: true,
        })
        expect(screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeTruthy()
      })
    })

    describe('when isRefillable is false', () => {
      it('should not display FooterButton', () => {
        initializeTestInstance()
        expect(screen.queryByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeFalsy()
      })
    })
  })

  describe('PrescriptionDetailsBanner', () => {
    describe('when status is RefillStatusConstants.TRANSFERRED', () => {
      it('should display the PrescriptionsDetailsBanner', () => {
        initializeTestInstance({
          refillStatus: RefillStatusConstants.TRANSFERRED,
        })

        expect(screen.getByText(t('prescription.details.banner.title'))).toBeTruthy()
      })
    })

    describe('when status is not RefillStatusConstants.TRANSFERRED', () => {})
    it('should not display the PrescriptionsDetailsBanner', () => {
      initializeTestInstance()
      expect(screen.queryByText(t('prescription.details.banner.title'))).toBeFalsy()
    })
  })

  describe('migrating facilities', () => {
    describe('when prescription is at a migrating facility', () => {
      beforeEach(() => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            migratingFacilitiesList: migratingFacilitiesList,
          },
        })
      })

      it('should show the PrescriptionsDetailsBanner', () => {
        initializeTestInstance()
        expect(screen.getByText(t('prescription.details.banner.title'))).toBeTruthy()
      })

      it('should hide the Request Refill button even when isRefillable is true', () => {
        initializeTestInstance({
          isRefillable: true,
        })
        expect(screen.queryByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeFalsy()
      })

      it('should hide the Go to My VA Health button even when status is TRANSFERRED', () => {
        initializeTestInstance({
          refillStatus: RefillStatusConstants.TRANSFERRED,
        })
        expect(screen.queryByRole('button', { name: t('goToMyVAHealth') })).toBeFalsy()
      })
    })

    describe('when prescription is not at a migrating facility', () => {
      beforeEach(() => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            migratingFacilitiesList: [
              {
                migrationDate: '2026-05-01',
                facilities: [
                  { facilityId: 999, facilityName: 'Other VA Medical Center' }, // Does not match stationNumber
                ],
                phases: {
                  current: 'p3',
                  p0: 'March 1, 2026',
                  p1: 'March 15, 2026',
                  p2: 'April 1, 2026',
                  p3: 'April 24, 2026',
                  p4: 'April 27, 2026',
                  p5: 'May 1, 2026',
                  p6: 'May 3, 2026',
                  p7: 'May 8, 2026',
                },
              },
            ],
          },
        })
      })

      it('should not show the PrescriptionsDetailsBanner', () => {
        initializeTestInstance()
        expect(screen.queryByText(t('prescription.details.banner.title'))).toBeFalsy()
      })

      it('should show the Request Refill button when isRefillable is true', () => {
        initializeTestInstance({
          isRefillable: true,
        })
        expect(screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeTruthy()
      })

      it('should show the Go to My VA Health button when status is TRANSFERRED', () => {
        initializeTestInstance({
          refillStatus: RefillStatusConstants.TRANSFERRED,
        })
        expect(screen.getByRole('button', { name: t('goToMyVAHealth') })).toBeTruthy()
      })
    })

    describe('when migratingFacilitiesList is empty', () => {
      it('should show the Request Refill button when isRefillable is true', () => {
        initializeTestInstance({
          isRefillable: true,
        })
        expect(screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeTruthy()
      })
    })

    describe('when userAuthorizedServices is undefined', () => {
      beforeEach(() => {
        mockUseAuthorizedServices.mockReturnValue({
          data: undefined,
        })
      })

      it('should show the Request Refill button when isRefillable is true', () => {
        initializeTestInstance({
          isRefillable: true,
        })
        expect(screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeTruthy()
      })
    })
  })
})

import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { PrescriptionAttributeData, RefillStatusConstants } from 'api/types'
import PrescriptionDetails from 'screens/HealthScreen/Pharmacy/PrescriptionDetails/PrescriptionDetails'
import { context, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig')

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

  const initializeTestInstance = (
    mockAttributeData: Partial<PrescriptionAttributeData> = {},
    cutoverFlagValue = false,
  ) => {
    const props = mockNavProps(undefined, undefined, {
      params: {
        prescription: {
          type: 'Prescription',
          id: '13650544',
          attributes: {
            refillStatus: RefillStatusConstants.ACTIVE,
            refillSubmitDate: '2022-10-28T04:00:00.000Z',
            refillDate: '2022-10-28T04:00:00.000Z',
            sortedDispensedDate: '2022-10-28T04:00:00.000Z',
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
    when(featureEnabled).calledWith('mhvMedicationsOracleHealthCutover').mockReturnValue(cutoverFlagValue)
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

  // ============================================================
  // cutover flag OFF (default) — shouldShowRefillButton is always false
  // because shouldShowRefillButton = !isAtMigratingFacility && isOHCutoverFlagEnabled
  // ============================================================
  describe('when cutover flag is disabled (default)', () => {
    describe('RequestRefillButton', () => {
      it('should not display Request Refill button even when isRefillable is true', () => {
        // shouldShowRefillButton = !false && false = false
        initializeTestInstance({ isRefillable: true })
        expect(screen.queryByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeFalsy()
      })

      it('should not display Go to My VA Health button when status is TRANSFERRED', () => {
        // shouldShowRefillButton = false, so getRefillVAHealthButton returns <></>
        initializeTestInstance({ refillStatus: RefillStatusConstants.TRANSFERRED })
        expect(screen.queryByRole('button', { name: t('goToMyVAHealth') })).toBeFalsy()
      })
    })

    describe('PrescriptionDetailsBanner', () => {
      it('should always display the error banner since shouldShowRefillButton is false', () => {
        // getBanner: !shouldShowRefillButton is true, so error banner always shows
        initializeTestInstance()
        expect(screen.getByText("You can't refill this prescription online right now")).toBeTruthy()
      })
    })
  })

  // ============================================================
  // cutover flag ON — shouldShowRefillButton depends on migrating facility
  // ============================================================
  describe('when cutover flag is enabled', () => {
    describe('RequestRefillButton', () => {
      describe('when prescription is NOT at a migrating facility', () => {
        it('should display Request Refill button when isRefillable is true', () => {
          // shouldShowRefillButton = !false && true = true
          initializeTestInstance({ isRefillable: true }, true)
          expect(screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeTruthy()
        })

        it('should not display Request Refill button when isRefillable is false', () => {
          initializeTestInstance({ isRefillable: false }, true)
          expect(screen.queryByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeFalsy()
        })
      })

      describe('when prescription IS at a migrating facility', () => {
        beforeEach(() => {
          mockUseAuthorizedServices.mockReturnValue({
            data: {
              migratingFacilitiesList: migratingFacilitiesList,
            },
          })
        })

        it('should hide Request Refill button even when isRefillable is true', () => {
          // shouldShowRefillButton = !true && true = false
          initializeTestInstance({ isRefillable: true }, true)
          expect(screen.queryByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeFalsy()
        })
      })
    })

    describe('PrescriptionDetailsBanner', () => {
      describe('when prescription is NOT at a migrating facility', () => {
        it('should display banner when status is TRANSFERRED', () => {
          // shouldShowRefillButton = true, refillStatus === TRANSFERRED
          initializeTestInstance({ refillStatus: RefillStatusConstants.TRANSFERRED }, true)
          expect(screen.getByText(t('prescription.details.banner.titleV2'))).toBeTruthy()
        })

        it('should not display banner when status is not TRANSFERRED', () => {
          // shouldShowRefillButton = true, getBanner returns <></> since status is ACTIVE
          initializeTestInstance({ refillStatus: RefillStatusConstants.ACTIVE }, true)
          expect(screen.queryByText(t('prescription.details.banner.titleV2'))).toBeFalsy()
          expect(screen.queryByText("You can't refill this prescription online right now")).toBeFalsy()
        })
      })

      describe('when prescription IS at a migrating facility', () => {
        beforeEach(() => {
          mockUseAuthorizedServices.mockReturnValue({
            data: {
              migratingFacilitiesList: migratingFacilitiesList,
            },
          })
        })

        it('should display the error banner', () => {
          // shouldShowRefillButton = false, getBanner shows error banner
          initializeTestInstance({}, true)
          expect(screen.getByText("You can't refill this prescription online right now")).toBeTruthy()
        })

        it('should display the error banner even when isRefillable is true', () => {
          initializeTestInstance({ isRefillable: true }, true)
          expect(screen.getByText("You can't refill this prescription online right now")).toBeTruthy()
        })

        it('should hide all action buttons', () => {
          initializeTestInstance({ isRefillable: true, refillStatus: RefillStatusConstants.TRANSFERRED }, true)
          expect(screen.queryByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeFalsy()
          expect(screen.queryByRole('button', { name: t('goToMyVAHealth') })).toBeFalsy()
        })
      })
    })
  })

  // ============================================================
  // Edge cases for migrating facilities data
  // ============================================================
  describe('migrating facilities edge cases', () => {
    describe('when prescription station does not match any migrating facility', () => {
      beforeEach(() => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            migratingFacilitiesList: [
              {
                migrationDate: '2026-05-01',
                facilities: [
                  { facilityId: 999, facilityName: 'Other VA Medical Center' }, // Does not match 989
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

      it('should show Request Refill button when cutover flag is enabled and isRefillable', () => {
        // isAtMigratingFacility = false, shouldShowRefillButton = !false && true = true
        initializeTestInstance({ isRefillable: true }, true)
        expect(screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeTruthy()
      })

      it('should not show error banner when cutover flag is enabled and status is ACTIVE', () => {
        initializeTestInstance({ refillStatus: RefillStatusConstants.ACTIVE }, true)
        expect(screen.queryByText("You can't refill this prescription online right now")).toBeFalsy()
      })
    })

    describe('when migratingFacilitiesList is empty', () => {
      it('should show Request Refill button when cutover flag is enabled and isRefillable', () => {
        initializeTestInstance({ isRefillable: true }, true)
        expect(screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeTruthy()
      })
    })

    describe('when userAuthorizedServices is undefined', () => {
      beforeEach(() => {
        mockUseAuthorizedServices.mockReturnValue({
          data: undefined,
        })
      })

      it('should show Request Refill button when cutover flag is enabled and isRefillable', () => {
        // migratingFacilitiesList is undefined → isAtMigratingFacility = false
        initializeTestInstance({ isRefillable: true }, true)
        expect(screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeTruthy()
      })

      it('should not show error banner when cutover flag is enabled and status is ACTIVE', () => {
        initializeTestInstance({}, true)
        expect(screen.queryByText("You can't refill this prescription online right now")).toBeFalsy()
      })
    })
  })
})

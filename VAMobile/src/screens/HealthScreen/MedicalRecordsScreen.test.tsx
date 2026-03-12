import React from 'react'
import { Alert } from 'react-native'

import { screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import MedicalRecordsScreen from 'screens/HealthScreen/MedicalRecordsScreen'
import { context, fireEvent, mockNavProps, render, when } from 'testUtils'
import getEnv from 'utils/env'
import { featureEnabled } from 'utils/remoteConfig'

const mockNavigationSpy = jest.fn()
const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => ({
  ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
  useExternalLink: () => mockExternalLinkSpy,
  useRouteNavigation: () => mockNavigationSpy,
}))

jest.mock('utils/platform', () => ({
  isIOS: jest.fn(() => false),
}))

jest.mock('utils/remoteConfig')

const mockUseFacilitiesInfo = jest.fn()
jest.mock('api/facilities/getFacilitiesInfo', () => {
  const original = jest.requireActual('api/facilities/getFacilitiesInfo')
  return {
    ...original,
    useFacilitiesInfo: () => mockUseFacilitiesInfo(),
  }
})

context('MedicalRecordsScreen', () => {
  // TODO: update tests to cover flag disabled
  const initializeTestInstance = (
    flagEnabled = true,
    labsEnabled = true,
    duplicateRecordAlertEnabled = false,
    migratingFacilitiesList: Array<object> = [],
  ) => {
    when(featureEnabled).calledWith('labsAndTests').mockReturnValue(flagEnabled)
    when(featureEnabled).calledWith('displayDuplicateRecordAlert').mockReturnValue(duplicateRecordAlertEnabled)
    render(<MedicalRecordsScreen {...mockNavProps()} />, {
      queriesData: [
        {
          queryKey: authorizedServicesKeys.authorizedServices,
          data: {
            labsAndTestsEnabled: labsEnabled,
            migratingFacilitiesList,
          },
        },
      ],
      preloadedState: {
        settings: {
          displayDuplicateRecordAlert: true,
        },
      },
    })
  }

  beforeEach(() => {
    mockUseFacilitiesInfo.mockReturnValue({
      data: [{ id: '358', name: 'FacilityOne', city: 'Cheyenne', state: 'WY', cerner: false, miles: '3.17' }],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('initializes correctly', async () => {
    initializeTestInstance()
    await waitFor(() => expect(screen.getByRole('header')).toBeTruthy())
    await waitFor(() => expect(screen.getAllByRole('link')).toHaveLength(5))
  })

  it('should navigate to VaccineList on button press', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('toVaccineListID'))
    expect(mockNavigationSpy).toHaveBeenCalledWith('VaccineList')
  })

  it('should navigate to AllergyList on button press', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('toAllergyListID'))
    expect(mockNavigationSpy).toHaveBeenCalledWith('AllergyList')
  })

  it('should navigate to webview with correct parameters when view complete medical record link is pressed', () => {
    const { LINK_URL_MHV_VA_MEDICAL_RECORDS } = getEnv()
    render(<MedicalRecordsScreen {...mockNavProps()} />)
    const completeRecordLink = screen.getByTestId('viewMedicalRecordsLinkID')
    fireEvent.press(completeRecordLink)
    expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', {
      url: LINK_URL_MHV_VA_MEDICAL_RECORDS,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('webview.medicalRecords.loading'),
      useSSO: true,
    })
  })

  it('should open the Share My Health Data link', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByRole('link', { name: t('vaMedicalRecords.shareMyHealthDataApp.link') }))
    expect(Alert.alert).toHaveBeenCalled()
  })

  it('should navigate to LabsList on button press if flags enabled', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('toLabsAndTestListID'))
    expect(mockNavigationSpy).toHaveBeenCalledWith('LabsAndTestsList')
  })

  it('should not display the LabsList button if remote config flag disabled', () => {
    initializeTestInstance(false)
    expect(screen.queryByTestId('toLabsAndTestListID')).toBeNull()
  })

  it('should not display the LabsList button if authorized services flag disabled', () => {
    initializeTestInstance(true, false)
    expect(screen.queryByTestId('toLabsAndTestListID')).toBeNull()
  })

  describe('DuplicateRecordAlert', () => {
    it('should display the alert when feature flag is enabled and user has cerner facilities', () => {
      mockUseFacilitiesInfo.mockReturnValue({
        data: [{ id: '358', name: 'FacilityOne', city: 'Cheyenne', state: 'WY', cerner: true, miles: '3.17' }],
      })
      initializeTestInstance(true, true, true)
      expect(screen.getByText('You may notice duplicate records for a time')).toBeTruthy()
    })

    it('should display the alert when feature flag is enabled and user is in p6 migration', () => {
      const migratingFacilitiesList = [
        {
          migrationDate: '2026-05-01',
          facilities: [{ facilityId: 528, facilityName: 'Test VA Medical Center' }],
          phases: {
            current: 'p6',
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
      initializeTestInstance(true, true, true, migratingFacilitiesList)
      expect(screen.getByText('You may notice duplicate records for a time')).toBeTruthy()
    })

    it('should display the alert when feature flag is enabled and user is in p7 migration', () => {
      const migratingFacilitiesList = [
        {
          migrationDate: '2026-05-01',
          facilities: [{ facilityId: 528, facilityName: 'Test VA Medical Center' }],
          phases: {
            current: 'p7',
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
      initializeTestInstance(true, true, true, migratingFacilitiesList)
      expect(screen.getByText('You may notice duplicate records for a time')).toBeTruthy()
    })

    it('should not display the alert when feature flag is disabled', () => {
      mockUseFacilitiesInfo.mockReturnValue({
        data: [{ id: '358', name: 'FacilityOne', city: 'Cheyenne', state: 'WY', cerner: true, miles: '3.17' }],
      })
      initializeTestInstance(true, true, false)
      expect(screen.queryByText('You may notice duplicate records for a time')).toBeFalsy()
    })

    it('should not display the alert when feature flag is enabled but user has no cerner facilities and no p6/p7 migration', () => {
      initializeTestInstance(true, true, true)
      expect(screen.queryByText('You may notice duplicate records for a time')).toBeFalsy()
    })

    it('should not display the alert when user is in a migration phase other than p6 or p7', () => {
      const migratingFacilitiesList = [
        {
          migrationDate: '2026-05-01',
          facilities: [{ facilityId: 528, facilityName: 'Test VA Medical Center' }],
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
      initializeTestInstance(true, true, true, migratingFacilitiesList)
      expect(screen.queryByText('You may notice duplicate records for a time')).toBeFalsy()
    })

    it('should not display the alert when migration alerts are showing even with cerner facilities', () => {
      mockUseFacilitiesInfo.mockReturnValue({
        data: [{ id: '358', name: 'FacilityOne', city: 'Cheyenne', state: 'WY', cerner: true, miles: '3.17' }],
      })
      const migratingFacilitiesList = [
        {
          migrationDate: '2026-05-01',
          facilities: [{ facilityId: 528, facilityName: 'Test VA Medical Center' }],
          phases: {
            current: 'p5',
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
      initializeTestInstance(true, true, true, migratingFacilitiesList)
      expect(screen.queryByText('You may notice duplicate records for a time')).toBeFalsy()
    })
  })
})

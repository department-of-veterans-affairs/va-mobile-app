import React from 'react'
import { Alert } from 'react-native'

import { screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

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

context('MedicalRecordsScreen', () => {
  const initializeTestInstance = () => {
    when(featureEnabled).calledWith('shareMyHealthDataLink').mockReturnValue(true)
    render(<MedicalRecordsScreen {...mockNavProps()} />)
  }

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
})

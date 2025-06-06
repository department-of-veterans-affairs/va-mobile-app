import React from 'react'
import { Alert } from 'react-native'

import { screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, fireEvent, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

import MedicalRecordsScreen from './MedicalRecordsScreen'

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
    when(featureEnabled).calledWith('allergies').mockReturnValue(true)
    when(featureEnabled).calledWith('shareMyHealthDataLink').mockReturnValue(true)
    render(<MedicalRecordsScreen {...mockNavProps()} />)
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    await waitFor(() => expect(screen.getByRole('header')).toBeTruthy())
    await waitFor(() => expect(screen.getAllByRole('link')).toHaveLength(4))
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

  it('should open the VA medical records link', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('viewMedicalRecordsLinkID'))
    expect(Alert.alert).toHaveBeenCalled()
  })

  it('should open the Share My Health Data link', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByRole('link', { name: t('vaMedicalRecords.shareMyHealthDataApp.link') }))
    expect(Alert.alert).toHaveBeenCalled()
  })
})

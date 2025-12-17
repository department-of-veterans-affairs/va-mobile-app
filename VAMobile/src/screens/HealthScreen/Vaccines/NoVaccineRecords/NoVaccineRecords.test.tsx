import React from 'react'
import { Linking } from 'react-native'
import { t } from 'i18next'

import { fireEvent, screen } from '@testing-library/react-native'

import NoVaccineRecords from 'screens/HealthScreen/Vaccines/NoVaccineRecords/NoVaccineRecords'
import { context, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig')

context('NoVaccineRecords', () => {
  const mockFeatureEnabled = featureEnabled as jest.Mock

  const initializeTestInstance = (mrHide36HrHoldTimes = false) => {
    when(mockFeatureEnabled).calledWith('mrHide36HrHoldTimes').mockReturnValue(mrHide36HrHoldTimes)
    render(<NoVaccineRecords />)
  }

  describe('when mrHide36HrHoldTimes is false', () => {
    it('initializes correctly with 36 hour text', () => {
      initializeTestInstance(false)
      expect(screen.getByRole('heading', { name: t('noVaccineRecords.alert.title') })).toBeTruthy()
      expect(screen.getByText(t('noVaccineRecords.alert.text.1')),).toBeTruthy()
      expect(screen.getByText(t('noVaccineRecords.alert.text.2'))).toBeTruthy()
      expect(screen.getByRole('link', { name: '800-698-2411' })).toBeTruthy()
      expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
    })
  })

  describe('when mrHide36HrHoldTimes is true', () => {
    it('initializes correctly without 36 hour text', () => {
      initializeTestInstance(true)
      expect(screen.getByRole('heading', { name: t('noVaccineRecords.alert.title') })).toBeTruthy()
      expect(screen.getByText(t('noVaccineRecords.zeroHoldTimes.text.1'))).toBeTruthy()
      expect(screen.getByText(t('noVaccineRecords.alert.text.2'))).toBeTruthy()
      expect(screen.getByRole('link', { name: '800-698-2411' })).toBeTruthy()
      expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
    })
  })

  describe('when the My HealtheVet phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8006982411', () => {
      initializeTestInstance(false)
      fireEvent.press(screen.getByRole('link', { name: '800-698-2411' }))
      expect(Linking.openURL).toBeCalledWith('tel:8006982411')
    })
  })

  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', () => {
      initializeTestInstance(false)
      fireEvent.press(screen.getByRole('link', { name: 'TTY: 711' }))
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})

import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import PrescriptionsDetailsBanner from 'screens/HealthScreen/Pharmacy/PrescriptionDetails/PrescriptionsDetailsBanner'
import { context, render, when } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig')

context('PrescriptionsDetailsBanner', () => {
  it('initializes correctly', () => {
    render(<PrescriptionsDetailsBanner />)
    expect(screen.getByText(t('prescription.details.banner.title'))).toBeTruthy()
  })

  it('should show expanded content', () => {
    render(<PrescriptionsDetailsBanner />)
    fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
    expect(screen.getByText(`${t('prescription.details.banner.bullet1')} ${t('or')}`)).toBeTruthy()
    expect(screen.getByText(`${t('prescription.details.banner.bullet2')} ${t('or')}`)).toBeTruthy()
    expect(screen.getByText(`${t('prescription.details.banner.bullet3')} ${t('or')}`)).toBeTruthy()
    expect(screen.getByText(t('prescription.details.banner.bullet4'))).toBeTruthy()
    expect(screen.getByText(t('automatedPhoneSystem'))).toBeTruthy()
    expect(screen.getByText(displayedTextPhoneNumber(t('5418307563')))).toBeTruthy()
    expect(screen.getByText(t('contactVA.tty.displayText'))).toBeTruthy()
  })

  it('should show expanded content when mhvMedicationsOracleHealthCutover flag is enabled', () => {
    when(featureEnabled).calledWith('mhvMedicationsOracleHealthCutover').mockReturnValue(true)
    render(<PrescriptionsDetailsBanner />)
    fireEvent.press(screen.getByText(t('prescription.details.banner.titleV2')))
    expect(screen.getByText(`${t('prescription.details.banner.bodyV2')}`)).toBeTruthy()
  })
})

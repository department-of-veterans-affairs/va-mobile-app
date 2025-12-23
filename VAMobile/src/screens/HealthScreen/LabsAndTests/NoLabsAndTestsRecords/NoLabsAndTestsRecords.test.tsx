import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import NoLabsAndTestsRecords from 'screens/HealthScreen/LabsAndTests/NoLabsAndTestsRecords/NoLabsAndTestsRecords'
import { context, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig')

context('NoLabsAndTestsRecords', () => {
  const mockFeatureEnabled = featureEnabled as jest.Mock

  const initializeTestInstance = (mrHide36HrHoldTimes = false) => {
    when(mockFeatureEnabled).calledWith('mrHide36HrHoldTimes').mockReturnValue(mrHide36HrHoldTimes)
    return render(<NoLabsAndTestsRecords />)
  }

  it('renders the NoLabsAndTestsRecords component', () => {
    initializeTestInstance()
    expect(screen.getByTestId('NoLabsAndTestsRecords')).toBeTruthy()
  })

  it('displays the correct alert title', () => {
    initializeTestInstance()
    expect(screen.getByText(t('labsAndTests.noRecords.alert.title'))).toBeTruthy()
  })

  describe('when mrHide36HrHoldTimes is false', () => {
    it('displays the correct alert description with 36 hour text', () => {
      initializeTestInstance(false)
      expect(screen.getByText(t('labsAndTests.noRecords.alert.text.1'))).toBeTruthy()
      expect(screen.getByText(t('labsAndTests.noRecords.alert.text.2'))).toBeTruthy()
    })
  })

  describe('when mrHide36HrHoldTimes is true', () => {
    it('displays the correct alert description without 36 hour text', () => {
      initializeTestInstance(true)
      expect(screen.getByText(t('labsAndTests.noRecords.zeroHoldTimes.text.1'))).toBeTruthy()
      expect(screen.getByText(t('labsAndTests.noRecords.alert.text.2'))).toBeTruthy()
    })
  })

  it('displays the correct phone number', () => {
    initializeTestInstance()
    expect(screen.getByText('800-698-2411')).toBeTruthy()
  })
})

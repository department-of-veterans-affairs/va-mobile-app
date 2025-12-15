import React from 'react'

import { screen } from '@testing-library/react-native'

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
    expect(screen.getByText("We couldn't find information about your labs and tests")).toBeTruthy()
  })

  describe('when mrHide36HrHoldTimes is false', () => {
    it('displays the correct alert description with 36 hour text', () => {
      initializeTestInstance(false)
      expect(
        screen.getByText(
          "We're sorry. We update your labs and tests records every 24 hours, but new records can take up to 36 hours to appear.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          "If you think your labs and tests records should be here, call our MyVA411 main information line. We're here 24/7.",
        ),
      ).toBeTruthy()
    })
  })

  describe('when mrHide36HrHoldTimes is true', () => {
    it('displays the correct alert description without 36 hour text', () => {
      initializeTestInstance(true)
      expect(screen.getByText('We update your labs and tests records every 24 hours.')).toBeTruthy()
      expect(
        screen.getByText(
          "If you think your labs and tests records should be here, call our MyVA411 main information line. We're here 24/7.",
        ),
      ).toBeTruthy()
    })
  })

  it('displays the correct phone number', () => {
    initializeTestInstance()
    expect(screen.getByText('800-698-2411')).toBeTruthy()
  })
})

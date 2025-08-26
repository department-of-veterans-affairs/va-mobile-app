import React from 'react'

import { screen } from '@testing-library/react-native'

import { FileOnBTSSSLink } from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/components'
import { context, render } from 'testUtils'

context('FileOnBTSSSLink', () => {
  const initializeTestInstance = (text: string = 'Test Link Text', testID: string = 'testFileOnBTSSSLink') => {
    render(<FileOnBTSSSLink text={text} testID={testID} />)
  }

  it('should render correctly with default props', () => {
    initializeTestInstance()

    expect(screen.getByTestId('testFileOnBTSSSLink')).toBeTruthy()
    expect(screen.getByText('Test Link Text')).toBeTruthy()
  })

  it('should render with custom text and testID', () => {
    const customProps = {
      text: 'Custom Link Text',
      testID: 'customTestID',
    }
    initializeTestInstance(customProps.text, customProps.testID)

    expect(screen.getByTestId('customTestID')).toBeTruthy()
    expect(screen.getByText('Custom Link Text')).toBeTruthy()
  })
})

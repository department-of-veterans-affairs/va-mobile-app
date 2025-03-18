import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import FileOnlineComponent from './FileOnlineComponent'

context('FileOnlineComponent', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps()
    render(<FileOnlineComponent {...props} />)
  }
  it('should initialize correctly', () => {
    initializeTestInstance()

    expect(screen.getByText(t('travelPay.youCanStillFile'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.youCanStillFile.bulletOne'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.youCanStillFile.bulletTwo'))).toBeTruthy()
  })
})

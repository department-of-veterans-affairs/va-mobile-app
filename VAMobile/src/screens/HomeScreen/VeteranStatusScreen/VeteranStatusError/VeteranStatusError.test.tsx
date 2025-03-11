import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import VeternStatusError from './VeteranStatusError'

context('VeternStatusError', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<VeternStatusError {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
    expect(screen.getByText(t('veteranStatus.error.catchAll.body'))).toBeTruthy()
  })
})

import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import AccountSecurity from './AccountSecurity'

context('AccountSecurity', () => {
  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })
    render(<AccountSecurity {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText(t('accountSecurity.signIn'))).toBeTruthy()
    expect(screen.getByText(t('accountSecurity.description'))).toBeTruthy()
  })
})

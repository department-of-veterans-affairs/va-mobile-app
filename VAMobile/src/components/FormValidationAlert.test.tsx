import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import FormValidationAlert from 'components/FormValidationAlert'
import { render } from 'testUtils'

const mockErrorList = ['Error 1', 'Error 2']

describe('FormValidationAlert', () => {
  const initializeTestInstance = (hasValidationError: boolean, errorList: Array<string>) => {
    render(
      <FormValidationAlert
        description="Please fix the following errors:"
        hasValidationError={hasValidationError}
        errorList={errorList}
      />,
    )
  }
  it('should render the alert with the correct description and error list when there is a validation error', async () => {
    initializeTestInstance(true, mockErrorList)
    expect(screen.getByRole('heading', { name: t('secureMessaging.formMessage.weNeedMoreInfo') })).toBeTruthy()
    expect(screen.getByText('Please fix the following errors:')).toBeTruthy()
    expect(screen.getByText('Error 1')).toBeTruthy()
    expect(screen.getByText('Error 2')).toBeTruthy()
  })

  it('should not render the alert when there is no validation error', async () => {
    initializeTestInstance(false, mockErrorList)
    expect(screen.queryByRole('heading', { name: t('secureMessaging.formMessage.weNeedMoreInfo') })).toBeFalsy()
  })

  it('should not render the alert when there are no errors in the error list', async () => {
    initializeTestInstance(true, [])
    expect(screen.queryByRole('heading', { name: t('secureMessaging.formMessage.weNeedMoreInfo') })).toBeFalsy()
  })
})

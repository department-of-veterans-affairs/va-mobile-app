import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import WhatDoIDoIfDisagreement from './WhatDoIDoIfDisagreement'

context('WhatDoIDoIfDisagreement', () => {
  beforeEach(() => {
    const props = mockNavProps({}, {}, { params: { display: '', value: 'active' } })
    render(<WhatDoIDoIfDisagreement {...props} />)
  })

  it('Renders WhatDoIDoIfDisagreement', () => {
    expect(screen.getByRole('header', { name: t('claimDetails.learnWhatToDoIfDisagreePanel') })).toBeTruthy()
    expect(screen.getByText(t('claimsDetails.whatDoIDoIfDisagreement.content'))).toBeTruthy()
    expect(screen.getByText(t('claimsDetails.whatDoIDoIfDisagreement.learnAboutDecisionReview'))).toBeTruthy()
    fireEvent.press(
      screen.getByRole('link', { name: t('claimsDetails.whatDoIDoIfDisagreement.learnAboutDecisionReview') }),
    )
    expect(Alert.alert).toHaveBeenCalled()
  })
})

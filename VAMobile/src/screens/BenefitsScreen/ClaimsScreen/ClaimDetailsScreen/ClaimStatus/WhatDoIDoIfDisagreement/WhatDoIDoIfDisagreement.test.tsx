import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import WhatDoIDoIfDisagreement from './WhatDoIDoIfDisagreement'

context('WhatDoIDoIfDisagreement', () => {
  beforeEach(() => {
    const props = mockNavProps({}, {}, { params: { display: '', value: 'active' } })
    render(<WhatDoIDoIfDisagreement {...props} />)
  })

  it('Renders WhatDoIDoIfDisagreement', () => {
    expect(
      screen.getByText('What should I do if I disagree with your decision on my VA disability claim?'),
    ).toBeTruthy()
    expect(
      screen.getByText(
        'If you disagree with a claim decision that you received on or after February 19, 2019, you can ask us to review the decision. You have 3 decision review options to choose from.',
      ),
    ).toBeTruthy()
    expect(screen.getByText('Learn more about decision reviews and appeals')).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: 'Learn more about decision reviews and appeals' }))
    expect(Alert.alert).toHaveBeenCalled()
  })
})

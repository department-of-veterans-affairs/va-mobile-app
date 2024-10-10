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
    expect(screen.getByRole('header', { name: 'What to do if you disagree with our decision' })).toBeTruthy()
    expect(
      screen.getByText(
        'If you disagree with our decision, you can ask for a decision review. You have 3 decision review options to choose from.',
      ),
    ).toBeTruthy()
    expect(screen.getByText('Learn more about decision reviews and appeals')).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: 'Learn more about decision reviews and appeals' }))
    expect(Alert.alert).toHaveBeenCalled()
  })
})

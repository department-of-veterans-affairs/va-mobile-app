import React from 'react'
import { screen, fireEvent } from '@testing-library/react-native'

import { context, render, mockNavProps } from 'testUtils'
import WhatDoIDoIfDisagreement from './WhatDoIDoIfDisagreement'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('WhatDoIDoIfDisagreement', () => {
  beforeEach(() => {
    const props = mockNavProps({}, {}, { params: { display: '', value: 'active' } })
    render(<WhatDoIDoIfDisagreement {...props} />)
  })

  it('Renders WhatDoIDoIfDisagreement', () => {
    expect(screen.getByText('What should I do if I disagree with your decision on my VA disability claim?')).toBeTruthy()
    expect(screen.getByText('If you disagree with a claim decision that you received on or after February 19, 2019, you can ask us to review the decision. You have 3 decision review options to choose from.')).toBeTruthy()
    expect(screen.getByText('Learn about your decision review options.')).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: 'Learn about your decision review options.'}))
    expect(mockExternalLinkSpy).toHaveBeenCalled()
  })
})

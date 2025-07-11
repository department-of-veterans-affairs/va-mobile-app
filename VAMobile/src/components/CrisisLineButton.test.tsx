import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { CrisisLineButton } from 'components'
import { context, render } from 'testUtils'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  return {
    ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('CrisisLineButton', () => {
  it('navigates to VeteransCrisisLine on press', () => {
    render(<CrisisLineButton />)
    fireEvent.press(screen.getByRole('link', { name: 'Talk to the Veterans Crisis Line now' }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('VeteransCrisisLine')
  })
})

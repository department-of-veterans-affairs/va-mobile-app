import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import Nametag from 'components/Nametag/Nametag'
import { context, render } from 'testUtils'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('Nametag', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders VA seal + Veteran Status Card and navigates on press', () => {
    render(<Nametag />)

    expect(screen.getByTestId('VASeal')).toBeTruthy()
    expect(screen.getByText('Veteran Status Card')).toBeTruthy()

    fireEvent.press(screen.getByRole('link', { name: 'Veteran Status Card' }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('VeteranStatus')
  })
})

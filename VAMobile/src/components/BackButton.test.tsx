import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { BackButtonLabel, BackButtonLabelConstants } from 'constants/backButtonLabels'
import { context, render } from 'testUtils'

import BackButton from './BackButton'

context('BackButton', () => {
  const onPressSpy = jest.fn()

  const renderWithProps = (canGoBack: boolean, a11yHint?: string, label?: BackButtonLabel) => {
    render(
      <BackButton
        onPress={onPressSpy}
        label={label || BackButtonLabelConstants.back}
        canGoBack={canGoBack}
        a11yHint={a11yHint}
      />,
    )
  }

  it('renders button label and hint', () => {
    renderWithProps(true)
    expect(screen.getByRole('button', { name: 'Back' })).toBeTruthy()
    expect(screen.getAllByA11yHint('Navigates to the previous page')).toBeTruthy()
  })

  it('does not render button when canGoBack is false', () => {
    renderWithProps(false)
    expect(screen.queryByRole('button', { name: 'Back' })).toBeFalsy()
  })

  it('calls onPress when pressed', () => {
    renderWithProps(true)
    fireEvent.press(screen.getByRole('button', { name: 'Back' }))
    expect(onPressSpy).toHaveBeenCalled()
  })

  it('shows carat when showCarat is true', () => {
    renderWithProps(true)
    expect(screen.getByTestId('BackButtonCarat')).toBeTruthy()
  })

  it('shows custom a11yHint', () => {
    renderWithProps(true, 'Action on click')
    expect(screen.getByA11yHint('Action on click')).toBeTruthy()
  })

  it('shows correct a11yHint when label is "Cancel"', () => {
    renderWithProps(true, undefined, BackButtonLabelConstants.cancel)
    expect(screen.getByA11yHint('Cancels changes and navigates to the previous page')).toBeTruthy()
  })

  it('shows correct a11yHint when label is "Done"', () => {
    renderWithProps(true, undefined, BackButtonLabelConstants.done)
    expect(screen.getByA11yHint('Exits out of the web view and navigates to the previous page')).toBeTruthy()
  })
})

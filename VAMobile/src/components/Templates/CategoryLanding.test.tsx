import React from 'react'

import { HeaderButton } from 'components/types'
import { context, fireEvent, render, screen } from 'testUtils'

import { CategoryLanding } from './CategoryLanding'

context('CategoryLandingTemplate', () => {
  const onPressSpy = jest.fn()

  const initializeTestInstance = (titleText?: string, headerButton?: HeaderButton) => {
    render(<CategoryLanding title={titleText} headerButton={headerButton} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('should render Veterans Crisis Line information', () => {
    expect(screen.getByText(/Veterans Crisis Line/)).toBeTruthy()
  })

  it('should render the title as a header when passed in', () => {
    initializeTestInstance('category')
    expect(screen.getByRole('header', { name: 'category' })).toBeTruthy()
  })

  it('should render a header button if passed in', () => {
    initializeTestInstance('', { label: 'test', icon: { name: 'HomeSelected' }, onPress: onPressSpy })
    fireEvent.press(screen.getByRole('button', { name: 'test' }))
    expect(onPressSpy).toHaveBeenCalled()
  })
})

import React from 'react'

import TextView from 'components/TextView'
import { HeaderButton } from 'components/types'
import { context, fireEvent, render, screen } from 'testUtils'

import { FeatureLandingTemplate } from './FeatureLandingAndChildTemplate'

context('FeatureLandingAndChildTemplate', () => {
  const onPressSpy = jest.fn()
  const onBackPressSpy = jest.fn()

  const initializeTestInstance = (headerButton?: HeaderButton, footerContent?: React.ReactNode) => {
    render(
      <FeatureLandingTemplate
        backLabel="Back"
        backLabelOnPress={onBackPressSpy}
        title="Title"
        headerButton={headerButton}
        footerContent={footerContent}
      />,
    )
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('should render the title as a header when passed in', () => {
    expect(screen.getByRole('header', { name: 'Title' })).toBeTruthy()
  })

  it('should render a back label and onPress', () => {
    expect(screen.getByRole('link', { name: 'Back' })).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: 'Back' }))
    expect(onBackPressSpy).toHaveBeenCalled()
  })

  it('should render a header button and onPress if passed in', () => {
    initializeTestInstance({ label: 'test', icon: { name: 'HomeOutlined' }, onPress: onPressSpy })
    fireEvent.press(screen.getByRole('button', { name: 'test' }))
    expect(onPressSpy).toHaveBeenCalled()
  })

  it('should render footer content if passed in', () => {
    const footer = <TextView>I am a footer</TextView>
    initializeTestInstance(undefined, footer)
    expect(screen.getByText('I am a footer')).toBeTruthy()
  })
})

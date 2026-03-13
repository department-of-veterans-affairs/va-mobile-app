import React from 'react'

import RealCarousel, { RealCarouselCardData } from 'components/RealCarousel'
import { context, fireEvent, render, screen, waitFor } from 'testUtils'

context('RealCarousel', () => {
  const dismissCardOne = jest.fn().mockResolvedValue(undefined)
  const dismissCardTwo = jest.fn().mockResolvedValue(undefined)

  const baseData: RealCarouselCardData[] = [
    {
      id: 'card-1',
      title: 'Card 1',
      content: <></>,
      onDismiss: dismissCardOne,
    },
    {
      id: 'card-2',
      title: 'Card 2',
      content: <></>,
      onDismiss: dismissCardTwo,
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the first card and current position label for a multi-card carousel', async () => {
    render(<RealCarousel data={baseData} />)

    await waitFor(() => {
      expect(screen.getByText('Card 1')).toBeTruthy()
      expect(screen.getByText('1 of 2')).toBeTruthy()
    })
  })

  it('calls dismiss for the visible card when close is pressed', () => {
    render(<RealCarousel data={[baseData[0]]} />)

    fireEvent.press(screen.getByRole('button'))

    expect(dismissCardOne).toHaveBeenCalledTimes(1)
  })

  it('renders an action button and calls onAction when pressed', () => {
    const onAction = jest.fn()

    render(
      <RealCarousel
        data={[
          {
            ...baseData[0],
            onAction,
          },
        ]}
      />,
    )

    fireEvent.press(screen.getByText('Go to feature'))

    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('renders safely when no cards are provided', () => {
    render(<RealCarousel data={[]} />)

    expect(screen.queryByText('Card 1')).toBeNull()
    expect(screen.queryByText('1 of 1')).toBeNull()
  })

  it('renders a single card with the correct position label', () => {
    render(<RealCarousel data={[baseData[0]]} />)

    expect(screen.getByText('Card 1')).toBeTruthy()
    expect(screen.getByText('1 of 1')).toBeTruthy()
  })

  it('removes the current card from view when dismissed', async () => {
    render(<RealCarousel data={baseData} />)

    fireEvent.press(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.queryByText('Card 1')).toBeNull()
      expect(screen.getByText('Card 2')).toBeTruthy()
      expect(screen.getByText('1 of 1')).toBeTruthy()
    })
  })
})


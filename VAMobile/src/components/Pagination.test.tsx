import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import Pagination, { PaginationProps } from './Pagination'

context('Pagination', () => {
  const prevSpy = jest.fn()
  const nextSpy = jest.fn()

  const renderWithProps = (partialProps?: Partial<PaginationProps>) => {
    const fullProps = {
      onPrev: prevSpy,
      onNext: nextSpy,
      totalEntries: 12,
      page: 1,
      pageSize: 10,
      ...partialProps,
    }
    render(<Pagination {...fullProps} />)
  }

  it('renders page count', () => {
    renderWithProps()
    expect(screen.getByText('1 to 10 of 12')).toBeTruthy()
  })

  it('does not render pagination when totalEntries < pageSize', () => {
    renderWithProps({ totalEntries: 2 })
    expect(screen.queryByText('1 to 10')).toBeFalsy()
  })

  it('calls onPrev when previous arrow is pressed', () => {
    renderWithProps({ page: 2 })
    fireEvent.press(screen.getByTestId('previous-page'))
    expect(prevSpy).toHaveBeenCalled()
  })

  it('disables prev arrow on first page', () => {
    renderWithProps()
    expect(screen.getByRole('link', { disabled: true })).toBeTruthy()
  })

  it('calls onNext when next arrow is pressed', () => {
    renderWithProps()
    fireEvent.press(screen.getByTestId('next-page'))
    expect(nextSpy).toHaveBeenCalled()
  })

  it('disables next arrow on last page', () => {
    renderWithProps({ page: 2 })
    expect(screen.getByRole('link', { disabled: true })).toBeTruthy()
  })
})

import React from 'react'

import { screen } from '@testing-library/react-native'

import { InlineContent } from 'api/types'
import { TextView } from 'components'
import { InlineRenderer } from 'components/StructuredContentRenderer/InlineRenderer'
import { context, render } from 'testUtils'

context('InlineRenderer', () => {
  it('should render string content', () => {
    render(<InlineRenderer content="Plain text" />)
    expect(screen.getByText('Plain text')).toBeTruthy()
  })

  it('should render array of strings', () => {
    render(<InlineRenderer content={['Hello', ' ', 'World']} />)
    expect(screen.getByText('Hello')).toBeTruthy()
    expect(screen.getByText(' ')).toBeTruthy()
    expect(screen.getByText('World')).toBeTruthy()
  })

  it('should render mixed array with links', () => {
    render(<InlineRenderer content={['Visit ', { type: 'link', text: 'VA.gov', href: '/test' }, ' for more info']} />)
    expect(screen.getByText('Visit ')).toBeTruthy()
    expect(screen.getByText(' for more info')).toBeTruthy()
    const link = screen.getByRole('link', { name: 'VA.gov' })
    expect(link).toBeTruthy()
    expect(link.props.accessibilityLabel).toBe('VA.gov')
  })

  it('should render bold text', () => {
    render(<InlineRenderer content={{ type: 'bold', content: 'Bold text' }} />)
    expect(screen.getByText('Bold text')).toBeTruthy()
  })

  it('should render italic text', () => {
    render(<InlineRenderer content={{ type: 'italic', content: 'Italic text' }} />)
    expect(screen.getByText('Italic text')).toBeTruthy()
  })

  it('should render link', () => {
    render(<InlineRenderer content={{ type: 'link', text: 'Test Link', href: '/test' }} />)
    const link = screen.getByRole('link', { name: 'Test Link' })
    expect(link).toBeTruthy()
    expect(link.props.accessibilityLabel).toBe('Test Link')
  })

  it('should render telephone', () => {
    render(<InlineRenderer content={{ type: 'telephone', contact: '8008271000' }} />)
    const link = screen.getByRole('link', { name: '8 0 0 8 2 7 1 0 0 0' })
    expect(link).toBeTruthy()
    expect(link.props.accessibilityLabel).toBe('8 0 0 8 2 7 1 0 0 0')
    expect(screen.getByText('800-827-1000')).toBeTruthy()
  })

  it('should render telephone with TTY', () => {
    render(<InlineRenderer content={{ type: 'telephone', contact: '711', tty: true }} />)
    const link = screen.getByRole('link', { name: '7 1 1' })
    expect(link).toBeTruthy()
    expect(link.props.accessibilityLabel).toBe('7 1 1')
    expect(screen.getByText('TTY: 711')).toBeTruthy()
  })

  it('should render line break', () => {
    render(<InlineRenderer content={{ type: 'lineBreak' }} />)
    expect(screen.getByText('\n')).toBeTruthy()
  })

  it('should handle nested content', () => {
    render(
      <InlineRenderer content={{ type: 'bold', content: ['This is ', { type: 'italic', content: 'bold italic' }] }} />,
    )
    expect(screen.getByText('This is ')).toBeTruthy()
    expect(screen.getByText('bold italic')).toBeTruthy()
  })

  it('should return null for invalid content', () => {
    render(
      <>
        <InlineRenderer content={{ type: 'unknown' } as unknown as InlineContent} />
        <TextView testID="sibling">sibling</TextView>
      </>,
    )
    expect(screen.getByTestId('sibling')).toBeTruthy()
    expect(screen.queryByText('unknown')).toBeNull()
  })
})

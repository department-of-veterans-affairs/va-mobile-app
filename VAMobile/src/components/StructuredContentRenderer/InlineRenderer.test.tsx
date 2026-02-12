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
    render(
      <InlineRenderer
        content={['Visit ', { type: 'link' as const, text: 'VA.gov', href: '/test' }, ' for more info']}
      />,
    )
    expect(screen.getByText('Visit ')).toBeTruthy()
    expect(screen.getByText(' for more info')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'VA.gov' })).toBeTruthy()
  })

  it('should render bold text', () => {
    render(<InlineRenderer content={{ type: 'bold' as const, content: 'Bold text' } as unknown as InlineContent} />)
    expect(screen.getByText('Bold text')).toBeTruthy()
  })

  it('should render italic text', () => {
    render(<InlineRenderer content={{ type: 'italic' as const, content: 'Italic text' } as unknown as InlineContent} />)
    expect(screen.getByText('Italic text')).toBeTruthy()
  })

  it('should render link', () => {
    render(
      <InlineRenderer
        content={
          {
            type: 'link' as const,
            text: 'Test Link',
            href: '/test',
          } as unknown as InlineContent
        }
      />,
    )
    expect(screen.getByRole('link', { name: 'Test Link' })).toBeTruthy()
  })

  it('should render telephone', () => {
    render(
      <InlineRenderer content={{ type: 'telephone' as const, contact: '8008271000' } as unknown as InlineContent} />,
    )
    expect(screen.getByRole('link', { name: '8008271000' })).toBeTruthy()
  })

  it('should render telephone with TTY', () => {
    render(
      <InlineRenderer
        content={{ type: 'telephone' as const, contact: '711', tty: true } as unknown as InlineContent}
      />,
    )
    expect(screen.getByRole('link', { name: '711' })).toBeTruthy()
    expect(screen.getByTestId('CallTTYTestID')).toBeTruthy()
  })

  it('should render line break', () => {
    render(<InlineRenderer content={{ type: 'lineBreak' as const } as unknown as InlineContent} />)
    expect(screen.getByText('\n')).toBeTruthy()
  })

  it('should handle nested content', () => {
    render(
      <InlineRenderer
        content={
          {
            type: 'bold' as const,
            content: ['This is ', { type: 'italic' as const, content: 'bold italic' }],
          } as unknown as InlineContent
        }
      />,
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

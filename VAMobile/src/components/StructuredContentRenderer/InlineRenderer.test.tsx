import React from 'react'

import { screen } from '@testing-library/react-native'

import { InlineContent } from 'api/types'
import { TextView } from 'components'
import { InlineRenderer } from 'components/StructuredContentRenderer/InlineRenderer'
import { context, render } from 'testUtils'

context('InlineRenderer', () => {
  it('should render string content as a single text node', () => {
    render(<InlineRenderer content="Plain text" />)
    expect(screen.getByText('Plain text')).toBeTruthy()
  })

  it('should render array of strings', () => {
    render(
      <TextView>
        <InlineRenderer content={['Hello', ' ', 'World']} />
      </TextView>,
    )
    expect(screen.getByText('Hello')).toBeTruthy()
    expect(screen.getByText('World')).toBeTruthy()
  })

  it('should render bold text', () => {
    render(<InlineRenderer content={{ type: 'bold', content: 'Bold text' }} />)
    expect(screen.getByText('Bold text')).toBeTruthy()
  })

  it('should render italic text', () => {
    render(<InlineRenderer content={{ type: 'italic', content: 'Italic text' }} />)
    expect(screen.getByText('Italic text')).toBeTruthy()
  })

  it('should render line break as newline character', () => {
    render(
      <TextView>
        <InlineRenderer content={['Before', { type: 'lineBreak' }, 'After'] as InlineContent} />
      </TextView>,
    )
    expect(screen.getByText('Before')).toBeTruthy()
    expect(screen.getByText('After')).toBeTruthy()
  })

  it('should handle nested content (bold + italic)', () => {
    render(
      <InlineRenderer content={{ type: 'bold', content: ['This is ', { type: 'italic', content: 'bold italic' }] }} />,
    )
    expect(screen.getByText('This is ')).toBeTruthy()
    expect(screen.getByText('bold italic')).toBeTruthy()
  })

  it('should skip link elements (rendered by BlockRenderer)', () => {
    render(
      <TextView>
        <InlineRenderer content={['Before ', { type: 'link', text: 'Link', href: '/test' }, ' after']} />
      </TextView>,
    )
    expect(screen.getByText('Before ')).toBeTruthy()
    expect(screen.getByText(' after')).toBeTruthy()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('should skip telephone elements (rendered by BlockRenderer)', () => {
    render(
      <TextView>
        <InlineRenderer content={['Call ', { type: 'telephone', contact: '8008271000' }]} />
      </TextView>,
    )
    expect(screen.getByText('Call ')).toBeTruthy()
    expect(screen.queryByRole('link')).toBeNull()
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

import React from 'react'

import { screen } from '@testing-library/react-native'

import { InlineContent, StructuredContentBlock } from 'api/types'
import { Box, TextView } from 'components'
import { BlockRenderer } from 'components/StructuredContentRenderer/BlockRenderer'
import { context, render } from 'testUtils'

context('BlockRenderer', () => {
  it('should render paragraph with text content', () => {
    render(<BlockRenderer block={{ type: 'paragraph', content: 'Simple paragraph text' }} />)
    expect(screen.getByText('Simple paragraph text')).toBeTruthy()
  })

  it('should render paragraph with inline bold and italic', () => {
    render(
      <BlockRenderer
        block={{
          type: 'paragraph',
          content: ['Text with ', { type: 'bold', content: 'bold' }, ' and ', { type: 'italic', content: 'italic' }],
        }}
      />,
    )
    expect(screen.getByText('Text with ')).toBeTruthy()
    expect(screen.getByText('bold')).toBeTruthy()
    expect(screen.getByText(' and ')).toBeTruthy()
    expect(screen.getByText('italic')).toBeTruthy()
  })

  it('should extract link from paragraph and render as block-level element', () => {
    render(
      <BlockRenderer
        block={{
          type: 'paragraph',
          content: ['Visit ', { type: 'link' as const, text: 'VA.gov', href: '/test' }],
        }}
      />,
    )
    expect(screen.getByText('Visit ')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'VA.gov' })).toBeTruthy()
  })

  it('should extract telephone from paragraph and render as block-level element', () => {
    render(
      <BlockRenderer
        block={{
          type: 'paragraph',
          content: ['Call us:', { type: 'lineBreak' as const }, { type: 'telephone' as const, contact: '8008271000' }],
        }}
      />,
    )
    expect(screen.getByText('Call us:')).toBeTruthy()
    expect(screen.getByRole('link', { name: '8 0 0 8 2 7 1 0 0 0' })).toBeTruthy()
    expect(screen.getByText('800-827-1000')).toBeTruthy()
  })

  it('should render paragraph with only a link (no text content)', () => {
    render(
      <BlockRenderer
        block={{
          type: 'paragraph',
          content: { type: 'link', text: 'Download form', href: '/form' },
        }}
      />,
    )
    expect(screen.getByRole('link', { name: 'Download form' })).toBeTruthy()
  })

  it('should render bullet list', () => {
    render(
      <BlockRenderer
        block={{
          type: 'list',
          style: 'bullet',
          items: ['Item 1', 'Item 2', 'Item 3'],
        }}
      />,
    )
    expect(screen.getByText('Item 1')).toBeTruthy()
    expect(screen.getByText('Item 2')).toBeTruthy()
    expect(screen.getByText('Item 3')).toBeTruthy()
  })

  it('should render numbered list', () => {
    render(
      <BlockRenderer
        block={{
          type: 'list',
          style: 'numbered',
          items: ['First', 'Second', 'Third'],
        }}
      />,
    )
    expect(screen.getByText('First')).toBeTruthy()
    expect(screen.getByText('Second')).toBeTruthy()
    expect(screen.getByText('Third')).toBeTruthy()
  })

  it('should render list with inline bold in items', () => {
    render(
      <BlockRenderer
        block={{
          type: 'list',
          style: 'bullet',
          items: ['Simple item', ['Item with ', { type: 'bold', content: 'bold text' }]],
        }}
      />,
    )
    expect(screen.getByText('Simple item')).toBeTruthy()
    expect(screen.getByText('Item with ')).toBeTruthy()
    expect(screen.getByText('bold text')).toBeTruthy()
  })

  it('should render list item with link as block-level element', () => {
    render(
      <BlockRenderer
        block={{
          type: 'list',
          style: 'bullet',
          items: ['Text item', { type: 'link', text: 'Link item', href: '/test' }],
        }}
      />,
    )
    expect(screen.getByText('Text item')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Link item' })).toBeTruthy()
  })

  it('should render line break', () => {
    render(
      <Box testID="wrapper">
        <BlockRenderer block={{ type: 'lineBreak' }} />
      </Box>,
    )
    expect(screen.getByTestId('wrapper')).toBeTruthy()
  })

  it('should return null for invalid block', () => {
    render(
      <>
        <BlockRenderer block={{ type: 'unknown' } as unknown as StructuredContentBlock} />
        <TextView testID="sibling">sibling</TextView>
      </>,
    )
    expect(screen.getByTestId('sibling')).toBeTruthy()
    expect(screen.getByText('sibling')).toBeTruthy()
    expect(screen.queryByText('Simple paragraph text')).toBeNull()
  })

  it('should return null for list with empty items array', () => {
    render(
      <>
        <BlockRenderer
          block={{
            type: 'list',
            style: 'bullet',
            items: [],
          }}
        />
        <TextView testID="after">after</TextView>
      </>,
    )
    expect(screen.getByText('after')).toBeTruthy()
    expect(screen.queryByText('Item 1')).toBeNull()
  })

  it('should filter out invalid list items (null, undefined, empty strings)', () => {
    render(
      <BlockRenderer
        block={{
          type: 'list',
          style: 'bullet',
          items: ['Valid item 1', null, '', undefined, '  ', 'Valid item 2'] as InlineContent[],
        }}
      />,
    )
    expect(screen.getByText('Valid item 1')).toBeTruthy()
    expect(screen.getByText('Valid item 2')).toBeTruthy()
    expect(screen.queryByText('  ')).toBeNull()
  })

  it('should keep object/array items for rendering', () => {
    render(
      <BlockRenderer
        block={{
          type: 'list',
          style: 'bullet',
          items: [
            'String item',
            null as unknown as InlineContent,
            { type: 'bold', content: 'Bold object' },
            ['Array ', 'item'],
            '',
          ],
        }}
      />,
    )
    expect(screen.getByText('String item')).toBeTruthy()
    expect(screen.getByText('Bold object')).toBeTruthy()
    expect(screen.getByText('Array ')).toBeTruthy()
    expect(screen.getByText('item')).toBeTruthy()
  })

  it('should filter out empty arrays', () => {
    render(
      <BlockRenderer
        block={{
          type: 'list',
          style: 'bullet',
          items: [
            'Valid string',
            [] as unknown as InlineContent,
            { type: 'bold', content: 'Valid object' },
            ['Valid', ' array'],
          ],
        }}
      />,
    )
    expect(screen.getByText('Valid string')).toBeTruthy()
    expect(screen.getByText('Valid object')).toBeTruthy()
    expect(screen.getByText('Valid')).toBeTruthy()
    expect(screen.getByText(' array')).toBeTruthy()
  })
})

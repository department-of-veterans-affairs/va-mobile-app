import React from 'react'

import { screen } from '@testing-library/react-native'

import { StructuredContent } from 'api/types'
import StructuredContentRenderer from 'components/StructuredContentRenderer'
import { context, render } from 'testUtils'

const contentWithLink: StructuredContent = {
  blocks: [
    {
      type: 'paragraph',
      content: [
        'Visit ',
        { type: 'link' as const, text: 'VA Form 21-4142', href: 'https://www.va.gov/find-forms/about-form-21-4142/' },
      ],
    },
  ],
}

context('StructuredContentRenderer', () => {
  it('should render content with multiple blocks', () => {
    render(
      <StructuredContentRenderer
        content={{
          blocks: [
            { type: 'paragraph', content: 'First paragraph' },
            { type: 'paragraph', content: 'Second paragraph' },
          ],
        }}
        testID="structured"
      />,
    )
    expect(screen.getByText('First')).toBeTruthy()
    expect(screen.getByText('Second')).toBeTruthy()
    expect(screen.getAllByText('paragraph')).toHaveLength(2)
  })

  it('should render paragraph and list blocks', () => {
    render(
      <StructuredContentRenderer
        content={{
          blocks: [
            { type: 'paragraph', content: 'Here is a list:' },
            {
              type: 'list',
              style: 'bullet',
              items: ['Item 1', 'Item 2'],
            },
          ],
        }}
        testID="structured"
      />,
    )
    expect(screen.getByText('Here')).toBeTruthy()
    expect(screen.getByText('list:')).toBeTruthy()
    expect(screen.getAllByText('Item')).toHaveLength(2)
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText('2')).toBeTruthy()
  })

  it('should render content with links', () => {
    render(<StructuredContentRenderer content={contentWithLink} testID="structured" />)
    expect(screen.getByText('Visit')).toBeTruthy()
    const link = screen.getByRole('link', { name: 'VA Form 21-4142' })
    expect(link).toBeTruthy()
    expect(screen.getByText('VA')).toBeTruthy()
    expect(screen.getByText('Form')).toBeTruthy()
    expect(screen.getByText('21-4142')).toBeTruthy()
  })

  it('should render content with telephone numbers', () => {
    const content: StructuredContent = {
      blocks: [
        {
          type: 'paragraph',
          content: [
            'Call us at ',
            { type: 'telephone' as const, contact: '8008271000' },
            ' or TTY ',
            { type: 'telephone' as const, contact: '711', tty: true },
          ],
        },
      ],
    }
    render(<StructuredContentRenderer content={content} testID="structured" />)
    expect(screen.getByText('Call')).toBeTruthy()
    expect(screen.getByText('us')).toBeTruthy()
    expect(screen.getByText('at')).toBeTruthy()
    expect(screen.getByText('or')).toBeTruthy()
    expect(screen.getByText('TTY')).toBeTruthy()
    expect(screen.getByRole('link', { name: '8 0 0 8 2 7 1 0 0 0' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '7 1 1' })).toBeTruthy()
  })

  it('should render real-world content structure', () => {
    const content: StructuredContent = {
      blocks: [
        {
          type: 'paragraph',
          content:
            'For your benefits claim, we need your permission to request your personal information from a non-VA source, like a private doctor or hospital.',
        },
        {
          type: 'paragraph',
          content: 'Personal information may include:',
        },
        {
          type: 'list',
          style: 'bullet',
          items: ['Medical treatments', 'Hospitalizations', 'Psychotherapy', 'Outpatient care'],
        },
      ],
    }
    render(<StructuredContentRenderer content={content} testID="structured" />)
    expect(screen.getByText('For')).toBeTruthy()
    expect(screen.getByText('benefits')).toBeTruthy()
    expect(screen.getByText('claim,')).toBeTruthy()
    expect(screen.getByText('Personal')).toBeTruthy()
    expect(screen.getAllByText('information').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Medical')).toBeTruthy()
    expect(screen.getByText('treatments')).toBeTruthy()
    expect(screen.getByText('Hospitalizations')).toBeTruthy()
    expect(screen.getByText('Psychotherapy')).toBeTruthy()
    expect(screen.getByText('Outpatient')).toBeTruthy()
    expect(screen.getByText('care')).toBeTruthy()
  })

  it('should return null for invalid content', () => {
    render(<StructuredContentRenderer content={null} testID="structured" />)
    expect(screen.queryByTestId('structured')).toBeNull()
  })

  it('should return null for undefined content', () => {
    render(<StructuredContentRenderer content={undefined} testID="structured" />)
    expect(screen.queryByTestId('structured')).toBeNull()
  })

  it('should return null when blocks array is empty', () => {
    render(<StructuredContentRenderer content={{ blocks: [] }} testID="structured" />)
    expect(screen.queryByTestId('structured')).toBeNull()
  })
})

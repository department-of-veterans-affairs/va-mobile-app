import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

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
    expect(screen.getByText('First paragraph')).toBeTruthy()
    expect(screen.getByText('Second paragraph')).toBeTruthy()
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
    expect(screen.getByText('Here is a list:')).toBeTruthy()
    expect(screen.getByText('Item 1')).toBeTruthy()
    expect(screen.getByText('Item 2')).toBeTruthy()
  })

  it('should render content with links', () => {
    render(<StructuredContentRenderer content={contentWithLink} testID="structured" />)
    expect(screen.getByText('Visit ')).toBeTruthy()
    expect(screen.getByText('VA Form 21-4142')).toBeTruthy()
    const link = screen.getByRole('link', { name: 'VA Form 21-4142' })
    expect(link).toBeTruthy()
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
    expect(screen.getByText('Call us at ')).toBeTruthy()
    expect(screen.getByText(' or TTY ')).toBeTruthy()
    expect(screen.getByRole('link', { name: '8008271000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '711' })).toBeTruthy()
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
    expect(
      screen.getByText(
        'For your benefits claim, we need your permission to request your personal information from a non-VA source, like a private doctor or hospital.',
      ),
    ).toBeTruthy()
    expect(screen.getByText('Personal information may include:')).toBeTruthy()
    expect(screen.getByText('Medical treatments')).toBeTruthy()
    expect(screen.getByText('Hospitalizations')).toBeTruthy()
    expect(screen.getByText('Psychotherapy')).toBeTruthy()
    expect(screen.getByText('Outpatient care')).toBeTruthy()
  })

  it('should return null for invalid content', () => {
    render(<StructuredContentRenderer content={null} testID="structured" />)
    expect(screen.queryByTestId('structured')).toBeNull()
  })

  it('should return null for undefined content', () => {
    render(<StructuredContentRenderer content={undefined} testID="structured" />)
    expect(screen.queryByTestId('structured')).toBeNull()
  })

  it('should render container with no blocks when blocks array is empty', () => {
    render(<StructuredContentRenderer content={{ blocks: [] }} testID="structured" />)
    expect(screen.getByTestId('structured')).toBeTruthy()
    expect(screen.queryByText('First paragraph')).toBeNull()
  })

  it('should open link on press', () => {
    render(<StructuredContentRenderer content={contentWithLink} testID="structured" />)
    const link = screen.getByRole('link', { name: 'VA Form 21-4142' })
    fireEvent.press(link)
  })
})

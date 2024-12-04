import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { InlineTextWithIconsProps, MessageListItemObj, TextLine } from 'components'
import { context, render } from 'testUtils'

import MessageList from './MessageList'

context('MessageList', () => {
  const onPressSpy = jest.fn(() => {})

  beforeEach(() => {
    const items = [
      {
        inlineTextWithIcons: [
          {
            leftTextProps: { text: 'another line' },
          },
          {
            leftTextProps: { text: 'another line 2' },
          },
        ],
        isSentFolder: false,
        testId: 'inbox-item-no-attachment-read',
        a11yHintText: 'hint2',
        onPress: onPressSpy,
      },
      {
        inlineTextWithIcons: [
          {
            leftTextProps: { text: 'test2-sender' },
            leftIconProps: { name: 'Unread', width: 16, height: 16, testID: 'Unread' },
          },
          {
            leftTextProps: { text: 'test2-subject-line' },
            leftIconProps: { name: 'Trash', width: 16, height: 16, testID: 'Trash' },
          },
        ],
        isSentFolder: false,
        a11yHintText: 'hint2',
        onPress: onPressSpy,
      },
      {
        inlineTextWithIcons: [
          {
            leftTextProps: { text: 'test3-recipient' } as TextLine,
          } as InlineTextWithIconsProps,
          {
            leftTextProps: { text: 'test3-sent-item-with-read-tag' } as TextLine,
          } as InlineTextWithIconsProps,
        ],
        isSentFolder: true,
        readReceipt: 'READ',
        a11yHintText: 'hint2',
        onPress: onPressSpy,
      },
    ] as Array<MessageListItemObj>

    render(<MessageList items={items} />)
  })

  it('should call onPress when one of the buttons has been clicked', () => {
    fireEvent.press(screen.getByRole('link', { name: 'another line' }))
    expect(onPressSpy).toBeCalled()
  })

  it('should generate correct testId with icon accessibility labels if no testId provided in props', () => {
    expect(screen.getByTestId('Unread: test2-sender Has attachment test2-subject-line')).toBeTruthy()
    expect(
      screen.getByTestId('test3-recipient test3-sent-item-with-read-tag Recipient has read your message'),
    ).toBeTruthy()
  })

  it('should render Read tag for read sent message', () => {
    expect(screen.findByText('Read')).toBeTruthy()
  })

  it('should render the VAIcon components for unread item with attachment', () => {
    expect(screen.getByTestId('Unread')).toBeTruthy()
    expect(screen.getByTestId('Trash')).toBeTruthy()
  })

  it('should render chevron icons', () => {
    expect(screen.getAllByTestId('ChevronRight')).toHaveLength(3)
  })
})

import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, findByTestID, render, RenderAPI } from 'testUtils'
import MessageList from './MessageList'
import VAIcon, { VAIconProps } from './VAIcon'
import LabelTag from './LabelTag'
import { MessageListItemObj, InlineTextWithIconsProps, TextLine } from 'components'

context('MessageList', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})
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
        inlineTextWithIcons:
          [
            {
              leftTextProps: { text: 'test2-sender' },
              leftIconProps: { name: 'Unread', width: 16, height: 16 }
            },
            {
              leftTextProps: { text: 'test2-subject-line' },
              leftIconProps: { name: 'PaperClip', width: 16, height: 16 }
            }
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

    component = render(<MessageList items={items} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onPress when one of the buttons has been clicked', async () => {
    findByTestID(testInstance, 'inbox-item-no-attachment-read').props.onPress()
    expect(onPressSpy).toBeCalled()
  })

  it('should generate correct testId with icon accessibility labels if no testId provided in props', async () => {
    findByTestID(testInstance, 'Unread: test2-sender Has attachment test2-subject-line').props.onPress()
    findByTestID(testInstance, 'test3-recipient test3-sent-item-with-read-tag Recipient has read your message').props.onPress()
  })

  it('should render Read tag for read sent message', async () => {
    expect(testInstance.findByType(LabelTag).props.text).toEqual('Read')
  })

  it('should render the VAIcon components for unread item with attachment', async () => {
    expect(testInstance.findAllByType(VAIcon)[0].props.name).toEqual('Unread')
    expect(testInstance.findAllByType(VAIcon)[1].props.name).toEqual('PaperClip')
  })
})

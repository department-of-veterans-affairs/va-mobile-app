import React, { FC } from 'react'

import LinkWithAnalytics from './LinkWithAnalytics'

export type AttachmentLinkProps = {
  /** Name of link/attachment */
  name: string
  /** Size of file attachment and size unit wrapped in parentheses */
  formattedSize?: string
  /** Size of file attachment and size unit wrapped in parentheses with pronounciation */
  formattedSizeA11y?: string
  /** onPress function */
  onPress: () => void
  /** optional a11y Hint */
  a11yHint?: string
  /** optional a11y value */
  a11yValue?: string
}

/**
 * A common component for an attachment link display. Can be used to show file attachments in a message thread.
 */
const AttachmentLink: FC<AttachmentLinkProps> = ({
  name,
  formattedSize,
  formattedSizeA11y,
  onPress,
  a11yHint,
  a11yValue,
}) => {
  const text = [name, formattedSize].join(' ').trim()
  const textA11y = [name, formattedSizeA11y].join(' ').trim()

  return (
    <LinkWithAnalytics
      type="attachment"
      text={text}
      onPress={onPress}
      a11yLabel={textA11y}
      a11yHint={a11yHint}
      a11yValue={a11yValue}
    />
  )
}
export default AttachmentLink

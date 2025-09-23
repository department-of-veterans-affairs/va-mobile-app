import React, { FC } from 'react'

import { Box, TextArea, TextView } from 'components'
import ClickToCallPhoneNumber from 'components/ClickToCallPhoneNumber'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

export type EmptyStateMessageProps = {
  /** Bold header text */
  title: string
  /** Body copy below the header */
  body: string
  /** Phone number digits only (e.g., "8664001238") */
  phone: string
}

/** Generic empty-state message with header, body, and click-to-call */
const EmptyStateMessage: FC<EmptyStateMessageProps> = ({ title, body, phone }) => {
  return (
    <Box>
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {title}
        </TextView>

        <TextView mt={20} mb={20}>
          {body}
        </TextView>

        <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(phone)} phone={phone} />
      </TextArea>
    </Box>
  )
}

export default EmptyStateMessage

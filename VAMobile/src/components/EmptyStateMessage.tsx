import React, { FC } from 'react'

import { Box, TextArea, TextView } from 'components'
import ClickToCallPhoneNumber from 'components/ClickToCallPhoneNumber'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

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
  const theme = useTheme()
  return (
    <Box>
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {title}
        </TextView>

        <TextView mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.standardMarginBetween}>
          {body}
        </TextView>

        <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(phone)} phone={phone} />
      </TextArea>
    </Box>
  )
}

export default EmptyStateMessage

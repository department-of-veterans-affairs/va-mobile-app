import React, { FC } from 'react'

import { t } from 'i18next'

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
  /** Show international number */
  internationalPhone?: boolean
}

/** Generic empty-state message with header, body, and click-to-call */
const EmptyStateMessage: FC<EmptyStateMessageProps> = ({ title, body, phone, internationalPhone = false }) => {
  const theme = useTheme()
  return (
    <Box>
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {title}
        </TextView>

        <TextView my={theme.dimensions.standardMarginBetween}>{body}</TextView>

        <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(phone)} phone={phone} />

        {internationalPhone ? (
          <>
            <TextView my={theme.dimensions.condensedMarginBetween} variant="MobileBody">
              {t('debts.help.questions.body.2')}
            </TextView>
            <ClickToCallPhoneNumber
              phone={t('16127136415')}
              displayedText={displayedTextPhoneNumber(t('16127136415'))}
              ttyBypass={true}
            />
          </>
        ) : null}
      </TextArea>
    </Box>
  )
}

export default EmptyStateMessage

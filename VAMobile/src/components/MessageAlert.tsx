import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, RefObject } from 'react'

import { AlertBox, Box } from './index'
import { NAMESPACE } from 'constants/namespaces'

import { useTheme } from 'utils/hooks'

export type MessageAlertProps = {
  /** Optional boolean for determining when to focus on error alert boxes. */
  focusOnError?: boolean
  /**sets if there is validation errors */
  hasValidationError?: boolean
  /**sets if attempted to save a draft */
  saveDraftAttempted?: boolean
  /** optional ref for parent scroll view */
  scrollViewRef?: RefObject<ScrollView>
}

/**Common component to show a message alert when saving or sending a secure message */
const MessageAlert: FC<MessageAlertProps> = ({ hasValidationError, saveDraftAttempted, scrollViewRef, focusOnError }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)

  let title
  let text

  if (hasValidationError) {
    title = saveDraftAttempted ? t('secureMessaging.formMessage.saveDraft.validation.title') : t('secureMessaging.formMessage.checkYourMessage')
    text = saveDraftAttempted ? t('secureMessaging.formMessage.saveDraft.validation.text') : undefined
  } else {
    return null
  }

  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertBox border={'error'} title={title} text={text} titleRole={'header'} scrollViewRef={scrollViewRef} focusOnError={focusOnError} />
    </Box>
  )
}
export default MessageAlert

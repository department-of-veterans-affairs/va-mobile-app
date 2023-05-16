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
  errorList?: { [key: number]: string }
}

/**Common component to show a message alert when saving or sending a secure message */
const MessageAlert: FC<MessageAlertProps> = ({ hasValidationError, saveDraftAttempted, scrollViewRef, focusOnError, errorList }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)

  let title
  let text

  let errorString = ''
  if (errorList) {
    for (const key in errorList) {
      errorString += `• ${errorList[key as unknown as number]}\n`
    }
  }

  if (hasValidationError) {
    title = saveDraftAttempted ? t('secureMessaging.formMessage.saveDraft.validation.title') : t('secureMessaging.formMessage.checkYourMessage')
    text = saveDraftAttempted ? `${t('secureMessaging.formMessage.saveDraft.validation.text')}${errorString}` : errorString
  } else {
    return null
  }

  errorList && console.log(errorList)

  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertBox border={'error'} title={title} text={text} titleRole={'header'} scrollViewRef={scrollViewRef} focusOnError={focusOnError} />
    </Box>
  )
}
export default MessageAlert

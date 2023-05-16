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

  let errorString = '\n'
  if (errorList) {
    for (const key in errorList) {
      if (errorList[key] !== '') {
        errorString += `\n• ${errorList[key as unknown as number]}`
      }
    }
  }

  const text = saveDraftAttempted
    ? `${t('secureMessaging.formMessage.saveDraft.validation.text')}${errorString}`
    : `${t('secureMessaging.formMessage.sendMessage.validation.text')}${errorString}`

  return hasValidationError ? (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertBox
        border={'error'}
        title={t('secureMessaging.formMessage.weNeedMoreInfo')}
        text={text}
        titleRole={'header'}
        scrollViewRef={scrollViewRef}
        focusOnError={focusOnError}
      />
    </Box>
  ) : (
    <></>
  )
}
export default MessageAlert

import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, RefObject } from 'react'

import { AlertBox, Box } from './index'
import { LoadingComponent } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

export type MessageAlertProps = {
  /** Optional boolean for determining when to focus on error alert boxes. */
  focusOnError?: boolean
  /**sets if there is validation errors */
  hasValidationError?: boolean
  /**sets if attempted to save a draft */
  saveDraftAttempted?: boolean
  /**sets that the draft is being saved*/
  savingDraft?: boolean
  /** optional ref for parent scroll view */
  scrollViewRef?: RefObject<ScrollView>
}

/**Common component to show a message alert when saving or sending a secure message */
const MessageAlert: FC<MessageAlertProps> = ({ hasValidationError, saveDraftAttempted, savingDraft, scrollViewRef, focusOnError }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)

  let title
  let text
  let textA11yLabel

  if (savingDraft) {
    return <LoadingComponent text={t('secureMessaging.formMessage.saveDraft.loading')} />
  } else if (hasValidationError) {
    title = saveDraftAttempted ? t('secureMessaging.formMessage.saveDraft.validation.title') : t('secureMessaging.formMessage.checkYourMessage')
    text = saveDraftAttempted ? t('secureMessaging.formMessage.saveDraft.validation.text') : undefined
  } else {
    return null
  }

  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertBox border={'error'} title={title} text={text} textA11yLabel={textA11yLabel} titleRole={'header'} scrollViewRef={scrollViewRef} focusOnError={focusOnError} />
    </Box>
  )
}
export default MessageAlert

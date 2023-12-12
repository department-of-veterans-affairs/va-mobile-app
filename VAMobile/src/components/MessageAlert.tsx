import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, RefObject } from 'react'

import { AlertBox, Box, ButtonTypesConstants, TextView, VABulletList, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { SecureMessagingState, resetReplyTriageError, resetSendMessageFailed } from 'store/slices'
import { SegmentedControlIndexes } from 'constants/secureMessaging'
import { updateSecureMessagingTab } from 'store/slices'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

export type MessageAlertProps = {
  /** Optional boolean for determining when to focus on error alert boxes. */
  focusOnError?: boolean
  /**sets if there is validation errors */
  hasValidationError?: boolean
  /**sets if attempted to save a draft */
  saveDraftAttempted?: boolean
  /** optional ref for parent scroll view */
  scrollViewRef?: RefObject<ScrollView>
  /** optional list of alertbox failed reasons, supplied by FormWrapper component */
  errorList?: { [key: number]: string }
}

/**Common component to show a message alert when saving or sending a secure message */
const MessageAlert: FC<MessageAlertProps> = ({ hasValidationError, saveDraftAttempted, scrollViewRef, focusOnError, errorList }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { replyTriageError } = useSelector<RootState, SecureMessagingState>((state) => state.secureMessaging)
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()

  const onGoToInbox = (): void => {
    dispatch(resetSendMessageFailed())
    dispatch(updateSecureMessagingTab(SegmentedControlIndexes.INBOX))
    dispatch(resetReplyTriageError())
    navigateTo('SecureMessaging')()
  }

  const bulletedListOfText = []
  if (errorList) {
    for (const key in errorList) {
      if (errorList[key] !== '') {
        bulletedListOfText.push(`${errorList[key]}`)
      }
    }
  }

  const text = saveDraftAttempted ? t('secureMessaging.formMessage.saveDraft.validation.text') : t('secureMessaging.formMessage.sendMessage.validation.text')

  return hasValidationError ? (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertBox border={'error'} title={t('secureMessaging.formMessage.weNeedMoreInfo')} text={text} titleRole={'header'} scrollViewRef={scrollViewRef} focusOnError={focusOnError}>
        <VABulletList listOfText={bulletedListOfText} />
      </AlertBox>
    </Box>
  ) : replyTriageError ? (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertBox border={'error'} title={t('secureMessaging.sendError.title')} titleRole={'header'} scrollViewRef={scrollViewRef} focusOnError={focusOnError}>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('secureMessaging.reply.error.youCantSend')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('secureMessaging.reply.error.ifYouThinkA11y')}>
          {t('secureMessaging.reply.error.ifYouThink')}
        </TextView>
        <VAButton label={t('secureMessaging.goToInbox')} onPress={onGoToInbox} buttonType={ButtonTypesConstants.buttonPrimary} />
      </AlertBox>
    </Box>
  ) : (
    <></>
  )
}
export default MessageAlert

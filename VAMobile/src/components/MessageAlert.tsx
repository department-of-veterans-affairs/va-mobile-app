import React, { FC, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { AlertWithScroll, Box, LinkWithAnalytics, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTheme } from 'utils/hooks'

export type MessageAlertProps = {
  /** ref for parent scroll view */
  scrollViewRef: RefObject<ScrollView>
  /** Optional boolean indicating when Alert is focused. Default is true */
  isFocused?: boolean
  /**sets if there is validation errors */
  hasValidationError?: boolean
  /**sets if attempted to save a draft */
  saveDraftAttempted?: boolean
  /** optional list of alertbox failed reasons, supplied by FormWrapper component */
  errorList?: { [key: number]: string }
  /** sets if triage error returned from api */
  replyTriageError?: boolean
}

/**Common component to show a message alert when saving or sending a secure message */
const MessageAlert: FC<MessageAlertProps> = ({
  hasValidationError,
  saveDraftAttempted,
  scrollViewRef,
  isFocused = true,
  errorList,
  replyTriageError,
}) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const onGoToInbox = (): void => {
    navigateTo('SecureMessaging', { activeTab: 0 })
  }

  const bulletedListOfText = []
  if (errorList) {
    for (const key in errorList) {
      if (errorList[key] !== '') {
        bulletedListOfText.push(`${errorList[key]}`)
      }
    }
  }

  const text = saveDraftAttempted
    ? t('secureMessaging.formMessage.saveDraft.validation.text')
    : t('secureMessaging.formMessage.sendMessage.validation.text')

  return hasValidationError ? (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertWithScroll
        variant="error"
        header={t('secureMessaging.formMessage.weNeedMoreInfo')}
        description={text}
        scrollViewRef={scrollViewRef}
        isFocused={isFocused}>
        <VABulletList listOfText={bulletedListOfText} />
      </AlertWithScroll>
    </Box>
  ) : replyTriageError ? (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertWithScroll
        variant="error"
        header={t('secureMessaging.sendError.title')}
        scrollViewRef={scrollViewRef}
        isFocused={isFocused}>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('secureMessaging.reply.error.youCantSend')}
        </TextView>
        <TextView
          variant="MobileBody"
          paragraphSpacing={true}
          accessibilityLabel={t('secureMessaging.reply.error.ifYouThinkA11y')}>
          {t('secureMessaging.reply.error.ifYouThink')}
        </TextView>
        <LinkWithAnalytics type="custom" text={t('secureMessaging.goToInbox')} onPress={onGoToInbox} />
      </AlertWithScroll>
    </Box>
  ) : (
    <></>
  )
}
export default MessageAlert

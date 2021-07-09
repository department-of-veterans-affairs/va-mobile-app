import React, { FC } from 'react'

import { AlertBox, Box } from './index'
import { ClickToCallPhoneNumber, LoadingComponent } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

export type MessageAlertProps = {
  hasValidationError?: boolean
  saveDraftAttempted?: boolean
  saveDraftComplete?: boolean
  saveDraftFailed?: boolean
  savingDraft?: boolean
  sendMessageFailed: boolean
}

const MessageAlert: FC<MessageAlertProps> = ({ hasValidationError, saveDraftAttempted, saveDraftComplete, saveDraftFailed, savingDraft, sendMessageFailed }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const th = useTranslation(NAMESPACE.HOME)

  let title
  let text
  let textA11yLabel

  if (savingDraft) {
    return <LoadingComponent text={t('secureMessaging.formMessage.saveDraft.loading')} />
  } else if (hasValidationError) {
    title = saveDraftAttempted ? t('secureMessaging.formMessage.saveDraft.validation.title') : t('secureMessaging.formMessage.checkYourMessage')
    text = saveDraftAttempted ? t('secureMessaging.formMessage.saveDraft.validation.text') : undefined
  } else if (sendMessageFailed) {
    title = t('secureMessaging.sendError.title')
    text = t('secureMessaging.sendError.ifTheAppStill')
    textA11yLabel = t('secureMessaging.sendError.ifTheAppStill.a11y')
  } else if (saveDraftFailed) {
    title = t('secureMessaging.formMessage.saveDraft.failed.title')
    text = t(t('secureMessaging.formMessage.saveDraft.failed.text'))
  } else if (saveDraftComplete) {
    title = t('secureMessaging.formMessage.saveDraft.success.title')
    text = t(t('secureMessaging.formMessage.saveDraft.success.text'))
  } else {
    return null
  }

  return (
    <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
      <AlertBox border={saveDraftComplete ? 'success' : 'error'} background="noCardBackground" title={title} text={text} textA11yLabel={textA11yLabel}>
        {sendMessageFailed && <ClickToCallPhoneNumber phone={t('secureMessaging.attachments.FAQ.ifYourProblem.phone')} {...a11yHintProp(th('veteransCrisisLine.callA11yHint'))} />}
      </AlertBox>
    </Box>
  )
}
export default MessageAlert

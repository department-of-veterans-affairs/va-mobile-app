import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, VAButton, VAButtonProps } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { waygateNativeAlert } from 'utils/waygateConfig'

const StartNewMessageButton: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  const onPress = () => {
    logAnalyticsEvent(Events.vama_sm_start())
    waygateNativeAlert('WG_StartNewMessage') && navigateTo('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })()
  }

  const startNewMessageButtonProps: VAButtonProps = {
    label: t('secureMessaging.startNewMessage'),
    buttonType: ButtonTypesConstants.buttonPrimary,
    onPress: onPress,
    iconProps: { name: 'Compose', fill: 'navBar' },
    testID: 'startNewMessageButtonTestID',
  }

  return (
    <Box mx={theme.dimensions.buttonPadding}>
      <VAButton {...startNewMessageButtonProps} />
    </Box>
  )
}

export default StartNewMessageButton

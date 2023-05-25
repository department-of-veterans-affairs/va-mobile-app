import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, VAButton, VAButtonProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const StartNewMessageButton: FC = () => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const onPress = navigateTo('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })

  const startNewMessageButtonProps: VAButtonProps = {
    label: t('secureMessaging.startNewMessage'),
    buttonType: ButtonTypesConstants.buttonPrimary,
    onPress: onPress,
    a11yHint: t('secureMessaging.startNewMessage.a11yHint'),
    iconProps: { name: 'Compose', fill: 'navBar' },
  }

  return (
    <Box mx={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding}>
      <VAButton {...startNewMessageButtonProps} />
    </Box>
  )
}

export default StartNewMessageButton

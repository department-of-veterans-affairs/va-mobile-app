import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, VAButton, VAButtonProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const ComposeMessageButton: FC = () => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const onPress = navigateTo('ComposeMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })

  const requestRefillButtonProps: VAButtonProps = {
    label: t('secureMessaging.composeMessage'),
    buttonType: ButtonTypesConstants.buttonPrimary,
    onPress: onPress,
    a11yHint: t('secureMessaging.composeMessage.a11yHint'),
    iconProps: { name: 'Compose' },
  }

  return (
    <Box mx={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding}>
      <VAButton {...requestRefillButtonProps} />
    </Box>
  )
}

export default ComposeMessageButton

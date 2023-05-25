import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, VAButton, VAButtonProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { useRouteNavigation } from 'utils/hooks'
import { useTheme } from 'styled-components'

const ComposeMessageButton: FC = () => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()
  const theme = useTheme() as VATheme
  const onPress = navigateTo('ComposeMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })

  const composeMessageButtonProps: VAButtonProps = {
    label: t('secureMessaging.composeMessage'),
    buttonType: ButtonTypesConstants.buttonPrimary,
    onPress: onPress,
    a11yHint: t('secureMessaging.composeMessage.a11yHint'),
    iconProps: { name: 'Compose', fill: 'navBar' },
  }

  return (
    <Box mx={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding}>
      <VAButton {...composeMessageButtonProps} />
    </Box>
  )
}

export default ComposeMessageButton

import React, { FC } from 'react'

import { Box, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const NoFolderMessages: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  return (
    <VAScrollView>
      <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
        <Box accessible={true}>
          <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
            {"You don't have any messages in your folder"}
          </TextView>
        </Box>
        <Box accessible={true}>
          <VAButton buttonType={'buttonPrimary'} label={'Go to Inbox'} onPress={() => {}} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default NoFolderMessages

import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, BoxProps, TextView } from 'components/index'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type ContentUnavailableCardProps = {
  textId: string
}
const ContentUnavailableCard: FC<ContentUnavailableCardProps> = ({ textId }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const boxProps: BoxProps = {
    borderStyle: 'solid',
    borderWidth: 'default',
    borderColor: 'primary',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    p: theme.dimensions.standardMarginBetween * 2,
  }

  return (
    <Box {...boxProps}>
      <TextView color="placeholder" textAlign="center">
        {t(textId)}
      </TextView>
    </Box>
  )
}

export default ContentUnavailableCard

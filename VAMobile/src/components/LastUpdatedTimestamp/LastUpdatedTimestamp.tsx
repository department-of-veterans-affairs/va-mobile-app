import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { formatEpochReadable } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type LastUpdatedTimestampProps = {
  datetime?: number
}

const LastUpdatedTimestamp: FC<LastUpdatedTimestampProps> = ({ datetime }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  // Do not render anything if a timestamp is not available
  if (!datetime) return null

  return (
    <Box alignItems="center" my={theme.dimensions.gutter} testID="last-updated-timestamp">
      <TextView variant="HelperText" color={theme.colors.text.lastUpdated}>
        {t('lastUpdatedTimestamp', { timestamp: `${formatEpochReadable(datetime / 1000)}` })}
      </TextView>
    </Box>
  )
}

export default LastUpdatedTimestamp

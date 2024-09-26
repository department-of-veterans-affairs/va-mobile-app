import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, List, ListItemObj, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

function FileOnlineComponent() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const bullets: Array<ListItemObj> = [
    {
      content: <TextView variant="MobileBody">{t('travelPay.youCanStillFile.bulletOne')}</TextView>,
      a11yHintText: t('travelPay.youCanStillFile.bulletOne'),
    },
    {
      content: <TextView variant="MobileBody">{t('travelPay.youCanStillFile.bulletTwo')}</TextView>,
      a11yHintText: t('travelPay.youCanStillFile.bulletTwo'),
    },
  ]

  return (
    <>
      <TextView mt={theme.dimensions.standardMarginBetween} variant="MobileBody">
        {t('travelPay.youCanStillFile')}
      </TextView>
      <Box mt={theme.dimensions.standardMarginBetween}>
        <List items={bullets} />
      </Box>
    </>
  )
}

export default FileOnlineComponent

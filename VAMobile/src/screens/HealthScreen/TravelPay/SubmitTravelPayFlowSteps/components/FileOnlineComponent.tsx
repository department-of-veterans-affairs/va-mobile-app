import React from 'react'
import { useTranslation } from 'react-i18next'

import { List, ListItemObj, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

function FileOnlineComponent() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const bullets: Array<ListItemObj> = [
    {
      content: <TextView> {t('travelPay.youCanStillFile.bulletOne')}</TextView>,
      a11yHintText: t('travelPay.youCanStillFile.bulletOne'),
    },
    {
      content: <TextView> {t('travelPay.youCanStillFile.bulletTwo')}</TextView>,
      a11yHintText: t('travelPay.youCanStillFile.bulletTwo'),
    },
  ]

  return (
    <>
      <TextView mt={theme.dimensions.standardMarginBetween} variant="MobileBody">
        {t('travelPay.youCanStillFile')}
      </TextView>
      <List items={bullets} />
    </>
  )
}

export default FileOnlineComponent

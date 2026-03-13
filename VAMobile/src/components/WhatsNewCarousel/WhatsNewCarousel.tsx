import React from 'react'
import { useTranslation } from 'react-i18next'

import { useWhatsNewToDisplay } from 'components/WhatsNewCarousel/utils'
import { RealCarousel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

const WhatsNewCarousel = () => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const whatsNewDisplay = useWhatsNewToDisplay()

  if (!whatsNewDisplay.length) {
    return null
  }

  return (
    <>
      <TextView mx={theme.dimensions.gutter} variant="HomeScreenHeader" accessibilityRole="header">
        {t('whatsNew.title')}
      </TextView>
      <RealCarousel data={whatsNewDisplay} />
    </>
  )
}

export default WhatsNewCarousel

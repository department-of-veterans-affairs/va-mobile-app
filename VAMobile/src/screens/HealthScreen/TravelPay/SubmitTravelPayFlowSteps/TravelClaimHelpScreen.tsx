import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LargePanel, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

import { FileOnlineComponent, TravelPayHelp } from './components'

function TravelClaimHelpScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel
      title={t('travelPay.help.title')}
      rightButtonText={t('close')}
      children={
        <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          <TextView variant="MobileBodyBold">{t('travelPay.help.useThisApp')}</TextView>
          <TextView variant="MobileBody">{t('travelPay.help.youCanStillFile')}</TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList
              listOfText={[
                t('travelPay.help.youCanStillFile.bulletOne'),
                t('travelPay.help.youCanStillFile.bulletTwo'),
                t('travelPay.help.youCanStillFile.bulletThree'),
              ]}
            />
          </Box>
          <FileOnlineComponent />
          <TravelPayHelp />
        </Box>
      }
    />
  )
}

export default TravelClaimHelpScreen

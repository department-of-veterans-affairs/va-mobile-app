import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, LargePanel, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TravelPayStack } from 'screens/HealthScreen/TravelPay/SubmitMileageTravelPayScreen'
import { FileOnlineComponent, TravelPayHelp } from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/components'
import { useTheme } from 'utils/hooks'

type TravelClaimHelpScreenProps = StackScreenProps<TravelPayStack, 'TravelClaimHelpScreen'>

function TravelClaimHelpScreen({ route }: TravelClaimHelpScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  // Check if navigated from claim details screen
  const fromClaimDetails = route.params?.fromClaimDetails || false

  return (
    <LargePanel
      title={t('travelPay.help.title')}
      rightButtonText={t('close')}
      testID="travelClaimHelpScreenID"
      rightButtonTestID="rightCloseTestID"
      children={
        <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          {!fromClaimDetails && (
            <>
              <TextView testID="travelClaimHelpTitleID" variant="MobileBodyBold">
                {t('travelPay.help.useThisApp')}
              </TextView>
              <TextView testID="travelClaimHelpTextID" variant="MobileBody">
                {t('travelPay.help.youCanStillFile')}
              </TextView>
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
            </>
          )}
          <TravelPayHelp />
        </Box>
      }
    />
  )
}

export default TravelClaimHelpScreen

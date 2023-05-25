import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, LargePanel, TextView } from 'components'
import { HealthStackParamList } from '../../../HealthStackScreens'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'

import { useTheme } from 'utils/hooks'

type PrepareForVideoVisitProps = StackScreenProps<HealthStackParamList, 'PrepareForVideoVisit'>

const PrepareForVideoVisit: FC<PrepareForVideoVisitProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('prepareForVideoVisit.title')} accessibilityRole="header">
          {t('prepareForVideoVisit.title')}
        </HiddenTitle>
      ),
    })
  })

  return (
    <LargePanel title={tc('appointmentsHelp')} rightButtonText={tc('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter} mt={theme.dimensions.cardPadding}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('prepareForVideoVisit.beforeYourAppointment')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.downloadBasedOnDevice')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.cameraAndMicrophone')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.joinBy')}
        </TextView>

        <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.toHaveBestExperience')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.connectFromQuietPlace')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.checkConnection')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.connectWithWifi')}
        </TextView>

        <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.medicationReview')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.reviewEverything')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.beReadyToTalk')}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default PrepareForVideoVisit

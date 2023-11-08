import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, LargePanel, TextView } from 'components'
import { HealthStackParamList } from '../../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type PrepareForVideoVisitProps = StackScreenProps<HealthStackParamList, 'PrepareForVideoVisit'>

const PrepareForVideoVisit: FC<PrepareForVideoVisitProps> = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel title={t('appointmentsHelp')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('prepareForVideoVisit.beforeYourAppointment')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
          {t('prepareForVideoVisit.downloadBasedOnDevice')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('prepareForVideoVisit.cameraAndMicrophone')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('prepareForVideoVisit.joinBy')}
        </TextView>

        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('prepareForVideoVisit.toHaveBestExperience')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
          {t('prepareForVideoVisit.connectFromQuietPlace')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('prepareForVideoVisit.checkConnection')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('prepareForVideoVisit.connectWithWifi')}
        </TextView>

        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('prepareForVideoVisit.medicationReview')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
          {t('prepareForVideoVisit.reviewEverything')}
        </TextView>
        <TextView variant="MobileBody">{t('prepareForVideoVisit.beReadyToTalk')}</TextView>
      </Box>
    </LargePanel>
  )
}

export default PrepareForVideoVisit

import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, LargePanel, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

import { HealthStackParamList } from '../../../HealthStackScreens'

type PrepareForVideoVisitProps = StackScreenProps<HealthStackParamList, 'PrepareForVideoVisit'>

function PrepareForVideoVisit({}: PrepareForVideoVisitProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel title={t('appointmentsHelp')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header" mb={theme.dimensions.condensedMarginBetween}>
          {t('appointmentsTab.medicationWording.howToSetUpDevice')}
        </TextView>
        <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.beforeYourAppointment')}
        </TextView>
        <VABulletList
          paragraphSpacing
          listOfText={[
            t('prepareForVideoVisit.downloadBasedOnDevice'),
            t('prepareForVideoVisit.cameraAndMicrophone'),
            t('prepareForVideoVisit.joinBy'),
          ]}
        />

        <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
          {t('prepareForVideoVisit.toHaveBestExperience')}
        </TextView>
        <VABulletList
          paragraphSpacing
          listOfText={[
            t('prepareForVideoVisit.connectFromQuietPlace'),
            t('prepareForVideoVisit.checkConnection'),
            t('prepareForVideoVisit.connectWithWifi'),
          ]}
        />
      </Box>
    </LargePanel>
  )
}

export default PrepareForVideoVisit

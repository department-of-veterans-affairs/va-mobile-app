import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { Box, TextArea, TextView, VAScrollView } from 'components'
import { HealthStackParamList } from '../../../HealthStackScreens'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type PrepareForVideoVisitProps = StackScreenProps<HealthStackParamList, 'PrepareForVideoVisit'>

const PrepareForVideoVisit: FC<PrepareForVideoVisitProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
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
    <VAScrollView {...testIdProps(generateTestID(t('prepareForVideoVisit.title'), ''))}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
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
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default PrepareForVideoVisit

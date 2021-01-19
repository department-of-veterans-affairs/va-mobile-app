import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { AppointmentsStackParamList } from '../../AppointmentsScreen'
import { Box, TextArea, TextView } from 'components'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type PrepareForVideoVisitProps = StackScreenProps<AppointmentsStackParamList, 'PrepareForVideoVisit'>

const PrepareForVideoVisit: FC<PrepareForVideoVisitProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
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
    <ScrollView {...testIdProps('Prepare-for-video-visit-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('prepareForVideoVisit.beforeYourAppointment')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
            {t('prepareForVideoVisit.downloadBasedOnDevice')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
            {t('prepareForVideoVisit.cameraAndMicrophone')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
            {t('prepareForVideoVisit.joinBy')}
          </TextView>

          <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.marginBetween}>
            {t('prepareForVideoVisit.toHaveBestExperience')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
            {t('prepareForVideoVisit.connectFromQuietPlace')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
            {t('prepareForVideoVisit.checkConnection')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
            {t('prepareForVideoVisit.connectWithWifi')}
          </TextView>

          <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.marginBetween}>
            {t('prepareForVideoVisit.medicationReview')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
            {t('prepareForVideoVisit.reviewEverything')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
            {t('prepareForVideoVisit.beReadyToTalk')}
          </TextView>
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default PrepareForVideoVisit

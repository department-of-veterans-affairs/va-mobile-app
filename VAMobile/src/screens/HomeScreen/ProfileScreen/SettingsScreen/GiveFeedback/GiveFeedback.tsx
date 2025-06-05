import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import _ from 'underscore'

import { Box, FeatureLandingTemplate, SimpleList, SimpleListItemObj } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useOpenAppStore, useRouteNavigation, useTheme } from 'utils/hooks'

type GiveFeedbackScreenProps = StackScreenProps<HomeStackParamList, 'GiveFeedback'>

function GiveFeedbackScreen({ navigation }: GiveFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const openAppStore = useOpenAppStore()

  const items: Array<SimpleListItemObj> = _.flatten([
    {
      text: t('giveFeedback.send'),
      onPress: () => navigateTo('SendUsFeedback'),
      detoxTestID: 'inAppRecruitmentID',
    },
    {
      text: t('giveFeedback.leaveAppReview'),
      onPress: openAppStore,
      detoxTestID: 'leaveAppReviewID',
    },
  ])

  return (
    <FeatureLandingTemplate
      backLabel={t('settings.title')}
      backLabelOnPress={navigation.goBack}
      title={t('giveFeedback')}
      testID="giveFeedbackID">
      <>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <SimpleList items={items} />
        </Box>
      </>
    </FeatureLandingTemplate>
  )
}
export default GiveFeedbackScreen

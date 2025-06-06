import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import _ from 'underscore'

import {
  AnnouncementBanner,
  Box,
  ButtonDecoratorType,
  FeatureLandingTemplate,
  SimpleList,
  SimpleListItemObj,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import getEnv from 'utils/env'
import { useOpenAppStore, useRouteNavigation, useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'

type GiveFeedbackScreenProps = StackScreenProps<HomeStackParamList, 'GiveFeedback'>

function GiveFeedbackScreen({ navigation }: GiveFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const openAppStore = useOpenAppStore()
  const { APPLE_STORE_LINK, GOOGLE_PLAY_LINK } = getEnv()
  const appStoreLink = isIOS() ? APPLE_STORE_LINK : GOOGLE_PLAY_LINK

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
      decorator: ButtonDecoratorType.Launch,
    },
  ])

  return (
    <FeatureLandingTemplate
      backLabel={t('settings.title')}
      backLabelOnPress={navigation.goBack}
      title={t('giveFeedback')}
      testID="giveFeedbackID">
      <Box mb={theme.dimensions.standardMarginBetween}>
        <SimpleList items={items} />
      </Box>
    </FeatureLandingTemplate>
  )
}
export default GiveFeedbackScreen

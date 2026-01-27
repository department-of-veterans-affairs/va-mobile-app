import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import _ from 'underscore'

import { Box, ButtonDecoratorType, FeatureLandingTemplate, SimpleList, SimpleListItemObj } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { CONNECTION_STATUS } from 'constants/offline'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useOfflineSnackbar, useOpenAppStore, useRouteNavigation, useTheme } from 'utils/hooks'
import { useAppIsOnline } from 'utils/hooks/offline'

type GiveFeedbackScreenProps = StackScreenProps<HomeStackParamList, 'GiveFeedback'>

function GiveFeedbackScreen({ navigation }: GiveFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const openAppStore = useOpenAppStore()
  const connectionStatus = useAppIsOnline()
  const showOfflineSnackbar = useOfflineSnackbar()

  const items: Array<SimpleListItemObj> = _.flatten([
    {
      text: t('giveFeedback.send'),
      onPress: () => {
        if (connectionStatus === CONNECTION_STATUS.DISCONNECTED) {
          showOfflineSnackbar()
          return
        }

        navigateTo('SendUsFeedback')
      },
      detoxTestID: 'inAppRecruitmentID',
      decorator: ButtonDecoratorType.Navigation,
    },
    {
      text: t('giveFeedback.leaveAppReview'),
      onPress: openAppStore,
      detoxTestID: 'leaveAppReviewID',
      decorator: ButtonDecoratorType.Launch,
    },
  ])

  return (
    <FeatureLandingTemplate backLabelOnPress={navigation.goBack} title={t('giveFeedback')} testID="giveFeedbackID">
      <Box mb={theme.dimensions.standardMarginBetween}>
        <SimpleList items={items} />
      </Box>
    </FeatureLandingTemplate>
  )
}
export default GiveFeedbackScreen

import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'underscore'

import {
  Box,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  SimpleList,
  SimpleListItemObj,
  TextView,
  VABulletList,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useOpenAppStore, useRouteNavigation, useTheme } from 'utils/hooks'

type SendUsFeedbackScreenProps = StackScreenProps<HomeStackParamList, 'SendUsFeedback'>

function SendUsFeedbackScreen({ navigation }: SendUsFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  //   const openAppStore = useOpenAppStore()

  //   const items: Array<SimpleListItemObj> = _.flatten([
  //     {
  //     text: t('giveFeedback.send'),
  //     onPress: () => navigateTo('InAppRecruitment'),
  //     detoxTestID: 'inAppRecruitmentID',
  //     },
  //     {
  //     text: t('giveFeedback.leaveAppReview'),
  //     onPress: openAppStore,
  //     detoxTestID: 'leaveAppReviewID',
  //     },
  //     ])

  const bulletedListOfText = [
    { text: t('giveFeedback.send.bodyText.bullet.1') },
    { text: t('giveFeedback.send.bodyText.bullet.2') },
    {
      text: t('giveFeedback.send.bodyText.bullet.3'),
      a11yLabel: a11yLabelVA(t('giveFeedback.send.bodyText.bullet.3')),
    },
  ]

  return (
    <FeatureLandingTemplate
      backLabel={t('giveFeedback')}
      backLabelOnPress={navigation.goBack}
      title={t('giveFeedback.send')}
      testID="sendUsFeedbackID"
      footerContent={
        <Box mx={theme.dimensions.gutter} py={theme.dimensions.standardMarginBetween}>
          <Button
            label={t('giveFeedback.startSurvey')}
            onPress={() => {
              navigateTo('InAppFeedback', { task: 'static' })
            }}
          />
        </Box>
      }>
      <Box mx={theme.dimensions.gutter}>
        <TextView>{t('giveFeedback.send.bodyText')}</TextView>
        <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
          <VABulletList listOfText={bulletedListOfText} />
        </Box>
        <LinkWithAnalytics
          type="custom"
          text={t('giveFeedback.termsAndConditions')}
          onPress={() => navigateTo('TermsAndConditions')}
          testID="termsAndConditionsID"
        />
      </Box>
    </FeatureLandingTemplate>
  )
}
export default SendUsFeedbackScreen

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'underscore'

import {
  Box,
  FeatureLandingTemplate,
  LargePanel,
  LinkWithAnalytics,
  SimpleList,
  SimpleListItemObj,
  TextView,
  VABulletList,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useExternalLink, useOpenAppStore, useRouteNavigation, useTheme } from 'utils/hooks'

const { LINK_URL_OMB_PAGE } = getEnv()

type FeedbackTermsAndConditionsScreenProps = StackScreenProps<HomeStackParamList, 'FeedbackTermsAndConditions'>

function FeedbackTermsAndConditionsScreen({}: FeedbackTermsAndConditionsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
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

  return (
    <LargePanel title={t('giveFeedback.send')} rightButtonText={t('close')} testID="sendUsFeedbackID">
      <Box mx={theme.dimensions.gutter}>
        <TextView variant="HelperTextBold">{t('giveFeedback.termsAndConditions.lowercase')}</TextView>
        <TextView variant="HelperText" mt={theme.dimensions.condensedMarginBetween}>
          {t('inAppFeedback.legalReqs.paragraph')}
        </TextView>
        <Pressable onPress={() => launchExternalLink(LINK_URL_OMB_PAGE)} accessibilityRole="link" accessible={true}>
          <TextView variant="MobileFooterLink" mt={theme.dimensions.standardMarginBetween}>
            {t('inAppFeedback.legalReqs.paragraph.link')}
          </TextView>
        </Pressable>
        <TextView variant="HelperText" mt={theme.dimensions.standardMarginBetween}>
          {t('inAppFeedback.legalReqs.paragraph.2')}
        </TextView>
      </Box>
    </LargePanel>
  )
}
export default FeedbackTermsAndConditionsScreen

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'

import { useAppeal } from 'api/claimsAndAppeals'
import {
  AppealAttributesData,
  AppealData,
  AppealEventTypesConstants,
  AppealTypes,
  AppealTypesConstants,
} from 'api/types'
import { Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import AppealIssues from 'screens/BenefitsScreen/ClaimsScreen/AppealDetailsScreen/AppealIssues/AppealIssues'
import AppealStatus from 'screens/BenefitsScreen/ClaimsScreen/AppealDetailsScreen/AppealStatus/AppealStatus'
import NeedHelpData from 'screens/BenefitsScreen/ClaimsScreen/NeedHelpData/NeedHelpData'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { formatDateMMMMDDYYYY, getFormattedTimeForTimeZone, getTranslation } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'
import { screenContentAllowed } from 'utils/waygateConfig'

type AppealDetailsScreenProps = StackScreenProps<BenefitsStackParamList, 'AppealDetailsScreen'>

function AppealDetailsScreen({ navigation, route }: AppealDetailsScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const registerReviewEvent = useReviewEvent(true)

  const controlLabels = [t('claimDetails.status'), t('appealDetails.issuesTab')]
  const segmentedControlTestIDs = ['appealStatus', 'appealIssues']

  const [selectedTab, setSelectedTab] = useState(0)
  const segmentedControlA11yHints = [
    t('appealDetails.viewYourAppeal', { tabName: t('claimDetails.status') }),
    t('appealDetails.viewYourAppeal', { tabName: t('appealDetails.issuesTab') }),
  ]
  const { appealID } = route.params
  const {
    data: appeal,
    error: appealError,
    refetch: refetchAppeals,
    isFetching: loadingAppeal,
  } = useAppeal(appealID, { enabled: screenContentAllowed('WG_AppealDetailsScreen') })
  const { attributes, type } = appeal || ({} as AppealData)
  const { updated, programArea, events, status, aoj, docket, issues, active } =
    attributes || ({} as AppealAttributesData)

  useEffect(() => {
    if (appeal && !loadingAppeal && !appealError) {
      registerReviewEvent()
    }
  }, [appeal, loadingAppeal, appealError, registerReviewEvent])

  const onTabChange = (tab: number) => {
    setSelectedTab(tab)
  }

  const getDisplayType = (): string => {
    let appealType = type
    if (type === AppealTypesConstants.legacyAppeal) {
      appealType = AppealTypesConstants.appeal
    }

    return getTranslation(`appealDetails.${appealType}`, t)
  }

  const getSubmittedDate = (): string => {
    let findElement = ''
    switch (type) {
      case AppealTypesConstants.higherLevelReview:
        findElement = AppealEventTypesConstants.hlr_request
        break
      case AppealTypesConstants.legacyAppeal:
      case AppealTypesConstants.appeal:
        findElement = AppealEventTypesConstants.nod
        break
      case AppealTypesConstants.supplementalClaim:
        findElement = AppealEventTypesConstants.sc_request
        break
    }

    const event = events?.find((el) => el.type === findElement)
    return event?.date || ''
  }

  const formattedUpdatedDate = formatDateMMMMDDYYYY(updated || '')
  const formattedUpdatedTime = getFormattedTimeForTimeZone(updated || '')
  const formattedSubmittedDate = formatDateMMMMDDYYYY(getSubmittedDate())

  return (
    <FeatureLandingTemplate
      backLabel={t('claims.title')}
      backLabelOnPress={navigation.goBack}
      title={t('appealDetails.title')}
      testID="appealsDetailsTestID"
      backLabelTestID="appealsBackID"
      screenID={ScreenIDTypesConstants.APPEAL_DETAILS_SCREEN_ID}>
      {loadingAppeal ? (
        <LoadingComponent text={t('appealDetails.loading')} />
      ) : appealError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.APPEAL_DETAILS_SCREEN_ID}
          error={appealError}
          onTryAgain={refetchAppeals}
        />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom}>
          <Box mx={theme.dimensions.gutter}>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('appealDetails.pageTitle', { appealType: getDisplayType(), programArea: programArea || '' })}
            </TextView>
            <TextView variant="MobileBody" testID="appealsUpToDateTestID">
              {t('appealDetails.upToDate', { date: formattedUpdatedDate, time: formattedUpdatedTime })}
            </TextView>
            <TextView variant="MobileBody">{t('claimDetails.receivedOn', { date: formattedSubmittedDate })}</TextView>
            <Box mt={theme.dimensions.standardMarginBetween}>
              <SegmentedControl
                labels={controlLabels}
                onChange={onTabChange}
                selected={selectedTab}
                a11yHints={segmentedControlA11yHints}
                testIDs={segmentedControlTestIDs}
              />
            </Box>
          </Box>
          <Box mt={theme.dimensions.condensedMarginBetween}>
            {appeal && selectedTab === 0 && (
              <AppealStatus
                events={events}
                status={status}
                aoj={aoj}
                appealType={type}
                docketName={docket?.type}
                numAppealsAhead={docket?.ahead}
                isActiveAppeal={active}
                programArea={programArea}
              />
            )}
            {appeal && selectedTab === 1 && (
              <AppealIssues appealType={appeal.attributes.type as AppealTypes} issues={issues} />
            )}
          </Box>
          <NeedHelpData appealId={appealID} />
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default AppealDetailsScreen

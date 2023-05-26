import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { filter, pluck } from 'underscore'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { AppealAttributesData, AppealData, AppealEventTypesConstants, AppealTypesConstants } from 'store/api/types'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent, SegmentedControl, TextView } from 'components'
import { ClaimsAndAppealsState, getAppeal } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { formatDateMMMMDDYYYY, getFormattedTimeForTimeZone, getTranslation } from 'utils/formattingUtils'
import { useAppDispatch, useBeforeNavBackListener, useError } from 'utils/hooks'
import { useSelector } from 'react-redux'
import { useTheme } from 'utils/hooks/useTheme'
import AppealIssues from './AppealIssues/AppealIssues'
import AppealStatus from './AppealStatus/AppealStatus'

type AppealDetailsScreenProps = StackScreenProps<BenefitsStackParamList, 'AppealDetailsScreen'>

const AppealDetailsScreen: FC<AppealDetailsScreenProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const controlValues = [t('claimDetails.status'), t('appealDetails.issuesTab')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])
  const segmentedControlA11yHints = [
    t('appealDetails.viewYourAppeal', { tabName: t('claimDetails.status') }),
    t('appealDetails.viewYourAppeal', { tabName: t('appealDetails.issuesTab') }),
  ]

  const { appealID } = route.params
  const { appeal, loadingAppeal, cancelLoadingDetailScreen } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { attributes, type } = appeal || ({} as AppealData)
  const { updated, programArea, events, status, aoj, docket, issues, active } = attributes || ({} as AppealAttributesData)

  useBeforeNavBackListener(navigation, () => {
    // if appeals is still loading cancel it
    if (loadingAppeal) {
      cancelLoadingDetailScreen?.abort()
    }
  })

  useEffect(() => {
    dispatch(getAppeal(appealID, ScreenIDTypesConstants.APPEAL_DETAILS_SCREEN_ID))
  }, [dispatch, appealID])

  const getFilteredIssues = (): Array<string> => {
    // Only show issues with a lastAction of null, this signifies the issue is active
    const filteredIssues = filter(issues, (issue) => issue.lastAction == null)
    return pluck(filteredIssues, 'description')
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

  if (useError(ScreenIDTypesConstants.APPEAL_DETAILS_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate backLabel={t('claims.title')} backLabelOnPress={navigation.goBack} title={t('appealDetails.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.APPEAL_DETAILS_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loadingAppeal) {
    return (
      <FeatureLandingTemplate backLabel={t('claims.title')} backLabelOnPress={navigation.goBack} title={t('appealDetails.title')}>
        <LoadingComponent text={t('appealDetails.loading')} />
      </FeatureLandingTemplate>
    )
  }

  const formattedUpdatedDate = formatDateMMMMDDYYYY(updated || '')
  const formattedUpdatedTime = getFormattedTimeForTimeZone(updated || '')
  const formattedSubmittedDate = formatDateMMMMDDYYYY(getSubmittedDate())

  return (
    <FeatureLandingTemplate backLabel={t('claims.title')} backLabelOnPress={navigation.goBack} title={t('appealDetails.title')}>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          <TextView variant="BitterBoldHeading" mb={theme.dimensions.condensedMarginBetween} accessibilityRole="header">
            {t('appealDetails.pageTitle', { appealType: getDisplayType(), programArea: programArea || '' })}
          </TextView>
          <TextView variant="MobileBody">{t('appealDetails.upToDate', { date: formattedUpdatedDate, time: formattedUpdatedTime })}</TextView>
          <TextView variant="MobileBody">{t('appealDetails.submitted', { date: formattedSubmittedDate })}</TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <SegmentedControl
              values={controlValues}
              titles={controlValues}
              onChange={setSelectedTab}
              selected={controlValues.indexOf(selectedTab)}
              accessibilityHints={segmentedControlA11yHints}
            />
          </Box>
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          {appeal && selectedTab === t('claimDetails.status') && (
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
          {appeal && selectedTab === t('appealDetails.issuesTab') && <AppealIssues issues={getFilteredIssues()} />}
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default AppealDetailsScreen

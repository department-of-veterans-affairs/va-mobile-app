import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { filter, pluck } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { AppealAttributesData, AppealData, AppealEventTypesConstants, AppealTypesConstants } from 'store/api/types'
import { Box, ErrorComponent, LoadingComponent, SegmentedControl, TextArea, TextView, VAScrollView } from 'components'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { formatDateMMMMDDYYYY, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { getAppeal } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'
import AppealDetails from './AppealDetails/AppealDetails'
import AppealStatus from './AppealStatus/AppealStatus'

type AppealDetailsScreenProps = StackScreenProps<ClaimsStackParamList, 'AppealDetailsScreen'>

const AppealDetailsScreen: FC<AppealDetailsScreenProps> = ({ route }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.CLAIMS)

  const controlValues = [t('claimDetails.status'), t('claimDetails.details')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])
  const segmentedControlA11yHints = [
    t('appealDetails.viewYourAppeal', { tabName: t('claimDetails.status') }),
    t('appealDetails.viewYourAppeal', { tabName: t('claimDetails.details') }),
  ]

  const { appealID } = route.params
  const { appeal, loadingAppeal } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { attributes, type } = appeal || ({} as AppealData)
  const { updated, programArea, events, status, aoj, docket, issues, active } = attributes || ({} as AppealAttributesData)

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

    return t(`appealDetails.${appealType}`)
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
    return <ErrorComponent screenID={ScreenIDTypesConstants.APPEAL_DETAILS_SCREEN_ID} />
  }

  if (loadingAppeal) {
    return <LoadingComponent />
  }

  const formattedUpdatedDate = formatDateMMMMDDYYYY(updated || '')
  const formattedUpdatedTime = getFormattedTimeForTimeZone(updated || '')
  const formattedSubmittedDate = formatDateMMMMDDYYYY(getSubmittedDate())

  return (
    <VAScrollView {...testIdProps('Your-appeal: Appeal-details-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
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
        </TextArea>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          {appeal && selectedTab === t('claimDetails.status') && (
            <AppealStatus events={events} status={status} aoj={aoj} appealType={type} numAppealsAhead={docket?.ahead} isActiveAppeal={active} />
          )}
          {appeal && selectedTab === t('claimDetails.details') && <AppealDetails issues={getFilteredIssues()} />}
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default AppealDetailsScreen

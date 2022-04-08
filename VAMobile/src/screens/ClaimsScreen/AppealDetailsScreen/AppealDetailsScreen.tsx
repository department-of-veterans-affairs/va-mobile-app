import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { filter, pluck } from 'underscore'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { AppealAttributesData, AppealData, AppealEventTypesConstants, AppealTypesConstants } from 'store/api/types'
import { BackButton, Box, ErrorComponent, LoadingComponent, SegmentedControl, TextView, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsAndAppealsState, getAppeal } from 'store/slices'
import { ClaimsStackParamList } from '../ClaimsStackScreens'
import { InteractionManager } from 'react-native'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { formatDateMMMMDDYYYY, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useError, useTheme, useTranslation } from 'utils/hooks'
import { useSelector } from 'react-redux'
import AppealIssues from './AppealIssues/AppealIssues'
import AppealStatus from './AppealStatus/AppealStatus'

type AppealDetailsScreenProps = StackScreenProps<ClaimsStackParamList, 'AppealDetailsScreen'>

const AppealDetailsScreen: FC<AppealDetailsScreenProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const t = useTranslation(NAMESPACE.CLAIMS)

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
  const [isTransitionComplete, setIsTransitionComplete] = React.useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => (
        <BackButton
          onPress={() => {
            navigation.goBack()
            // if appeals is still loading cancel it
            if (loadingAppeal) {
              cancelLoadingDetailScreen?.abort()
            }
          }}
          canGoBack={props.canGoBack}
          label={BackButtonLabelConstants.back}
          showCarat={true}
        />
      ),
    })
  })

  useEffect(() => {
    dispatch(getAppeal(appealID, ScreenIDTypesConstants.APPEAL_DETAILS_SCREEN_ID))
    const interaction = InteractionManager.runAfterInteractions(() => {
      setIsTransitionComplete(true)
    })
    return () => interaction.cancel()
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

  if (loadingAppeal || !isTransitionComplete) {
    return <LoadingComponent />
  }

  const formattedUpdatedDate = formatDateMMMMDDYYYY(updated || '')
  const formattedUpdatedTime = getFormattedTimeForTimeZone(updated || '')
  const formattedSubmittedDate = formatDateMMMMDDYYYY(getSubmittedDate())

  return (
    <VAScrollView {...testIdProps('Your-appeal: Appeal-details-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          <TextView variant="BitterBoldHeading" color={'primaryTitle'} mb={theme.dimensions.condensedMarginBetween} accessibilityRole="header">
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
    </VAScrollView>
  )
}

export default AppealDetailsScreen

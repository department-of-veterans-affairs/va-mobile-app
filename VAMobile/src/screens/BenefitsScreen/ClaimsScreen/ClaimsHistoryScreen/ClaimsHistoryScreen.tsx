import { SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, useEffect, useState } from 'react'

import { AlertBox, Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent } from 'components'
import { AuthorizedServicesState, ClaimsAndAppealsState, PersonalInformationState, getProfileInfo, prefetchClaimsAndAppeals } from 'store/slices'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { featureEnabled } from 'utils/remoteConfig'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useDowntime, useError, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import ClaimsAndAppealsListView, { ClaimTypeConstants } from '../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import NoClaimsAndAppealsAccess from '../NoClaimsAndAppealsAccess/NoClaimsAndAppealsAccess'

type IClaimsHistoryScreen = StackScreenProps<BenefitsStackParamList, 'Claims'>

const ClaimsHistoryScreen: FC<IClaimsHistoryScreen> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { claimsAndAppealsByClaimType, loadingClaimsAndAppeals, claimsServiceError, appealsServiceError } = useSelector<RootState, ClaimsAndAppealsState>(
    (state) => state.claimsAndAppeals,
  )
  const {
    claims: claimsAuthorized,
    appeals: appealsAuthorized,
    decisionLetters: decisionLettersAuthorized,
  } = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)
  const claimsAndAppealsAccess = claimsAuthorized || appealsAuthorized
  const { loading: personalInformationLoading, needsDataLoad: personalInformationNeedsUpdate } = useSelector<RootState, PersonalInformationState>(
    (state) => state.personalInformation,
  )
  const controlLabels = [t('claimsTab.active'), t('claimsTab.closed')]
  const accessibilityHints = [t('claims.viewYourActiveClaims'), t('claims.viewYourClosedClaims')]
  const [selectedTab, setSelectedTab] = useState(0)
  const claimType = selectedTab === controlLabels.indexOf(t('claimsTab.active')) ? ClaimTypeConstants.ACTIVE : ClaimTypeConstants.CLOSED
  const claimsAndAppealsServiceErrors = !!claimsServiceError && !!appealsServiceError
  const claimsNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.claims)
  const appealsNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.appeals)
  const profileNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.userProfileUpdate)

  const title = featureEnabled('decisionLettersWaygate') && decisionLettersAuthorized ? t('claimsHistory.title') : t('claims.title')
  const backLabel = featureEnabled('decisionLettersWaygate') && decisionLettersAuthorized ? t('claims.title') : t('benefits.title')

  useEffect(() => {
    // Fetch the profile information
    if (personalInformationNeedsUpdate && profileNotInDowntime) {
      dispatch(getProfileInfo(ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID))
    }
  }, [dispatch, personalInformationNeedsUpdate, profileNotInDowntime])

  // load claims and appeals and filter upon mount
  // fetch the first page of Active and Closed
  useEffect(() => {
    // only block api call if claims and appeals are both down
    if (claimsAndAppealsAccess && (claimsNotInDowntime || appealsNotInDowntime)) {
      dispatch(prefetchClaimsAndAppeals(ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID))
    }
  }, [dispatch, claimsAndAppealsAccess, claimsNotInDowntime, appealsNotInDowntime])

  const fetchInfoAgain = (): void => {
    if (claimsAndAppealsAccess) {
      dispatch(prefetchClaimsAndAppeals(ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID))
    }
    if (personalInformationNeedsUpdate) {
      dispatch(getProfileInfo(ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID))
    }
  }

  if (useError(ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={title}>
        <ErrorComponent onTryAgain={fetchInfoAgain} screenID={ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loadingClaimsAndAppeals || personalInformationLoading) {
    return (
      <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={title}>
        <LoadingComponent text={t('claimsAndAppeals.loadingClaimsAndAppeals')} />
      </FeatureLandingTemplate>
    )
  }

  if (!claimsAndAppealsAccess) {
    return (
      <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={title}>
        <NoClaimsAndAppealsAccess />
      </FeatureLandingTemplate>
    )
  }

  const serviceErrorAlert = (): ReactElement => {
    // if there is a claims service error or an appeals service error
    if (!!claimsServiceError || !!appealsServiceError) {
      let alertTitle, alertText, alertTextA11yLabel

      // if both services failed
      if (claimsAndAppealsServiceErrors) {
        alertTitle = t('claimsAndAppeal.claimAndAppealStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingClaimsAndAppeals')
        alertTextA11yLabel = t('claimsAndAppeal.troubleLoadingClaimsAndAppealsA11yLabel')

        // if claims service fails but appeals did not
      } else if (!!claimsServiceError && !appealsServiceError) {
        alertTitle = t('claimsAndAppeal.claimStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingClaims')
        alertTextA11yLabel = t('claimsAndAppeal.troubleLoadingClaimsA11yLabel')

        // if appeals service fails but claims does not
      } else if (!!appealsServiceError && !claimsServiceError) {
        alertTitle = t('claimsAndAppeal.appealStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingAppeals')
        alertTextA11yLabel = t('claimsAndAppeal.troubleLoadingAppealsA11yLabel')
      }

      return (
        <Box mb={theme.dimensions.standardMarginBetween}>
          <AlertBox title={alertTitle} text={alertText} textA11yLabel={alertTextA11yLabel} border="error" />
        </Box>
      )
    }

    return <></>
  }

  const onTabChange = (tab: number) => {
    if (tab !== selectedTab) {
      logAnalyticsEvent(Events.vama_claim_count(claimsAndAppealsByClaimType.CLOSED.length, claimsAndAppealsByClaimType.ACTIVE.length, controlLabels[tab]))
    }
    setSelectedTab(tab)
  }

  return (
    <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={title}>
      <Box flex={1} justifyContent="flex-start" mb={theme.dimensions.contentMarginBottom}>
        {!claimsAndAppealsServiceErrors && (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
            <SegmentedControl labels={controlLabels} onChange={onTabChange} selected={selectedTab} a11yHints={accessibilityHints} />
          </Box>
        )}
        {serviceErrorAlert()}
        {!claimsAndAppealsServiceErrors && (
          <Box flex={1}>
            <ClaimsAndAppealsListView claimType={claimType} />
          </Box>
        )}
      </Box>
    </FeatureLandingTemplate>
  )
}

export default ClaimsHistoryScreen

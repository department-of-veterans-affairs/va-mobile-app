import { SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useCallback, useEffect, useState } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextView } from 'components'
import { ClaimAttributesData, ClaimData } from 'store/api/types'
import { ClaimsAndAppealsState, getClaim } from 'store/slices/claimsAndAppealsSlice'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { featureEnabled } from 'utils/remoteConfig'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useBeforeNavBackListener, useError, useTheme } from 'utils/hooks'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import ClaimDetails from './ClaimDetails/ClaimDetails'
import ClaimStatus from './ClaimStatus/ClaimStatus'

export const getClaimType = (claim: ClaimData | undefined, translation: TFunction): string => {
  return claim?.attributes?.claimType || translation('claims.defaultClaimType')
}

type ClaimDetailsScreenProps = StackScreenProps<BenefitsStackParamList, 'ClaimDetailsScreen'>

const ClaimDetailsScreen: FC<ClaimDetailsScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const controlLabels = [t('claimDetails.status'), t('claimDetails.details')]
  const [selectedTab, setSelectedTab] = useState(0)

  const { claimID, claimType } = route.params
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { claim, loadingClaim, cancelLoadingDetailScreen } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { attributes } = claim || ({} as ClaimData)
  const { dateFiled } = attributes || ({} as ClaimAttributesData)

  useBeforeNavBackListener(navigation, () => {
    // if claim is still loading cancel it
    if (loadingClaim) {
      cancelLoadingDetailScreen?.abort()
    }
  })

  useEffect(() => {
    dispatch(getClaim(claimID, ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID))
  }, [dispatch, claimID])

  // Track how long user maintains focus on this screen
  useFocusEffect(
    useCallback(() => {
      const startTime = Date.now()
      return () => {
        if (claim && claim.id === claimID) {
          const elapsedTime = Date.now() - startTime
          logAnalyticsEvent(Events.vama_claim_details_ttv(claim.id, attributes.claimType, attributes.phase, attributes.phaseChangeDate || '', attributes.dateFiled, elapsedTime))
        }
      }
    }, [claimID, claim, attributes]),
  )

  const backLabel = featureEnabled('decisionLettersWaygate') && userAuthorizedServices?.decisionLetters ? t('claimsHistory.title') : t('claims.title')

  if (useError(ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('claimDetails.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loadingClaim) {
    return (
      <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('claimDetails.title')}>
        <LoadingComponent text={t('claimInformation.loading')} />
      </FeatureLandingTemplate>
    )
  }

  const onTabChange = (tab: number) => {
    if (tab !== selectedTab && claim) {
      const analyticsEvent = tab === controlLabels.indexOf(t('claimDetails.status')) ? Events.vama_claim_status_tab : Events.vama_claim_details_tab
      logAnalyticsEvent(analyticsEvent(claim.id, claim.attributes.claimType, claim.attributes.phase, claim.attributes.dateFiled))
      logAnalyticsEvent(Events.vama_segcontrol_click(controlLabels[tab]))
    }
    setSelectedTab(tab)
  }

  const formattedReceivedDate = formatDateMMMMDDYYYY(dateFiled || '')
  const a11yHints = [t('claimDetails.viewYourClaim', { tabName: t('claimDetails.status') }), t('claimDetails.viewYourClaim', { tabName: t('claimDetails.details') })]

  return (
    <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('claimDetails.title')} testID="ClaimDetailsScreen">
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          <TextView variant="BitterBoldHeading" mb={theme.dimensions.condensedMarginBetween} accessibilityRole="header">
            {t('claimDetails.titleWithType', { type: getClaimType(claim, t).toLowerCase() })}
          </TextView>
          <TextView variant="MobileBody">{t('claimDetails.receivedOn', { date: formattedReceivedDate })}</TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <SegmentedControl labels={controlLabels} onChange={onTabChange} selected={selectedTab} a11yHints={a11yHints} />
          </Box>
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          {claim && selectedTab === 0 && <ClaimStatus claim={claim || ({} as ClaimData)} claimType={claimType} />}
          {claim && selectedTab === 1 && <ClaimDetails claim={claim} />}
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default ClaimDetailsScreen

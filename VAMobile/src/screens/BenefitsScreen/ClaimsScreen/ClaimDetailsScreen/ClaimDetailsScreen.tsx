import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import { useQueryClient } from '@tanstack/react-query'
import { TFunction } from 'i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaim } from 'api/claimsAndAppeals'
import { claimsAndAppealsKeys } from 'api/claimsAndAppeals/queryKeys'
import { ClaimAttributesData, ClaimData } from 'api/types'
import { Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { logAnalyticsEvent } from 'utils/analytics'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useBeforeNavBackListener, useTheme } from 'utils/hooks'
import { registerReviewEvent } from 'utils/inAppReviews'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

import ClaimDetails from './ClaimDetails/ClaimDetails'
import ClaimStatus from './ClaimStatus/ClaimStatus'

export const getClaimType = (claim: ClaimData | undefined, translation: TFunction): string => {
  return claim?.attributes?.claimType || translation('claims.defaultClaimType')
}

type ClaimDetailsScreenProps = StackScreenProps<BenefitsStackParamList, 'ClaimDetailsScreen'>

function ClaimDetailsScreen({ navigation, route }: ClaimDetailsScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const controlLabels = [t('claimDetails.status'), t('claimDetails.details')]
  const [selectedTab, setSelectedTab] = useState(0)

  const { claimID, claimType } = route.params
  const queryClient = useQueryClient()
  const abortController = new AbortController()
  const abortSignal = abortController.signal
  const {
    data: claim,
    isFetching: loadingClaim,
    error: claimError,
    refetch: refetchClaim,
  } = useClaim(claimID, abortSignal, { enabled: screenContentAllowed('WG_ClaimDetailsScreen') })
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { attributes } = claim || ({} as ClaimData)
  const { dateFiled } = attributes || ({} as ClaimAttributesData)

  useBeforeNavBackListener(navigation, () => {
    // if claim is still loading cancel it
    if (loadingClaim) {
      queryClient.invalidateQueries({ queryKey: claimsAndAppealsKeys.claim })
      abortController.abort()
    }
  })

  useEffect(() => {
    if (claim && !loadingClaim && !claimError) {
      registerReviewEvent()
      logAnalyticsEvent(
        Events.vama_claim_details_open(
          claimID,
          attributes.claimType,
          attributes.phase,
          attributes.phaseChangeDate || '',
          attributes.dateFiled,
        ),
      )
    }
  }, [claim, loadingClaim, claimError, claimID, attributes])

  // Track how long user maintains focus on this screen
  useFocusEffect(
    useCallback(() => {
      const startTime = Date.now()
      return () => {
        if (claim && claim.id === claimID) {
          const elapsedTime = Date.now() - startTime
          logAnalyticsEvent(
            Events.vama_claim_details_ttv(
              claim.id,
              attributes.claimType,
              attributes.phase,
              attributes.phaseChangeDate || '',
              attributes.dateFiled,
              elapsedTime,
            ),
          )
        }
      }
    }, [claimID, claim, attributes]),
  )

  const backLabel =
    featureEnabled('decisionLettersWaygate') && userAuthorizedServices?.decisionLetters
      ? t('claimsHistory.title')
      : t('claims.title')

  const onTabChange = (tab: number) => {
    if (tab !== selectedTab && claim) {
      const analyticsEvent =
        tab === controlLabels.indexOf(t('claimDetails.status'))
          ? Events.vama_claim_status_tab
          : Events.vama_claim_details_tab
      logAnalyticsEvent(
        analyticsEvent(claim.id, claim.attributes.claimType, claim.attributes.phase, claim.attributes.dateFiled),
      )
      logAnalyticsEvent(Events.vama_segcontrol_click(controlLabels[tab]))
    }
    setSelectedTab(tab)
  }

  const formattedReceivedDate = formatDateMMMMDDYYYY(dateFiled || '')
  const a11yHints = [
    t('claimDetails.viewYourClaim', { tabName: t('claimDetails.status') }),
    t('claimDetails.viewYourClaim', { tabName: t('claimDetails.details') }),
  ]

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('claimDetails.title')}
      testID="ClaimDetailsScreen">
      {loadingClaim ? (
        <LoadingComponent text={t('claimInformation.loading')} />
      ) : claimError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID}
          error={claimError}
          onTryAgain={refetchClaim}
        />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom}>
          <Box mx={theme.dimensions.gutter}>
            <TextView
              variant="BitterBoldHeading"
              mb={theme.dimensions.condensedMarginBetween}
              accessibilityRole="header">
              {t('claimDetails.titleWithType', { type: getClaimType(claim, t).toLowerCase() })}
            </TextView>
            <TextView variant="MobileBody">{t('claimDetails.receivedOn', { date: formattedReceivedDate })}</TextView>
            <Box mt={theme.dimensions.standardMarginBetween}>
              <SegmentedControl
                labels={controlLabels}
                onChange={onTabChange}
                selected={selectedTab}
                a11yHints={a11yHints}
              />
            </Box>
          </Box>
          <Box mt={theme.dimensions.condensedMarginBetween}>
            {claim && selectedTab === 0 && <ClaimStatus claim={claim || ({} as ClaimData)} claimType={claimType} />}
            {claim && selectedTab === 1 && <ClaimDetails claim={claim} />}
          </Box>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default ClaimDetailsScreen

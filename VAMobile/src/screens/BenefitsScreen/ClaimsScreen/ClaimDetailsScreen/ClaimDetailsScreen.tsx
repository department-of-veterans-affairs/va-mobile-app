import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { ButtonVariants, SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import { AlertProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Alert/Alert'
import {
  Button,
  ButtonProps,
} from '@department-of-veterans-affairs/mobile-component-library/src/components/Button/Button'
import { useQueryClient } from '@tanstack/react-query'
import { TFunction } from 'i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaim } from 'api/claimsAndAppeals'
import { claimsAndAppealsKeys } from 'api/claimsAndAppeals/queryKeys'
import { useDecisionLetters } from 'api/decisionLetters'
import { ClaimAttributesData, ClaimData } from 'api/types'
import {
  AlertWithHaptics,
  Box,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  TextView,
} from 'components'
import { Events } from 'constants/analytics'
import { ClaimTypeConstants } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { logAnalyticsEvent } from 'utils/analytics'
import { isDisabilityCompensationClaim, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useBeforeNavBackListener, useRouteNavigation, useTheme } from 'utils/hooks'
import { registerReviewEvent } from 'utils/inAppReviews'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

import NeedHelpData from '../NeedHelpData/NeedHelpData'
import ClaimFiles from './ClaimFiles/ClaimFiles'
import ClaimStatus from './ClaimStatus/ClaimStatus'

export const getClaimType = (claim: ClaimData | undefined, translation: TFunction): string => {
  return claim?.attributes?.claimType || translation('claims.defaultClaimType')
}

type ClaimDetailsScreenProps = StackScreenProps<BenefitsStackParamList, 'ClaimDetailsScreen'>

function ClaimDetailsScreen({ navigation, route }: ClaimDetailsScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const scrollViewRef = useRef<ScrollView>(null)
  const navigateTo = useRouteNavigation()
  const controlIDs = ['claimsStatusID', 'claimsFilesID']
  const controlLabels = [t('claimDetails.status'), t('files')]
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
  const { data: decisionLetterData } = useDecisionLetters()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { attributes } = claim || ({} as ClaimData)
  const { dateFiled } = attributes || ({} as ClaimAttributesData)

  const [count, setCount] = useState(-1)

  const [scrollIsEnabled, setScrollIsEnabled] = useState(true)

  useFocusEffect(
    useCallback(() => {
      if (attributes) {
        setCount(numberOfItemsNeedingAttentionFromVet(attributes.eventsTimeline))
      }
    }, [attributes]),
  ) //force a rerender due to react query updating data

  const submitEvidenceExpansionFlag = featureEnabled('submitEvidenceExpansion')

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
          attributes.claimTypeCode,
          isDisabilityCompensationClaim(attributes.claimTypeCode),
        ),
      )

      // Keep tab switching or panel opening from triggering autoscroll
      setScrollIsEnabled(false)
    }
  }, [claim, loadingClaim, claimError, claimID, attributes])

  useEffect(() => {
    if (claimType === ClaimTypeConstants.ACTIVE && claim) {
      if (count > 0 && !claim.attributes.waiverSubmitted) {
        logAnalyticsEvent(Events.vama_claim_file_request(claimID))
      } else if (submitEvidenceExpansionFlag && claim.attributes.open && count >= 0) {
        logAnalyticsEvent(Events.vama_claim_submit_ev(claimID))
      }
    }
  }, [claimType, submitEvidenceExpansionFlag, count, claim, claimID])

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

  const onDecisionLetterPress = () => {
    logAnalyticsEvent(Events.vama_ddl_status_click())
    navigateTo('ClaimLettersScreen')
  }

  const fileRequestsPress = () => {
    logAnalyticsEvent(Events.vama_claim_review(claimID, attributes.claimType, count))
    navigateTo('FileRequestSubtask', { claimID, claim })
  }

  const submitEvidencePress = () => {
    logAnalyticsEvent(Events.vama_claim_submit_tap(claimID, attributes.claimType))
    navigateTo('SubmitEvidenceSubtask', { claimID })
  }

  const getActiveClosedClaimInformationAlertOrSubmitButton = () => {
    if (claimType === ClaimTypeConstants.CLOSED) {
      const isDecisionLetterReady =
        (featureEnabled('decisionLettersWaygate') &&
          userAuthorizedServices?.decisionLetters &&
          claim?.attributes.decisionLetterSent &&
          (decisionLetterData?.data.length || 0) > 0) ||
        false

      const buttonProps: ButtonProps = {
        buttonType: ButtonVariants.Primary,
        label: t('claimDetails.getClaimLetters'),
        onPress: onDecisionLetterPress,
        testID: 'getClaimLettersTestID',
      }

      const alertProps: AlertProps = {
        variant: 'info',
        header: isDecisionLetterReady ? t('claims.decisionLetterReady') : t('claims.decisionLetterMailed'),
        description: isDecisionLetterReady ? t('claims.decisionLetterReady.alertBody') : undefined,
        primaryButton: isDecisionLetterReady ? buttonProps : undefined,
        expandable: isDecisionLetterReady,
      }

      if (isDecisionLetterReady) {
        alertProps.initializeExpanded = isDecisionLetterReady
      }

      return (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <AlertWithHaptics {...alertProps} />
        </Box>
      )
    }
    if (count > 0 && !claim?.attributes?.waiverSubmitted) {
      const buttonProps: ButtonProps = {
        buttonType: ButtonVariants.Primary,
        label: t('claimPhase.fileRequests.button.label'),
        a11yHint: t('claimPhase.fileRequests.button.a11yHint'),
        onPress: fileRequestsPress,
      }
      const alertProps: AlertProps = {
        variant: 'warning',
        header: t('claimPhase.youHaveFileRequest', { count }),
        primaryButton: buttonProps,
        expandable: false,
      }
      return (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <AlertWithHaptics {...alertProps} />
        </Box>
      )
    } else if (submitEvidenceExpansionFlag && attributes?.open) {
      const buttonProps: ButtonProps = {
        buttonType: ButtonVariants.Primary,
        label: t('claimDetails.submitEvidence'),
        onPress: submitEvidencePress,
      }
      return (
        <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
          <Button {...buttonProps} />
        </Box>
      )
    }
    return <></>
  }

  const whatShouldOnPress = () => {
    logAnalyticsEvent(Events.vama_claim_disag(claimID, attributes.claimType, attributes.phase))
    navigateTo('WhatDoIDoIfDisagreement', {
      claimID: claimID,
      claimType: attributes.claimType,
      claimStep: attributes.phase,
    })
  }

  const whyWeCombineOnPress = () => {
    logAnalyticsEvent(Events.vama_claim_why_combine(claimID, attributes.claimType, attributes.phase))
    navigateTo('ConsolidatedClaimsNote')
  }

  function renderActiveClosedClaimStatusHelpLink() {
    if (claimType === ClaimTypeConstants.CLOSED) {
      return (
        <Box my={theme.dimensions.condensedMarginBetween} mx={theme.dimensions.gutter}>
          <LinkWithAnalytics
            type="custom"
            text={t('claimDetails.learnWhatToDoIfDisagreeLink')}
            testID="claimDetailsLearnWhatToDoIFDisagreeLinkID"
            onPress={whatShouldOnPress}
          />
        </Box>
      )
    }

    return (
      <Box my={theme.dimensions.condensedMarginBetween} mx={theme.dimensions.gutter}>
        <LinkWithAnalytics
          type="custom"
          text={t('claimDetails.whyWeCombineLink')}
          testID="claimDetailsWhyWeCombineLinkID"
          onPress={whyWeCombineOnPress}
        />
      </Box>
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('claimDetails.title')}
      scrollViewProps={{ scrollViewRef }}
      testID="ClaimDetailsScreen"
      backLabelTestID="claimsDetailsBackTestID">
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
          <Box mx={theme.dimensions.condensedMarginBetween}>
            <TextView variant={'MobileBodyBold'} accessibilityRole="header">
              {t('claimDetails.titleWithType', { type: getClaimType(claim, t).toLowerCase() })}
            </TextView>
            <TextView variant="MobileBody">{t('claimDetails.receivedOn', { date: formattedReceivedDate })}</TextView>
          </Box>
          {getActiveClosedClaimInformationAlertOrSubmitButton()}
          <Box mx={theme.dimensions.condensedMarginBetween}>
            <Box mt={theme.dimensions.standardMarginBetween}>
              <SegmentedControl
                labels={controlLabels}
                onChange={onTabChange}
                selected={selectedTab}
                a11yHints={a11yHints}
                testIDs={controlIDs}
              />
            </Box>
          </Box>
          <Box mt={theme.dimensions.condensedMarginBetween}>
            {claim && selectedTab === 0 && (
              <ClaimStatus
                claim={claim || ({} as ClaimData)}
                claimType={claimType}
                scrollIsEnabled={scrollIsEnabled}
                scrollViewRef={scrollViewRef}
              />
            )}
            {claim && selectedTab === 1 && <ClaimFiles claim={claim} />}
          </Box>
          {renderActiveClosedClaimStatusHelpLink()}
          <Box mt={theme.dimensions.condensedMarginBetween}>
            <NeedHelpData />
          </Box>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default ClaimDetailsScreen

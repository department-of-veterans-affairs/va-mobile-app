import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useDisabilityRating } from 'api/disabilityRating'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BranchOfService, ServiceHistoryData } from 'api/types'
import { useVeteranStatus } from 'api/veteranStatus'
import { useVeteranStatusCard } from 'api/veteranStatusCard'
import {
  AlertWithHaptics,
  Box,
  ClickToCallPhoneNumber,
  LargePanel,
  LoadingComponent,
  TextView,
  WaygateWrapper,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import VeteranStatusCard from 'screens/HomeScreen/VeteranStatusScreen/VeteranStatusCard/VeteranStatusCard'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { isValidDisabilityRating } from 'utils/claims'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useBeforeNavBackListener, useOrientation } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

const LANDSCAPE_PADDING = 44
const PORTRAIT_PADDING = 18
const MAX_WIDTH = 672

type VeteranStatusScreenProps = StackScreenProps<HomeStackParamList, 'VeteranStatus'>

function VeteranStatusScreen({ navigation }: VeteranStatusScreenProps) {
  const isCardAllowedByWaygate = screenContentAllowed('WG_VeteranStatusCard')

  // Feature flag = choose legacy vs new API logic.
  const isNewVSCCardAllowed = featureEnabled('veteranStatusCardUpdate')

  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()
  const horizontalPadding = isPortrait ? PORTRAIT_PADDING : LANDSCAPE_PADDING
  const containerStyle = !isPortrait ? { alignSelf: 'center' as const, maxWidth: MAX_WIDTH } : {}
  const registerReviewEvent = useReviewEvent(true)

  const legacyEnabled = isCardAllowedByWaygate && !isNewVSCCardAllowed

  const { data: militaryServiceHistoryAttributes, isLoading: isServiceHistoryLoading } = useServiceHistory({
    enabled: legacyEnabled,
  } as any)
  const serviceHistory = militaryServiceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)
  const mostRecentBranch = militaryServiceHistoryAttributes?.mostRecentBranch
  const { data: ratingData, isLoading: isDisabilityRatingLoading } = useDisabilityRating({
    enabled: legacyEnabled,
  } as any)
  const { data: personalInfo, isLoading: isPersonalInfoLoading } = usePersonalInformation({
    enabled: legacyEnabled,
  } as any)

  const {
    data: veteranStatus,
    isError: isVeteranStatusError,
    isLoading: isVeteranStatusLoading,
  } = useVeteranStatus({
    enabled: legacyEnabled,
  })

  const isLegacyLoading =
    legacyEnabled &&
    (isServiceHistoryLoading || isDisabilityRatingLoading || isVeteranStatusLoading || isPersonalInfoLoading)

  const veteranStatusConfirmed = veteranStatus?.data?.attributes?.veteranStatus === 'confirmed'
  const showLegacyError =
    legacyEnabled && !isLegacyLoading && (!veteranStatusConfirmed || (veteranStatusConfirmed && !serviceHistory.length))

  const ratingPercentLegacy = ratingData?.combinedDisabilityRating
  const ratingIsDefinedLegacy = isValidDisabilityRating(ratingPercentLegacy)
  const percentTextLegacy = ratingIsDefinedLegacy
    ? t('disabilityRating.percent', { combinedPercent: ratingPercentLegacy })
    : undefined
  const branchLegacy = mostRecentBranch || ('' as BranchOfService)

  const newEnabled = isCardAllowedByWaygate && isNewVSCCardAllowed

  const {
    data: veteranStatusCardData,
    isError: isVeteranStatusCardError,
    isLoading: isVeteranStatusCardLoading,
  } = useVeteranStatusCard({
    enabled: newEnabled,
  })

  const vscData = veteranStatusCardData?.data
  const vscCard = vscData?.type === 'veteran_status_card' ? vscData : undefined // add constants for these
  const vscAlert = vscData?.type === 'veteran_status_alert' ? vscData : undefined

  const isNewLoading = newEnabled && isVeteranStatusCardLoading

  const showNewError = newEnabled && !isNewLoading && (!!vscAlert || isVeteranStatusCardError || !vscCard)

  const ratingPercentNew = vscCard?.attributes?.disabilityRating ?? undefined
  const ratingIsDefinedNew = isValidDisabilityRating(ratingPercentNew)
  const percentTextNew = ratingIsDefinedNew
    ? t('disabilityRating.percent', { combinedPercent: ratingPercentNew })
    : undefined
  const branchNew = vscCard?.attributes?.latestService?.branch ?? ''

  const isLoading = isNewVSCCardAllowed ? isNewLoading : isLegacyLoading
  const showError = isNewVSCCardAllowed ? showNewError : showLegacyError
  const shouldShowCard =
    isCardAllowedByWaygate && !showError && (isNewVSCCardAllowed ? !!vscCard : veteranStatusConfirmed)
  const shouldShowFixAnErrorSection = shouldShowCard // AC: hide “Need to fix an error?” when user does not see VSC

  //*
  // test on user 127
  // use constants
  // Test the ff and log out put
  // test analytics
  // When ff is on make sure we don't make unnecessary calls to legacy endpoint
  // Update tests and mock data
  //*

  useEffect(() => {
    console.log({
      isCardAllowedByWaygate,
      isNewVSCCardAllowed,
      newEnabled,
      isVeteranStatusCardLoading,
      isVeteranStatusCardError,
      vscType: vscData?.type,
    })
  }, [
    isCardAllowedByWaygate,
    isNewVSCCardAllowed,
    newEnabled,
    isVeteranStatusCardLoading,
    isVeteranStatusCardError,
    vscData,
  ])

  useBeforeNavBackListener(navigation, () => {
    registerReviewEvent()
  })

  useEffect(() => {
    if (!isCardAllowedByWaygate) {
      const message = 'VETERAN_STATUS_CARD_BLOCKED_BY_WAYGATE'
      logAnalyticsEvent(Events.vama_vsc_error_shown(message))
    }
  }, [isCardAllowedByWaygate])

  useEffect(() => {
    if (!showError) return

    if (isNewVSCCardAllowed) {
      const reason = veteranStatusCardData?.data?.notConfirmedReason
      const message = reason ?? 'UNKNOWN'
      logAnalyticsEvent(Events.vama_vsc_error_shown(message))
      return
    }

    const notConfirmedReasonLegacy = veteranStatus?.data?.attributes?.notConfirmedReason
    const message = notConfirmedReasonLegacy ?? 'MISSING_SERVICE_HISTORY'
    logAnalyticsEvent(Events.vama_vsc_error_shown(message))
  }, [showError, isNewVSCCardAllowed, veteranStatusCardData, veteranStatus])

  const getLatestPeriodOfServiceLegacy = (): React.ReactNode => {
    if (!serviceHistory || serviceHistory.length === 0) return null

    for (let i = serviceHistory.length - 1; i >= 0; i--) {
      const service = serviceHistory[i]
      const { beginDate, endDate, branchOfService } = service
      if (beginDate && endDate) {
        const beginYear = beginDate.slice(0, 4)
        const endYear = endDate.slice(0, 4)
        const visibleText = t('militaryInformation.combined.history', {
          branch: branchOfService,
          begin: beginYear,
          end: endYear,
        })
        const a11yLabel = t('militaryInformation.combined.historyA11yLabel', {
          branch: branchOfService,
          begin: beginYear,
          end: endYear,
        })

        return (
          <TextView
            variant="MobileBody"
            color="primaryContrast"
            testID="veteranStatusMilitaryServiceTestID"
            accessibilityLabel={a11yLabel}>
            {visibleText}
          </TextView>
        )
      }
    }
    return null
  }

  const getErrorLegacy = () => {
    const notConfirmedReasonLegacy = veteranStatus?.data?.attributes?.notConfirmedReason

    if (isVeteranStatusError || notConfirmedReasonLegacy === 'ERROR') {
      return (
        <AlertWithHaptics
          variant="warning"
          header={t('errors.somethingWentWrong')}
          headerA11yLabel={a11yLabelVA(t('errors.somethingWentWrong'))}
          description={t('veteranStatus.error.generic')}
          descriptionA11yLabel={a11yLabelVA(t('veteranStatus.error.generic'))}
        />
      )
    }
    if (notConfirmedReasonLegacy === 'NOT_TITLE_38') {
      return (
        <AlertWithHaptics
          variant="warning"
          header={t('veteranStatus.error.notTitle38.title')}
          headerA11yLabel={a11yLabelVA(t('veteranStatus.error.notTitle38.title'))}
          description={t('veteranStatus.error.notTitle38.body1')}
          descriptionA11yLabel={a11yLabelVA(t('veteranStatus.error.notTitle38.body1'))}>
          <TextView accessible accessibilityLabel={t('veteranStatus.error.notTitle38.body2')}>
            {t('veteranStatus.error.notTitle38.body2')}
          </TextView>
          <ClickToCallPhoneNumber
            a11yLabel={a11yLabelID(t('8005389552'))}
            displayedText={displayedTextPhoneNumber(t('8005389552'))}
            phone={t('8005389552')}
          />
        </AlertWithHaptics>
      )
    }
    return (
      <AlertWithHaptics
        variant="warning"
        header={t('veteranStatus.error.catchAll.title')}
        headerA11yLabel={a11yLabelVA(t('veteranStatus.error.catchAll.title'))}
        description={t('veteranStatus.error.catchAll.body')}
        descriptionA11yLabel={a11yLabelVA(t('veteranStatus.error.catchAll.body'))}>
        <ClickToCallPhoneNumber
          a11yLabel={a11yLabelID(t('8005389552'))}
          displayedText={displayedTextPhoneNumber(t('8005389552'))}
          phone={t('8005389552')}
        />
      </AlertWithHaptics>
    )
  }

  const getLatestPeriodOfServiceNew = (): React.ReactNode => {
    if (!vscCard) return null

    const latestService = vscCard.attributes.latestService
    if (!latestService?.beginDate || !latestService?.endDate || !latestService?.branch) return null

    const beginYear = latestService.beginDate.slice(0, 4)
    const endYear = latestService.endDate.slice(0, 4)

    const visibleText = t('militaryInformation.combined.history', {
      branch: latestService.branch,
      begin: beginYear,
      end: endYear,
    })

    const a11yLabel = t('militaryInformation.combined.historyA11yLabel', {
      branch: latestService.branch,
      begin: beginYear,
      end: endYear,
    })

    return (
      <TextView
        variant="MobileBody"
        color="primaryContrast"
        testID="veteranStatusMilitaryServiceTestID"
        accessibilityLabel={a11yLabel}>
        {visibleText}
      </TextView>
    )
  }

  const getErrorNew = () => {
    // If we don't have an alert payload (or the call silently returned nothing),
    // show a safe generic error instead of rendering nothing.
    if (!vscAlert) {
      return (
        <AlertWithHaptics
          variant="warning"
          header={t('errors.somethingWentWrong')}
          headerA11yLabel={a11yLabelVA(t('errors.somethingWentWrong'))}
          description={t('veteranStatus.error.generic')}
          descriptionA11yLabel={a11yLabelVA(t('veteranStatus.error.generic'))}
        />
      )
    }

    const { header, body, alertType } = vscAlert.attributes
    const variant = alertType === 'error' ? 'warning' : 'warning'

    return (
      <AlertWithHaptics variant={variant} header={header} headerA11yLabel={a11yLabelVA(header)}>
        {body?.map((row, idx) => {
          if (row.type === 'text') {
            return (
              <TextView key={idx} variant="MobileBody">
                {row.value}
              </TextView>
            )
          }

          if (row.type === 'phone') {
            return (
              <ClickToCallPhoneNumber
                key={idx}
                a11yLabel={a11yLabelID(row.value)}
                displayedText={displayedTextPhoneNumber(row.value)}
                phone={row.value}
              />
            )
          }

          // link (placeholder until you wire up navigation/openURL)
          return (
            <TextView key={idx} variant="MobileBody" color="link">
              {row.value}
            </TextView>
          )
        })}
      </AlertWithHaptics>
    )
  }

  const getHelperText = () => {
    return (
      <Box style={containerStyle} my={24} px={horizontalPadding} width="100%">
        <TextView variant="MobileBodyTightBold" color="primary" accessibilityRole="header" mb={12}>
          {t('veteranStatus.about')}
        </TextView>
        <TextView variant="MobileBody" color="bodyText" mb={24}>
          {t('veteranStatus.uniformedServices')}
        </TextView>

        {shouldShowFixAnErrorSection ? (
          <>
            <TextView variant="MobileBodyTightBold" color="primary" accessibilityRole="header" mb={12}>
              {t('veteranStatus.fixAnError')}
            </TextView>
            <TextView variant="MobileBody" color="bodyText" mb={16}>
              {t('veteranStatus.fixAnError.2')}
            </TextView>
            <ClickToCallPhoneNumber
              a11yLabel={a11yLabelID(t('8008271000'))}
              displayedText={displayedTextPhoneNumber(t('8008271000'))}
              phone={t('8008271000')}
            />
            <TextView variant="MobileBody" color="bodyText" mt={16} mb={16}>
              {t('veteranStatus.fixAnError.3')}
            </TextView>
            <ClickToCallPhoneNumber
              a11yLabel={a11yLabelID(t('8005389552'))}
              displayedText={displayedTextPhoneNumber(t('8005389552'))}
              phone={t('8005389552')}
            />
          </>
        ) : null}
      </Box>
    )
  }

  return (
    <LargePanel
      title={t('veteranStatus.title')}
      rightButtonText={t('close')}
      dividerMarginBypass={true}
      testID="veteranStatusTestID"
      rightButtonTestID="veteranStatusCloseID">
      {isLoading ? (
        <LoadingComponent />
      ) : showError ? (
        <>{isNewVSCCardAllowed ? getErrorNew() : getErrorLegacy()}</>
      ) : (
        <WaygateWrapper waygateName="WG_VeteranStatusCard">
          <VeteranStatusCard
            fullName={isNewVSCCardAllowed ? vscCard?.attributes.fullName : personalInfo?.fullName}
            edipi={isNewVSCCardAllowed ? vscCard?.attributes.edipi : personalInfo?.edipi}
            branch={isNewVSCCardAllowed ? branchNew : branchLegacy}
            percentText={isNewVSCCardAllowed ? percentTextNew : percentTextLegacy}
            getLatestPeriodOfService={
              isNewVSCCardAllowed ? getLatestPeriodOfServiceNew : getLatestPeriodOfServiceLegacy
            }
          />
        </WaygateWrapper>
      )}
      {getHelperText()}
    </LargePanel>
  )
}

export default VeteranStatusScreen

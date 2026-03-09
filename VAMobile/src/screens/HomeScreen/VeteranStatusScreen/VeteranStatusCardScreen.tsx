import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

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
import { deriveVscStatus } from 'utils/veteranStatusCard'
import { screenContentAllowed } from 'utils/waygateConfig'

const LANDSCAPE_PADDING = 44
const PORTRAIT_PADDING = 18
const MAX_WIDTH = 672

type VSCAlertBodyRow =
  | { type: 'text'; value: string }
  | { type: 'phone'; value: string; tty?: boolean }
  | { type: 'link'; value: string; url: string }

type VeteranStatusCardScreenProps = StackScreenProps<HomeStackParamList, 'VeteranStatus'>

function VeteranStatusCardScreen({ navigation }: VeteranStatusCardScreenProps) {
  const isCardAllowedByWaygate = screenContentAllowed('WG_VeteranStatusCard')

  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()
  const horizontalPadding = isPortrait ? PORTRAIT_PADDING : LANDSCAPE_PADDING
  const containerStyle = !isPortrait ? { alignSelf: 'center' as const, maxWidth: MAX_WIDTH } : {}
  const registerReviewEvent = useReviewEvent(true)

  const {
    data: vscPayload,
    isError: isVeteranStatusCardError,
    error: veteranStatusCardError,
    isLoading: isVeteranStatusCardLoading,
    isSuccess: isVeteranStatusCardSuccess,
    httpStatus,
  } = useVeteranStatusCard({
    enabled: isCardAllowedByWaygate,
  })

  const isFocused = useIsFocused()

  const shouldLogStatusRef = useRef(false)
  const didLogStatusRef = useRef(false)

  const shouldLogErrorShownRef = useRef(false)
  const didLogErrorShownRef = useRef(false)

  const errorType = useMemo(() => {
    if (isVeteranStatusCardError) {
      const statusCode = httpStatus ?? (veteranStatusCardError as { status?: number } | null)?.status
      return `HTTP_ERROR_${statusCode ?? 'UNKNOWN'}`
    }

    const attrs = vscPayload?.attributes
    return attrs?.notConfirmedReason ?? attrs?.confirmation_status ?? 'UNKNOWN'
  }, [isVeteranStatusCardError, httpStatus, veteranStatusCardError, vscPayload])

  const vscCard = vscPayload?.type === 'veteran_status_card' ? vscPayload : undefined
  const vscAlert = vscPayload?.type === 'veteran_status_alert' ? vscPayload : undefined

  const isLoading = isCardAllowedByWaygate && isVeteranStatusCardLoading
  const showError = isCardAllowedByWaygate && !isLoading && (isVeteranStatusCardError || !!vscAlert || !vscCard)

  const ratingPercent = vscCard?.attributes?.disabilityRating ?? undefined
  const ratingIsDefined = isValidDisabilityRating(ratingPercent)
  const percentText = ratingIsDefined ? t('disabilityRating.percent', { combinedPercent: ratingPercent }) : undefined

  const shouldShowCard = isCardAllowedByWaygate && !showError && !!vscCard
  const shouldShowFixAnErrorSection = shouldShowCard

  useBeforeNavBackListener(navigation, () => {
    registerReviewEvent()
  })

  useFocusEffect(
    useCallback(() => {
      shouldLogStatusRef.current = true
      didLogStatusRef.current = false

      shouldLogErrorShownRef.current = true
      didLogErrorShownRef.current = false
      return () => {}
    }, []),
  )

  useEffect(() => {
    if (!isFocused) return
    if (!isCardAllowedByWaygate) return
    if (!shouldLogStatusRef.current || didLogStatusRef.current) return
    if (isVeteranStatusCardLoading) return

    if (isVeteranStatusCardSuccess && vscPayload) {
      const status = deriveVscStatus(vscPayload) ?? 'UNKNOWN_REASON'
      logAnalyticsEvent(Events.vama_vsc_status(status))
      didLogStatusRef.current = true
      shouldLogStatusRef.current = false
      return
    }

    if (isVeteranStatusCardError) {
      const statusCode = httpStatus ?? (veteranStatusCardError as { status?: number } | null)?.status
      logAnalyticsEvent(Events.vama_vsc_status(`HTTP_ERROR_${statusCode ?? 'UNKNOWN'}`))
      didLogStatusRef.current = true
      shouldLogStatusRef.current = false
    }
  }, [
    isFocused,
    isCardAllowedByWaygate,
    isVeteranStatusCardLoading,
    isVeteranStatusCardSuccess,
    vscPayload,
    isVeteranStatusCardError,
    httpStatus,
    veteranStatusCardError,
  ])

  useEffect(() => {
    if (!isFocused) return
    if (isCardAllowedByWaygate) return
    logAnalyticsEvent(Events.vama_vsc_error_shown('VETERAN_STATUS_CARD_BLOCKED_BY_WAYGATE'))
  }, [isFocused, isCardAllowedByWaygate])

  useEffect(() => {
    if (!isFocused) return
    if (!shouldLogErrorShownRef.current || didLogErrorShownRef.current) return
    if (!showError) return

    logAnalyticsEvent(Events.vama_vsc_error_shown(errorType))
    didLogErrorShownRef.current = true
    shouldLogErrorShownRef.current = false
  }, [isFocused, showError, errorType])

  const getError = () => {
    if (!vscAlert) {
      return (
        <AlertWithHaptics
          variant="error"
          header={t('errors.somethingWentWrong')}
          headerA11yLabel={a11yLabelVA(t('errors.somethingWentWrong'))}
          description={t('veteranStatus.error.generic.updated')}
          descriptionA11yLabel={a11yLabelVA(t('veteranStatus.error.generic.updated'))}
        />
      )
    }

    const { header, body, alertType } = vscAlert.attributes

    return (
      <AlertWithHaptics variant={alertType} header={header} headerA11yLabel={a11yLabelVA(header)}>
        {body?.map((row: VSCAlertBodyRow, idx: number) => {
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
        <>{getError()}</>
      ) : (
        <WaygateWrapper waygateName="WG_VeteranStatusCard">
          <VeteranStatusCard
            fullName={vscCard?.attributes.fullName}
            edipi={vscCard?.attributes.edipi}
            percentText={percentText}
            getLatestPeriodOfService={undefined}
            showLatestPeriodOfService={false}
          />
        </WaygateWrapper>
      )}

      {getHelperText()}
    </LargePanel>
  )
}

export default VeteranStatusCardScreen

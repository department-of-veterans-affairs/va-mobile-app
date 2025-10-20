import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useDisabilityRating } from 'api/disabilityRating'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BranchOfService, ServiceHistoryData } from 'api/types'
import { useVeteranStatus } from 'api/veteranStatus'
import { VeteranPassPayload } from 'api/wallet'
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
import AppleWalletButton from 'screens/HomeScreen/VeteranStatusScreen/AddToWalletButton/AppleWalletButton'
import VeteranStatusCard from 'screens/HomeScreen/VeteranStatusScreen/VeteranStatusCard/VeteranStatusCard'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { isValidDisabilityRating } from 'utils/claims'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useBeforeNavBackListener, useOrientation } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'
import { screenContentAllowed } from 'utils/waygateConfig'

// import PhotoUpload from 'components/PhotoUpload'

const LANDSCAPE_PADDING = 44
const PORTRAIT_PADDING = 18
const MAX_WIDTH = 672

type VeteranStatusScreenProps = StackScreenProps<HomeStackParamList, 'VeteranStatus'>

function VeteranStatusScreen({ navigation }: VeteranStatusScreenProps) {
  const isCardAllowed = screenContentAllowed('WG_VeteranStatusCard')
  const { data: militaryServiceHistoryAttributes, isLoading: isServiceHistoryLoading } = useServiceHistory()
  const serviceHistory = militaryServiceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)
  const mostRecentBranch = militaryServiceHistoryAttributes?.mostRecentBranch
  const { data: ratingData, isLoading: isDisabilityRatingLoading } = useDisabilityRating()
  const { data: personalInfo } = usePersonalInformation()
  const {
    data: veteranStatus,
    isError,
    isLoading: isVeteranStatusLoading,
  } = useVeteranStatus({
    enabled: isCardAllowed,
  })
  const isVSCLoading = isServiceHistoryLoading || isDisabilityRatingLoading || isVeteranStatusLoading
  const registerReviewEvent = useReviewEvent(true)
  const veteranStatusConfirmed = veteranStatus?.data?.attributes?.veteranStatus === 'confirmed'
  const showError = !isVSCLoading && (!veteranStatusConfirmed || (veteranStatusConfirmed && !serviceHistory.length))
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()
  const ratingPercent = ratingData?.combinedDisabilityRating
  const ratingIsDefined = isValidDisabilityRating(ratingPercent)
  const percentText = ratingIsDefined ? t('disabilityRating.percent', { combinedPercent: ratingPercent }) : undefined
  const branch = mostRecentBranch || ('' as BranchOfService)
  const horizontalPadding = isPortrait ? PORTRAIT_PADDING : LANDSCAPE_PADDING
  const containerStyle = !isPortrait ? { alignSelf: 'center' as const, maxWidth: MAX_WIDTH } : {}

  useBeforeNavBackListener(navigation, () => {
    registerReviewEvent()
  })

  useEffect(() => {
    if (!isCardAllowed) {
      const message = 'VETERAN_STATUS_CARD_BLOCKED_BY_WAYGATE'
      logAnalyticsEvent(Events.vama_vsc_error_shown(message))
    }
  }, [isCardAllowed])

  useEffect(() => {
    if (!showError) return

    const notConfirmedReason = veteranStatus?.data?.attributes?.notConfirmedReason
    const message = notConfirmedReason ?? 'MISSING_SERVICE_HISTORY'
    logAnalyticsEvent(Events.vama_vsc_error_shown(message))
  }, [showError, veteranStatus])

  const getLatestPeriodOfService = (): React.ReactNode => {
    if (!serviceHistory || serviceHistory.length === 0) {
      return null
    }

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
          // eslint-disable-next-line react-native-a11y/has-accessibility-hint
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

  const getError = () => {
    const notConfirmedReason = veteranStatus?.data?.attributes?.notConfirmedReason

    if (isError || notConfirmedReason === 'ERROR') {
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
    if (notConfirmedReason === 'NOT_TITLE_38') {
      return (
        <AlertWithHaptics
          variant="warning"
          header={t('veteranStatus.error.notTitle38.title')}
          headerA11yLabel={a11yLabelVA(t('veteranStatus.error.notTitle38.title'))}
          description={t('veteranStatus.error.notTitle38.body1')}
          descriptionA11yLabel={a11yLabelVA(t('veteranStatus.error.notTitle38.body1'))}>
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView accessibilityLabel={t('veteranStatus.error.notTitle38.body2')}>
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

  const getHelperText = () => {
    return (
      <Box style={containerStyle} my={24} px={horizontalPadding} width="100%">
        <TextView variant="MobileBodyTightBold" color="primary" accessibilityRole="header" mb={12}>
          {t('veteranStatus.about')}
        </TextView>
        <TextView variant="MobileBody" color="bodyText" mb={24}>
          {t('veteranStatus.uniformedServices')}
        </TextView>
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
      </Box>
    )
  }

  const passPayload: VeteranPassPayload | undefined = personalInfo?.fullName
    ? {
        name: personalInfo.fullName,
        id: personalInfo?.edipi ?? 'V00000000',
        disability_percent: ratingIsDefined ? Number(ratingPercent) : undefined,
        as_of_date: new Date().toISOString().slice(0, 10),
      }
    : undefined

  return (
    <LargePanel
      title={t('veteranStatus.title')}
      rightButtonText={t('close')}
      dividerMarginBypass={true}
      testID="veteranStatusTestID"
      rightButtonTestID="veteranStatusCloseID">
      {isVSCLoading ? (
        <LoadingComponent />
      ) : showError ? (
        <>{getError()}</>
      ) : (
        <>
          <WaygateWrapper waygateName="WG_VeteranStatusCard">
            <VeteranStatusCard
              fullName={personalInfo?.fullName}
              edipi={personalInfo?.edipi}
              branch={branch}
              percentText={percentText}
              getLatestPeriodOfService={getLatestPeriodOfService}
            />
          </WaygateWrapper>
        </>
      )}
      {passPayload && (
        <Box mt={16} px={horizontalPadding} style={containerStyle} width="100%">
          <AppleWalletButton payload={passPayload} />
        </Box>
      )}
      {getHelperText()}
    </LargePanel>
  )
}

export default VeteranStatusScreen

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { colors } from '@department-of-veterans-affairs/mobile-tokens'
import { map } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useDisabilityRating } from 'api/disabilityRating'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BranchOfService, ServiceData, ServiceHistoryData } from 'api/types'
import { useVeteranStatus } from 'api/veteranStatus'
import {
  AlertWithHaptics,
  BackgroundVariant,
  BorderColorVariant,
  Box,
  BoxProps,
  ClickToCallPhoneNumber,
  ClickToCallPhoneNumberDeprecated,
  LargePanel,
  MilitaryBranchEmblem,
  TextView,
  VALogo,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useOrientation, useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'
import { featureEnabled } from 'utils/remoteConfig'

import { isValidDisabilityRating } from '../../../utils/claims'
import { displayedTextPhoneNumber } from '../../../utils/formattingUtils'
import VeteranStatusCard from './VeteranStatusCard/VeteranStatusCard'

// import PhotoUpload from 'components/PhotoUpload'

const LANDSCAPE_PADDING = 44
const PORTRAIT_PADDING = 18
const MAX_WIDTH = 672

type VeteranStatusScreenProps = StackScreenProps<HomeStackParamList, 'VeteranStatus'>

function VeteranStatusScreen({ navigation }: VeteranStatusScreenProps) {
  const { data: militaryServiceHistoryAttributes } = useServiceHistory()
  const serviceHistory = militaryServiceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)
  const mostRecentBranch = militaryServiceHistoryAttributes?.mostRecentBranch
  const { data: ratingData } = useDisabilityRating()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: personalInfo } = usePersonalInformation()
  const { data: veteranStatus, isError } = useVeteranStatus({ enabled: false })
  const registerReviewEvent = useReviewEvent(true)
  const accessToMilitaryInfo = userAuthorizedServices?.militaryServiceHistory && serviceHistory.length > 0
  const veteranStatusConfirmed = veteranStatus?.data?.attributes?.veteranStatus === 'confirmed'
  const showError = !veteranStatusConfirmed || (veteranStatusConfirmed && !serviceHistory.length)
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()
  const ratingPercent = ratingData?.combinedDisabilityRating
  const ratingIsDefined = isValidDisabilityRating(ratingPercent)
  const percentText = ratingIsDefined ? t('disabilityRating.percent', { combinedPercent: ratingPercent }) : undefined
  const combinedPercentText = ratingIsDefined
    ? t('disabilityRating.combinePercent', { combinedPercent: ratingPercent })
    : undefined
  const branch = mostRecentBranch || ('' as BranchOfService)
  const horizontalPadding = isPortrait ? PORTRAIT_PADDING : LANDSCAPE_PADDING
  const containerStyle = !isPortrait ? { alignSelf: 'center' as const, maxWidth: MAX_WIDTH } : {}
  const isVSCFeatureEnabled = featureEnabled('veteranStatusCardRedesign')
  const shouldRemoveInsets = isVSCFeatureEnabled ? false : !showError

  useBeforeNavBackListener(navigation, () => {
    registerReviewEvent()
  })

  useEffect(() => {
    if (!showError) return

    const notConfirmedReason = veteranStatus?.data?.attributes?.notConfirmedReason
    const message = notConfirmedReason ?? 'MISSING_SERVICE_HISTORY'
    logAnalyticsEvent(Events.vama_vsc_error_shown(message))
  }, [showError, veteranStatus])

  const getPeriodOfService: React.ReactNode = map(serviceHistory, (service: ServiceData) => {
    const branchOfService = t('militaryInformation.branch', { branch: service.branchOfService })
    return (
      <Box>
        <Box display="flex" flexDirection="row" alignItems="center" mt={theme.dimensions.condensedMarginBetween}>
          <TextView variant="MobileBody" color="primaryContrast">
            {branchOfService}
          </TextView>
        </Box>
        <Box>
          <TextView variant="HelperText" color="primaryContrast" mb={theme.dimensions.condensedMarginBetween}>
            {t('militaryInformation.history', { begin: service.formattedBeginDate, end: service.formattedEndDate })}
          </TextView>
        </Box>
      </Box>
    )
  })

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
          variant="error"
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

  const boxProps: BoxProps = {
    minHeight: 81,
    borderRadius: 6,
    pt: theme.dimensions.cardPadding,
    pb: theme.dimensions.cardPadding,
    backgroundColor: theme.colors.background.veteranStatus as BackgroundVariant,
    borderTopWidth: theme.dimensions.borderWidth,
    borderColor: theme.colors.border.veteranStatus as BorderColorVariant,
    borderStyle: 'solid',
  }

  return (
    <LargePanel
      title={t('veteranStatus.title')}
      rightButtonText={t('close')}
      dividerMarginBypass={true}
      removeInsets={shouldRemoveInsets}
      testID="veteranStatusTestID"
      rightButtonTestID="veteranStatusCloseID">
      {showError ? (
        <>
          {getError()}
          {isVSCFeatureEnabled && getHelperText()}
        </>
      ) : isVSCFeatureEnabled ? (
        <>
          <VeteranStatusCard
            fullName={personalInfo?.fullName}
            edipi={personalInfo?.edipi}
            branch={branch}
            percentText={percentText}
            getLatestPeriodOfService={getLatestPeriodOfService}
          />
          {getHelperText()}
        </>
      ) : (
        <>
          <Box
            mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}
            alignItems="center"
            mt={theme.dimensions.standardMarginBetween}>
            <VALogo variant="dark" testID="VeteranStatusCardVAIcon" />
            {/* <Box my={theme.dimensions.standardMarginBetween}>
      //TODO: Put back PhotoUpload later after concerns have been met
        <PhotoUpload width={100} height={100} />
      </Box> */}
            <Box my={theme.dimensions.formMarginBetween}>
              <TextView
                textTransform="capitalize"
                mb={theme.dimensions.textIconMargin}
                variant="BitterBoldHeading"
                color="primaryContrast"
                testID="veteranStatusFullNameTestID"
                accessibilityRole="header">
                {personalInfo?.fullName}
              </TextView>
              {accessToMilitaryInfo && (
                <Box display="flex" flexDirection="row" flexWrap="wrap">
                  <MilitaryBranchEmblem
                    testID="veteranStatusCardBranchEmblem"
                    branch={branch}
                    width={34}
                    height={34}
                    variant="dark"
                  />
                  <TextView ml={10} variant="MobileBody" color="primaryContrast" testID="veteranStatusBranchTestID">
                    {branch}
                  </TextView>
                </Box>
              )}
            </Box>
          </Box>
          <Box mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
            {ratingIsDefined && (
              <Box {...boxProps}>
                <TextView variant="MobileBodyBold" color="primaryContrast" accessibilityRole="header">
                  {t('disabilityRating.title')}
                </TextView>
                <TextView variant="MobileBody" color="primaryContrast" testID="veteranStatusDisabilityRatingTestID">
                  {combinedPercentText}
                </TextView>
              </Box>
            )}
            <Box {...boxProps} borderBottomWidth={personalInfo?.edipi ? 0 : theme.dimensions.borderWidth}>
              <TextView variant="MobileBodyBold" color="primaryContrast" accessibilityRole="header">
                {t('veteranStatus.periodOfService')}
              </TextView>
              {getPeriodOfService}
            </Box>
            {personalInfo?.edipi && (
              <Box {...boxProps} borderBottomWidth={theme.dimensions.borderWidth}>
                <TextView variant="MobileBodyBold" color="primaryContrast" accessibilityRole="header">
                  {t('veteranStatus.dodIdNumber')}
                </TextView>
                <TextView variant="MobileBody" color="primaryContrast" testID="veteranStatusDODTestID">
                  {personalInfo?.edipi}
                </TextView>
              </Box>
            )}
            <Box my={theme.dimensions.formMarginBetween}>
              <TextView variant="MobileBody" color="primaryContrast" mb={theme.dimensions.formMarginBetween}>
                {t('veteranStatus.old.uniformedServices')}
              </TextView>
              <TextView variant="MobileBodyBold" color="primaryContrast" accessibilityRole="header">
                {t('veteranStatus.fixAnError')}
              </TextView>
              <TextView variant="MobileBody" color="primaryContrast" mb={theme.dimensions.condensedMarginBetween}>
                {t('veteranStatus.fixAnError.2')}
              </TextView>
              <ClickToCallPhoneNumberDeprecated
                phone={t('8008271000')}
                displayedText={displayedTextPhoneNumber(t('8008271000'))}
                colorOverride={'veteranStatus'}
                iconColorOverride={colors.vadsColorWhite}
              />
              <TextView variant="MobileBody" color="primaryContrast" my={theme.dimensions.condensedMarginBetween}>
                {t('veteranStatus.fixAnError.3')}
              </TextView>
              <ClickToCallPhoneNumberDeprecated
                phone={t('8005389552')}
                displayedText={displayedTextPhoneNumber(t('8005389552'))}
                colorOverride={'veteranStatus'}
                iconColorOverride={colors.vadsColorWhite}
                ttyBypass={true}
              />
            </Box>
          </Box>
        </>
      )}
    </LargePanel>
  )
}

export default VeteranStatusScreen

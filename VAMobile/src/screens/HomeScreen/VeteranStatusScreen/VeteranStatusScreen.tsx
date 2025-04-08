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

import { displayedTextPhoneNumber } from '../../../utils/formattingUtils'

// import PhotoUpload from 'components/PhotoUpload'

type VeteranStatusScreenProps = StackScreenProps<HomeStackParamList, 'VeteranStatus'>

function VeteranStatusScreen({ navigation }: VeteranStatusScreenProps) {
  const { data: militaryServiceHistoryAttributes } = useServiceHistory()
  const serviceHistory = militaryServiceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)
  const mostRecentBranch = militaryServiceHistoryAttributes?.mostRecentBranch
  const { data: ratingData } = useDisabilityRating()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: personalInfo } = usePersonalInformation()
  const { data: veteranStatus } = useVeteranStatus()
  const registerReviewEvent = useReviewEvent(true)
  const accessToMilitaryInfo = userAuthorizedServices?.militaryServiceHistory && serviceHistory.length > 0
  const veteranStatusConfirmed = veteranStatus?.data.attributes.veteranStatus === 'confirmed'
  const showError = !veteranStatusConfirmed || (veteranStatusConfirmed && !serviceHistory.length)
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()
  const ratingPercent = ratingData?.combinedDisabilityRating
  const ratingIsDefined = ratingPercent !== undefined && ratingPercent !== null
  const combinedPercentText = ratingIsDefined
    ? t('disabilityRating.combinePercent', { combinedPercent: ratingPercent })
    : undefined
  const branch = mostRecentBranch || ('' as BranchOfService)

  useBeforeNavBackListener(navigation, () => {
    registerReviewEvent()
  })

  useEffect(() => {
    if (showError) {
      logAnalyticsEvent(Events.vama_vsc_error_shown(veteranStatus!.data.attributes.notConfirmedReason))
    }
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
          <TextView
            variant="HelperText"
            color="primaryContrast"
            mb={theme.dimensions.condensedMarginBetween}
            testID="veteranStatusMilitaryServiceTestID">
            {t('militaryInformation.history', { begin: service.formattedBeginDate, end: service.formattedEndDate })}
          </TextView>
        </Box>
      </Box>
    )
  })

  const getError = () => {
    const notConfirmedReason = veteranStatus!.data.attributes.notConfirmedReason

    if (notConfirmedReason === 'NOT_TITLE_38') {
      return (
        <AlertWithHaptics
          variant="warning"
          header={t('veteranStatus.error.notTitle38.title')}
          headerA11yLabel={a11yLabelVA(t('veteranStatus.error.notTitle38.title'))}
          description={t('veteranStatus.error.notTitle38.body1')}
          descriptionA11yLabel={a11yLabelVA(t('veteranStatus.error.notTitle38.body1'))}>
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
    if (notConfirmedReason === 'ERROR') {
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
      removeInsets={!showError}
      testID="veteranStatusTestID"
      rightButtonTestID="veteranStatusCloseID">
      {showError ? (
        getError()
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
                {t('veteranStatus.uniformedServices')}
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

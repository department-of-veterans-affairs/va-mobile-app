import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useDisabilityRating } from 'api/disabilityRating'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BranchesOfServiceConstants, ServiceData, ServiceHistoryData } from 'api/types'
import {
  BackgroundVariant,
  BorderColorVariant,
  Box,
  BoxProps,
  ClickToCallPhoneNumberDeprecated,
  LargePanel,
  TextView,
  VAIcon,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useOrientation, useTheme } from 'utils/hooks'

import { displayedTextPhoneNumber } from '../../../utils/formattingUtils'

// import PhotoUpload from 'components/PhotoUpload'

type VeteranStatusScreenProps = StackScreenProps<HomeStackParamList, 'VeteranStatus'>

function VeteranStatusScreen({}: VeteranStatusScreenProps) {
  const { data: militaryServiceHistoryAttributes } = useServiceHistory()
  const serviceHistory = militaryServiceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)
  const mostRecentBranch = militaryServiceHistoryAttributes?.mostRecentBranch
  const { data: ratingData } = useDisabilityRating()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: personalInfo } = usePersonalInformation()
  const accessToMilitaryInfo = userAuthorizedServices?.militaryServiceHistory && serviceHistory.length > 0
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()
  const ratingPercent = ratingData?.combinedDisabilityRating
  const ratingIsDefined = ratingPercent !== undefined && ratingPercent !== null
  const combinedPercentText = ratingIsDefined
    ? t('disabilityRating.combinePercent', { combinedPercent: ratingPercent })
    : undefined

  const getPeriodOfService: React.ReactNode = map(serviceHistory, (service: ServiceData) => {
    const branch = t('militaryInformation.branch', { branch: service.branchOfService })
    return (
      <Box>
        <Box display="flex" flexDirection="row" alignItems="center" mt={theme.dimensions.condensedMarginBetween}>
          <TextView variant="MobileBody" color="primaryContrast">
            {branch}
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

  const branch = mostRecentBranch || ''

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

  const getBranchSeal = (): React.ReactNode => {
    const dimensions = {
      width: 34,
      height: 34,
    }

    switch (branch) {
      case BranchesOfServiceConstants.AirForce:
        return <VAIcon testID="VeteranStatusUSAFIconTestID" name="AirForce" {...dimensions} />
      case BranchesOfServiceConstants.Army:
        return <VAIcon testID="VeteranStatusUSArmyIconTestID" name="Army" {...dimensions} />
      case BranchesOfServiceConstants.CoastGuard:
        return <VAIcon testID="VeteranStatusUSCoastGuardTestID" name="CoastGuard" {...dimensions} />
      case BranchesOfServiceConstants.MarineCorps:
        return <VAIcon testID="VeteranStatusUSMarineTestID" name="MarineCorps" {...dimensions} />
      case BranchesOfServiceConstants.Navy:
        return <VAIcon testID="VeteranStatusUSNavyTestID" name="Navy" {...dimensions} />
    }
  }

  return (
    <LargePanel
      title={t('veteranStatus.title')}
      rightButtonText={t('close')}
      dividerMarginBypass={true}
      removeInsets={true}
      testID="veteranStatusTestID">
      <Box
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}
        alignItems="center"
        mt={theme.dimensions.standardMarginBetween}>
        <VAIcon testID="VeteranStatusCardVAIcon" name={'Logo'} />
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
            testID="veteranStatusFullNameTestID">
            {personalInfo?.fullName}
          </TextView>
          {accessToMilitaryInfo && (
            <Box display="flex" flexDirection="row">
              {getBranchSeal()}
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
            <TextView variant="MobileBodyBold" color="primaryContrast">
              {t('disabilityRating.title')}
            </TextView>
            <TextView variant="MobileBody" color="primaryContrast" testID="veteranStatusDisabilityRatingTestID">
              {combinedPercentText}
            </TextView>
          </Box>
        )}
        <Box {...boxProps}>
          <TextView variant="MobileBodyBold" color="primaryContrast">
            {t('veteranStatus.periodOfService')}
          </TextView>
          {getPeriodOfService}
        </Box>
        <Box {...boxProps} borderBottomWidth={theme.dimensions.borderWidth} mb={theme.dimensions.formMarginBetween}>
          <TextView variant="MobileBodyBold" color="primaryContrast">
            {t('personalInformation.dateOfBirth')}
          </TextView>
          <TextView variant="MobileBody" color="primaryContrast" testID="veteranStatusDOBTestID">
            {personalInfo?.birthDate || t('personalInformation.informationNotAvailable')}
          </TextView>
        </Box>
        <Box mb={theme.dimensions.formMarginBetween}>
          <TextView variant="MobileBody" color="primaryContrast" mb={theme.dimensions.formMarginBetween}>
            {t('veteranStatus.uniformedServices')}
          </TextView>
          <TextView variant="MobileBodyBold" color="primaryContrast">
            {t('veteranStatus.fixAnError')}
          </TextView>
          <TextView variant="MobileBody" color="primaryContrast" mb={theme.dimensions.condensedMarginBetween}>
            {t('veteranStatus.fixAnError.2')}
          </TextView>
          <ClickToCallPhoneNumberDeprecated
            phone={t('8008271000')}
            displayedText={displayedTextPhoneNumber(t('8008271000'))}
            colorOverride={'veteranStatus'}
          />
          <TextView variant="MobileBody" color="primaryContrast" my={theme.dimensions.condensedMarginBetween}>
            {t('veteranStatus.fixAnError.3')}
          </TextView>
          <ClickToCallPhoneNumberDeprecated
            phone={t('8005389552')}
            displayedText={displayedTextPhoneNumber(t('8005389552'))}
            colorOverride={'veteranStatus'}
            ttyBypass={true}
          />
        </Box>
      </Box>
    </LargePanel>
  )
}

export default VeteranStatusScreen

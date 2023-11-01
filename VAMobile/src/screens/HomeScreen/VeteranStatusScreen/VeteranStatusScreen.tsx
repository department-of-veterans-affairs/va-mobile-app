import { StackScreenProps } from '@react-navigation/stack'
import { map } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { BackgroundVariant, BorderColorVariant, Box, BoxProps, ClickToCallPhoneNumber, LargePanel, TextView, VAIcon } from 'components'
import { BranchesOfServiceConstants, ServiceData } from 'store/api/types'
import { DisabilityRatingState, MilitaryServiceState } from 'store/slices'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { displayedTextPhoneNumber } from '../../../utils/formattingUtils'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { useTheme } from 'utils/hooks'
// import PhotoUpload from 'components/PhotoUpload'

type VeteranStatusScreenProps = StackScreenProps<HomeStackParamList, 'VeteranStatus'>

const VeteranStatusScreen: FC<VeteranStatusScreenProps> = () => {
  const { serviceHistory, mostRecentBranch } = useSelector<RootState, MilitaryServiceState>((state) => state.militaryService)
  const { ratingData } = useSelector<RootState, DisabilityRatingState>((state) => state.disabilityRating)
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: personalInfo } = usePersonalInformation()
  const accessToMilitaryInfo = userAuthorizedServices?.militaryServiceHistory && serviceHistory.length > 0
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const ratingPercent = ratingData?.combinedDisabilityRating
  const ratingIsDefined = ratingPercent !== undefined && ratingPercent !== null
  const combinedPercentText = ratingIsDefined ? t('disabilityRating.combinePercent', { combinedPercent: ratingPercent }) : undefined

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
          <TextView variant="HelperText" color="primaryContrast" mb={theme.dimensions.condensedMarginBetween} testID="veteranStatusMilitaryServiceTestID">
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
    <LargePanel title={t('veteranStatus.title')} rightButtonText={t('close')} dividerMarginBypass={true} testID="veteranStatusTestID">
      <Box backgroundColor={theme.colors.background.veteranStatus as BackgroundVariant} flex={1}>
        <Box mx={theme.dimensions.gutter} alignItems="center" mt={theme.dimensions.standardMarginBetween}>
          <VAIcon testID="VeteranStatusCardVAIcon" name={'Logo'} />
          {/* <Box my={theme.dimensions.standardMarginBetween}>
          //TODO: Put back PhotoUpload later after concerns have been met
            <PhotoUpload width={100} height={100} />
          </Box> */}
          <Box my={theme.dimensions.formMarginBetween}>
            <TextView textTransform="capitalize" mb={theme.dimensions.textIconMargin} variant="BitterBoldHeading" color="primaryContrast" testID="veteranStatusFullNameTestID">
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
        <Box mx={theme.dimensions.gutter}>
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
            <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={displayedTextPhoneNumber(t('8008271000'))} colorOverride={'veteranStatus'} />
            <TextView variant="MobileBody" color="primaryContrast" my={theme.dimensions.condensedMarginBetween}>
              {t('veteranStatus.fixAnError.3')}
            </TextView>
            <ClickToCallPhoneNumber phone={t('8005389552')} displayedText={displayedTextPhoneNumber(t('8005389552'))} colorOverride={'veteranStatus'} ttyBypass={true} />
          </Box>
        </Box>
      </Box>
    </LargePanel>
  )
}

export default VeteranStatusScreen

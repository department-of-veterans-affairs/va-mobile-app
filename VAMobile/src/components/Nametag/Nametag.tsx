import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, PressableProps } from 'react-native'
import { useSelector } from 'react-redux'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BackgroundVariant, BorderColorVariant, Box, TextView, VAIcon } from 'components'
import { UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { BranchesOfServiceConstants } from 'store/api/types'
import { DisabilityRatingState, LettersState, MilitaryServiceState } from 'store/slices'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { roundToHundredthsPlace } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

interface NametagProps {
  /** string for differentiating visual design between home/profile */
  screen: string
}

export const Nametag: FC<NametagProps> = ({ screen }: NametagProps) => {
  const { mostRecentBranch, serviceHistory } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const { ratingData } = useSelector<RootState, DisabilityRatingState>((state) => state.disabilityRating)
  const { letterBeneficiaryData } = useSelector<RootState, LettersState>((state) => state.letters)
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: personalInfo } = usePersonalInformation()
  const accessToMilitaryInfo = userAuthorizedServices?.militaryServiceHistory && serviceHistory.length > 0
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const fullName = personalInfo?.fullName
  const branch = mostRecentBranch || ''
  const disRating = !!ratingData?.combinedDisabilityRating
  const monthlyPay = !!letterBeneficiaryData?.benefitInformation.monthlyAwardAmount
  const homeScreen = screen === 'Home'
  const profileScreen = screen === 'Profile'

  useEffect(() => {
    if (personalInfo) {
      setAnalyticsUserProperty(
        UserAnalytics.vama_cerner_transition(personalInfo.hasFacilityTransitioningToCerner || false),
      )
    }
  }, [personalInfo])

  let showVeteranStatus = false
  serviceHistory.forEach((service) => {
    if (service.honorableServiceIndicator === 'Y') {
      showVeteranStatus = true
    }
  })

  const getBranchSeal = (): React.ReactNode => {
    const dimensions = {
      width: homeScreen ? 40 : 50,
      height: homeScreen ? 40 : 50,
    }

    switch (branch) {
      case BranchesOfServiceConstants.AirForce:
        return <VAIcon testID="United States Air Force" name="AirForce" {...dimensions} />
      case BranchesOfServiceConstants.Army:
        return <VAIcon testID="United States Army" name="Army" {...dimensions} />
      case BranchesOfServiceConstants.CoastGuard:
        return <VAIcon testID="United States Coast Guard" name="CoastGuard" {...dimensions} />
      case BranchesOfServiceConstants.MarineCorps:
        return <VAIcon testID="United States Marine Corps" name="MarineCorps" {...dimensions} />
      case BranchesOfServiceConstants.Navy:
        return <VAIcon testID="United States Navy" name="Navy" {...dimensions} />
    }
  }

  const pressableProps: PressableProps = {
    onPress: () => (accessToMilitaryInfo && showVeteranStatus ? navigateTo('VeteranStatus') : undefined),
    accessibilityRole: accessToMilitaryInfo ? 'button' : undefined,
    accessibilityLabel:
      accessToMilitaryInfo && profileScreen
        ? `${fullName} ${branch} ${t('veteranStatus.proofOf')}`
        : accessToMilitaryInfo && homeScreen
          ? `${branch} ${t('veteranStatus.proofOf')}`
          : undefined,
  }

  if (profileScreen) {
    return (
      <Pressable {...pressableProps}>
        <Box
          width="100%"
          backgroundColor={theme.colors.background.veteranStatus as BackgroundVariant}
          minHeight={85}
          display="flex"
          justifyContent="center"
          mb={theme.dimensions.standardMarginBetween}
          pr={theme.dimensions.cardPadding}>
          <Box py={theme.dimensions.cardPadding} display="flex" flexDirection="row">
            {accessToMilitaryInfo && <Box pl={theme.dimensions.cardPadding}>{getBranchSeal()}</Box>}
            <Box ml={theme.dimensions.cardPadding} flex={1}>
              <TextView
                textTransform="capitalize"
                mb={accessToMilitaryInfo ? theme.dimensions.textIconMargin : 0}
                variant="BitterBoldHeading"
                color="primaryContrast">
                {fullName}
              </TextView>
              {accessToMilitaryInfo && (
                <TextView textTransform="capitalize" variant="MobileBodyBold" color="primaryContrast">
                  {branch}
                </TextView>
              )}
              {accessToMilitaryInfo && showVeteranStatus && (
                <Box flexDirection={'row'} alignItems={'center'} mt={theme.dimensions.standardMarginBetween}>
                  <TextView variant="MobileBody" color="primaryContrast" mr={theme.dimensions.textIconMargin}>
                    {t('veteranStatus.proofOf')}
                  </TextView>
                  <VAIcon
                    name={'ChevronRight'}
                    fill={theme.colors.icon.contrast}
                    width={theme.dimensions.chevronListItemWidth}
                    height={theme.dimensions.chevronListItemHeight}
                    mr={theme.dimensions.listItemDecoratorMarginLeft}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Pressable>
    )
  } else if (homeScreen) {
    return (
      <Box>
        <Box>
          {accessToMilitaryInfo && (
            <Pressable {...pressableProps}>
              <Box
                pl={theme.dimensions.buttonPadding}
                backgroundColor={theme.colors.background.veteranStatusHome as BackgroundVariant}
                minHeight={82}
                display="flex"
                justifyContent="center"
                mb={theme.dimensions.standardMarginBetween}
                pr={theme.dimensions.buttonPadding}
                mx={theme.dimensions.condensedMarginBetween}
                borderRadius={8}>
                <Box py={theme.dimensions.buttonPadding} display="flex" flexDirection="row" alignItems="center">
                  {getBranchSeal()}
                  <Box ml={theme.dimensions.buttonPadding} flex={1}>
                    <TextView variant={'VeteranStatusBranch'} pb={4}>
                      {branch}
                    </TextView>
                    {showVeteranStatus && (
                      <Box flexDirection={'row'} alignItems={'center'}>
                        <TextView variant={'VeteranStatusProof'} mr={theme.dimensions.textIconMargin}>
                          {t('veteranStatus.proofOf')}
                        </TextView>
                      </Box>
                    )}
                  </Box>
                  {showVeteranStatus && (
                    <VAIcon
                      name={'ChevronRight'}
                      fill={theme.colors.icon.veteranStatusHomeArrow}
                      width={theme.dimensions.chevronListItemWidth}
                      height={theme.dimensions.chevronListItemHeight}
                      ml={theme.dimensions.listItemDecoratorMarginLeft}
                    />
                  )}
                </Box>
              </Box>
            </Pressable>
          )}
        </Box>
        <Box backgroundColor={theme.colors.background.veteranStatusHome as BackgroundVariant}>
          {disRating && (
            <Box
              pt={theme.dimensions.standardMarginBetween}
              pb={monthlyPay ? 0 : theme.dimensions.standardMarginBetween}
              pl={theme.dimensions.standardMarginBetween}>
              <TextView variant={'VeteranStatusBranch'}>{t('disabilityRating.title')}</TextView>
              <TextView
                variant={
                  'NametagNumber'
                }>{`${t('disabilityRatingDetails.percentage', { rate: ratingData.combinedDisabilityRating })}`}</TextView>
              <TextView variant={'VeteranStatusProof'}>{t('disabilityRating.serviceConnected')}</TextView>
            </Box>
          )}
          {monthlyPay && disRating && (
            <Box
              mx={theme.dimensions.standardMarginBetween}
              my={theme.dimensions.condensedMarginBetween}
              borderWidth={1}
              borderColor={theme.colors.border.aboutYou as BorderColorVariant}
            />
          )}
          {!!letterBeneficiaryData?.benefitInformation.monthlyAwardAmount && (
            <Box pl={theme.dimensions.standardMarginBetween} pb={theme.dimensions.standardMarginBetween}>
              <TextView variant={'VeteranStatusBranch'}>{t('monthlyCompensationPayment')}</TextView>
              <TextView
                variant={
                  'NametagNumber'
                }>{`$${roundToHundredthsPlace(letterBeneficiaryData.benefitInformation.monthlyAwardAmount)}`}</TextView>
            </Box>
          )}
        </Box>
      </Box>
    )
  } else {
    return <></>
  }
}

export default Nametag

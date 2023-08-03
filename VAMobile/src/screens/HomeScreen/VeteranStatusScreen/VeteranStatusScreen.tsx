import { StackScreenProps } from '@react-navigation/stack'
import { map } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, LargePanel, TextArea, TextView, VAIcon } from 'components'
import { BranchesOfServiceConstants, ServiceData } from 'store/api/types'
import { HomeStackParamList } from '../HomeStackScreens'
import { MilitaryServiceState, PersonalInformationState } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { getBirthDate } from '../ProfileScreen/PersonalInformationScreen/PersonalInformationScreen'
import { useHasMilitaryInformationAccess } from 'utils/authorizationHooks'
import { useTheme } from 'utils/hooks'

type VeteranStatusScreenProps = StackScreenProps<HomeStackParamList, 'VeteranStatus'>

const VeteranStatusScreen: FC<VeteranStatusScreenProps> = () => {
  const { profile } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { serviceHistory, mostRecentBranch } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const accessToMilitaryInfo = useHasMilitaryInformationAccess()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const name = (): string => {
    return profile?.fullName || ''
  }

  const getPeriodOfService: React.ReactNode = map(serviceHistory, (service: ServiceData) => {
    const branch = t('militaryInformation.branch', { branch: service.branchOfService })
    const getBranchSeal = (): React.ReactNode => {
      const dimensions = {
        width: 24,
        height: 24,
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
    return (
      <Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          {getBranchSeal()}
          <TextView ml={10} variant="MobileBodyBold" color="primaryContrast">
            {branch}
          </TextView>
        </Box>
        <Box>
          <TextView mb={theme.dimensions.standardMarginBetween}>{t('militaryInformation.history', { begin: service.formattedBeginDate, end: service.formattedEndDate })}</TextView>
        </Box>
      </Box>
    )
    // const textLines: Array<TextLine> = [
    //   {
    //     text: branch,
    //     variant: 'MobileBodyBold',
    //   },
    //   {
    //     text: t('militaryInformation.history', { begin: service.formattedBeginDate, end: service.formattedEndDate }),
    //   },
    // ]
    // return {
    //   textLines,
    //   testId: `${branch} ${t('militaryInformation.historyA11yLabel', {
    //     begin: service.formattedBeginDate,
    //     end: service.formattedEndDate,
    //   })}`,
    // }
  })

  const branch = mostRecentBranch || ''

  const getBranchSeal = (): React.ReactNode => {
    const dimensions = {
      width: 34,
      height: 34,
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

  return (
    <LargePanel title={t('veteranStatus.title')} rightButtonText={t('close')}>
      <Box backgroundColor="profileBanner" alignItems="center">
        <Box mt={theme.dimensions.standardMarginBetween}>
          <VAIcon name={'Logo'} />
        </Box>
        <Box flex={1} my={theme.dimensions.standardMarginBetween}>
          <TextView textTransform="capitalize" mb={theme.dimensions.textIconMargin} variant="BitterBoldHeading" color="primaryContrast">
            {name()}
          </TextView>
          {accessToMilitaryInfo && (
            <Box display="flex" flexDirection="row">
              {getBranchSeal()}
              <TextView ml={10} variant="MobileBody" color="primaryContrast">
                {branch}
              </TextView>
            </Box>
          )}
        </Box>
      </Box>
      <TextArea>
        <Box accessible={true}>
          <TextView variant="MobileBodyBold">{t('personalInformation.dateOfBirth')}</TextView>
          <TextView variant="MobileBody">{getBirthDate(profile, t)}</TextView>
        </Box>
      </TextArea>
      <TextArea>
        <TextView variant="MobileBodyBold" mb={theme.dimensions.standardMarginBetween}>
          {t('veteranStatus.periodOfService')}
        </TextView>
        {getPeriodOfService}
      </TextArea>
    </LargePanel>
  )
}

export default VeteranStatusScreen

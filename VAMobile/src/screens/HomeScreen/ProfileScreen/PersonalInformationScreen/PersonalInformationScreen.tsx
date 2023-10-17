import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { Box, BoxProps, ErrorComponent, FeatureLandingTemplate, LargeNavButton, LoadingComponent, TextView, TextViewProps, WaygateWrapper } from 'components'
import { GenderIdentityOptions, UserDemographics } from 'api/types/DemographicsData'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState } from 'store/slices/personalInformationSlice'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types'
import { UserDataProfile } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { featureEnabled, waygateNativeAlert } from 'utils/remoteConfig'
import { formatDateMMMMDDYYYY, stringToTitleCase } from 'utils/formattingUtils'
import { registerReviewEvent } from 'utils/inAppReviews'
import { useDemographics } from 'api/demographics/getDemographics'
import { useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { useGenderIdentityOptions } from 'api/demographics/getGenderIdentityOptions'
import { useSelector } from 'react-redux'

export const getBirthDate = (profile: UserDataProfile | undefined, t: TFunction): string => {
  if (profile && profile.birthDate) {
    const formattedBirthDate = formatDateMMMMDDYYYY(profile.birthDate)
    return t('dynamicField', { field: formattedBirthDate })
  } else {
    return t('personalInformation.informationNotAvailable')
  }
}

const getPreferredName = (demographics: UserDemographics | undefined, t: TFunction): string => {
  if (demographics?.preferredName) {
    return stringToTitleCase(demographics.preferredName)
  } else {
    return t('personalInformation.genericBody', { informationType: t('personalInformation.preferredName.title').toLowerCase() })
  }
}

const getGenderIdentity = (demographics: UserDemographics | undefined, t: TFunction, genderIdentityOptions: GenderIdentityOptions): string => {
  if (demographics?.genderIdentity) {
    return genderIdentityOptions[demographics.genderIdentity]
  } else {
    return t('personalInformation.genericBody', { informationType: t('personalInformation.genderIdentity.title').toLowerCase() })
  }
}

type PersonalInformationScreenProps = StackScreenProps<HomeStackParamList, 'PersonalInformation'>

const PersonalInformationScreen: FC<PersonalInformationScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { profile, loading } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { gutter, condensedMarginBetween, formMarginBetween } = theme.dimensions
  const navigateTo = useRouteNavigation()
  const { data: demographics, isFetching: loadingDemographics, isError: getDemographicsError, refetch: refetchDemographics } = useDemographics()
  const {
    data: genderIdentityOptions,
    isLoading: loadingGenderIdentityOptions,
    isError: getGenderIdentityOptionsError,
    refetch: refetchGenderIdentityOptions,
  } = useGenderIdentityOptions()

  /** IN-App review events need to be recorded once, so we use the setState hook to guard this **/
  const [reviewEventRegistered, setReviewEventRegistered] = useState(false)
  if (!reviewEventRegistered) {
    registerReviewEvent()
    setReviewEventRegistered(true)
  }

  const linkProps: TextViewProps = {
    variant: 'MobileBodyLink',
    mx: gutter,
    mt: condensedMarginBetween,
  }

  const dobLinkProps: TextViewProps = {
    variant: 'MobileBodyLink',
    mb: formMarginBetween,
  }

  const boxProps: BoxProps = {
    minHeight: 81,
    borderRadius: 6,
    p: theme.dimensions.cardPadding,
    mb: theme.dimensions.condensedMarginBetween,
    backgroundColor: 'textBox',
    borderWidth: theme.dimensions.buttonBorderWidth,
    borderColor: 'secondary',
    borderStyle: 'solid',
  }

  const screenError = useError(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID)
  const onTryAgain = () => {
    if (getDemographicsError) {
      refetchDemographics()
    }
    if (getGenderIdentityOptionsError) {
      refetchGenderIdentityOptions()
    }
  }

  const birthdate = getBirthDate(profile, t)
  const errorCheck = screenError || getDemographicsError || getGenderIdentityOptionsError
  const loadingCheck = loading || loadingGenderIdentityOptions || loadingDemographics

  const onGenderIdentity = () => {
    if (waygateNativeAlert('WG_GenderIdentityScreen')) {
      navigation.navigate('GenderIdentity')
    }
  }

  const onPreferredName = () => {
    if (waygateNativeAlert('WG_PreferredNameScreen')) {
      navigation.navigate('PreferredName')
    }
  }

  return (
    <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('personalInformation.title')} testID="PersonalInformationTestID">
      {errorCheck ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID} onTryAgain={screenError ? undefined : onTryAgain} />
      ) : loadingCheck ? (
        <LoadingComponent text={t('personalInformation.loading')} />
      ) : (
        <WaygateWrapper waygate="WG_PersonalInformationScreen">
          <TextView accessibilityLabel={a11yLabelVA(t('contactInformation.editNote'))} variant="MobileBody" mx={gutter}>
            {t('contactInformation.editNote')}
          </TextView>
          <Pressable onPress={navigateTo('HowDoIUpdate', { screenType: 'name' })} accessibilityRole="link" accessible={true}>
            <TextView {...linkProps}>{t('personalInformation.howToFixLegalName')}</TextView>
          </Pressable>
          <Box my={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
            <Box {...boxProps}>
              <Box flexDirection={'row'} flexWrap={'wrap'} mb={birthdate ? theme.dimensions.condensedMarginBetween : undefined}>
                <TextView mr={theme.dimensions.condensedMarginBetween} variant="BitterBoldHeading">
                  {t('personalInformation.dateOfBirth')}
                </TextView>
              </Box>
              <TextView variant={'MobileBody'}>{birthdate}</TextView>
            </Box>
            <Pressable onPress={navigateTo('HowDoIUpdate', { screenType: 'DOB' })} accessibilityRole="link" accessible={true}>
              <TextView {...dobLinkProps}>{t('personalInformation.howToFixDateOfBirth')}</TextView>
            </Pressable>
            {featureEnabled('preferredNameGenderWaygate') && (
              <>
                <LargeNavButton
                  title={t('personalInformation.preferredName.title')}
                  borderWidth={theme.dimensions.buttonBorderWidth}
                  borderColor={'secondary'}
                  borderColorActive={'primaryDarkest'}
                  borderStyle={'solid'}
                  subText={getPreferredName(demographics, t)}
                  onPress={onPreferredName}
                />
                <LargeNavButton
                  title={t('personalInformation.genderIdentity.title')}
                  borderWidth={theme.dimensions.buttonBorderWidth}
                  borderColor={'secondary'}
                  borderColorActive={'primaryDarkest'}
                  borderStyle={'solid'}
                  subText={getGenderIdentity(demographics, t, genderIdentityOptions)}
                  onPress={onGenderIdentity}
                />
              </>
            )}
          </Box>
        </WaygateWrapper>
      )}
    </FeatureLandingTemplate>
  )
}

export default PersonalInformationScreen

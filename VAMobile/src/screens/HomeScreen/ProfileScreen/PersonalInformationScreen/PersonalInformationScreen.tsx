import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { Box, BoxProps, ErrorComponent, FeatureLandingTemplate, LargeNavButton, LoadingComponent, TextView, TextViewProps } from 'components'
import { GenderIdentityOptions, ScreenIDTypesConstants } from 'store/api/types'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, getGenderIdentityOptions } from 'store/slices/personalInformationSlice'
import { RootState } from 'store'
import { UserDataProfile } from 'store/api/types'
import { UserDemographics } from 'api/types/DemographicsData'
import { featureEnabled } from 'utils/remoteConfig'
import { formatDateMMMMDDYYYY, stringToTitleCase } from 'utils/formattingUtils'
import { registerReviewEvent } from 'utils/inAppReviews'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { useDemographics } from 'api/demographics'
import { useSelector } from 'react-redux'

const getBirthDate = (profile: UserDataProfile | undefined, t: TFunction): string => {
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
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { profile, loading, error, loadingGenderIdentityOptions, genderIdentityOptions } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { gutter, condensedMarginBetween, formMarginBetween } = theme.dimensions
  const navigateTo = useRouteNavigation()
  const { data: demographics, isLoading: loadingDemographics } = useDemographics()

  useFocusEffect(
    React.useCallback(() => {
      if (demographics?.genderIdentity && !Object.keys(genderIdentityOptions).length && !error) {
        dispatch(getGenderIdentityOptions(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID))
      }
    }, [dispatch, error, genderIdentityOptions, demographics?.genderIdentity]),
  )

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

  if (useError(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('personalInformation.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loading || loadingGenderIdentityOptions || loadingDemographics) {
    return (
      <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('personalInformation.title')}>
        <LoadingComponent text={t('personalInformation.loading')} />
      </FeatureLandingTemplate>
    )
  }

  const birthdate = getBirthDate(profile, t)

  //ToDo add feature flag display logic for preferredName and genderIdentity cards once it is merged into the nav update

  return (
    <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('personalInformation.title')} testID="PersonalInformationTestID">
      <TextView {...testIdProps(t('contactInformation.editNoteA11yLabel'))} variant="MobileBody" mx={gutter}>
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
              onPress={navigateTo('PreferredName')}
            />
            <LargeNavButton
              title={t('personalInformation.genderIdentity.title')}
              borderWidth={theme.dimensions.buttonBorderWidth}
              borderColor={'secondary'}
              borderColorActive={'primaryDarkest'}
              borderStyle={'solid'}
              subText={getGenderIdentity(demographics, t, genderIdentityOptions)}
              onPress={navigateTo('GenderIdentity')}
            />
          </>
        )}
      </Box>
    </FeatureLandingTemplate>
  )
}

export default PersonalInformationScreen

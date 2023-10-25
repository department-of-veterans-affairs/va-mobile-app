import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { Box, BoxProps, ErrorComponent, FeatureLandingTemplate, LargeNavButton, LoadingComponent, TextView, TextViewProps, WaygateWrapper } from 'components'
import { GenderIdentityOptions, UserDemographics } from 'api/types/DemographicsData'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { featureEnabled, waygateNativeAlert } from 'utils/remoteConfig'
import { registerReviewEvent } from 'utils/inAppReviews'
import { stringToTitleCase } from 'utils/formattingUtils'
import { useDemographics } from 'api/demographics/getDemographics'
import { useDowntimeByScreenID, useTheme } from 'utils/hooks'
import { useGenderIdentityOptions } from 'api/demographics/getGenderIdentityOptions'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'

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
  const { gutter, condensedMarginBetween, formMarginBetween } = theme.dimensions
  const personalInformationInDowntime = useDowntimeByScreenID(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID)
  const { data: personalInfo, isLoading: loadingPersonalInfo } = usePersonalInformation()
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

  const onTryAgain = () => {
    if (getDemographicsError) {
      refetchDemographics()
    }
    if (getGenderIdentityOptionsError) {
      refetchGenderIdentityOptions()
    }
  }

  const birthdate = personalInfo?.birthDate || t('personalInformation.informationNotAvailable')
  const errorCheck = personalInformationInDowntime || getDemographicsError || getGenderIdentityOptionsError
  const loadingCheck = loadingPersonalInfo || loadingGenderIdentityOptions || loadingDemographics

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

  const onUpdateName = () => {
    if (waygateNativeAlert('WG_HowDoIUpdateScreen')) {
      navigation.navigate('HowDoIUpdate', { screenType: 'name' })
    }
  }

  const onUpdateDOB = () => {
    if (waygateNativeAlert('WG_HowDoIUpdateScreen')) {
      navigation.navigate('HowDoIUpdate', { screenType: 'DOB' })
    }
  }

  return (
    <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('personalInformation.title')} testID="PersonalInformationTestID">
      {errorCheck ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID} onTryAgain={onTryAgain} />
      ) : loadingCheck ? (
        <LoadingComponent text={t('personalInformation.loading')} />
      ) : (
        <WaygateWrapper waygate="WG_PersonalInformationScreen">
          <TextView accessibilityLabel={a11yLabelVA(t('contactInformation.editNote'))} variant="MobileBody" mx={gutter}>
            {t('contactInformation.editNote')}
          </TextView>
          <Pressable onPress={onUpdateName} accessibilityRole="link" accessible={true}>
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
            <Pressable onPress={onUpdateDOB} accessibilityRole="link" accessible={true}>
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
                {genderIdentityOptions && (
                  <LargeNavButton
                    title={t('personalInformation.genderIdentity.title')}
                    borderWidth={theme.dimensions.buttonBorderWidth}
                    borderColor={'secondary'}
                    borderColorActive={'primaryDarkest'}
                    borderStyle={'solid'}
                    subText={getGenderIdentity(demographics, t, genderIdentityOptions)}
                    onPress={onGenderIdentity}
                  />
                )}
              </>
            )}
          </Box>
        </WaygateWrapper>
      )}
    </FeatureLandingTemplate>
  )
}

export default PersonalInformationScreen

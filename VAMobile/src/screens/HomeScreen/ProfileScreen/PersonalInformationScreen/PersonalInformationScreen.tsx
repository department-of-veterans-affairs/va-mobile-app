import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { Box, ErrorComponent, FeatureLandingTemplate, LargeNavButton, LoadingComponent, TextView, TextViewProps } from 'components'
import { DowntimeFeatureTypeConstants, GenderIdentityKey, GenderIdentityOptions, ScreenIDTypesConstants } from 'store/api/types'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, getProfileInfo } from 'store/slices/personalInformationSlice'
import { RootState } from 'store'
import { UserDataProfile } from 'store/api/types'
import { featureEnabled } from 'utils/remoteConfig'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { registerReviewEvent } from 'utils/inAppReviews'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDowntime, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

const getBirthDate = (profile: UserDataProfile | undefined, t: TFunction): string => {
  if (profile && profile.birthDate) {
    const formattedBirthDate = formatDateMMMMDDYYYY(profile.birthDate)
    return t('dynamicField', { field: formattedBirthDate })
  } else {
    return t('personalInformation.informationNotAvailable')
  }
}

const getPreferredName = (profile: UserDataProfile | undefined, t: TFunction): string => {
  if (profile && profile.preferredName) {
    return t('dynamicField', { field: profile.preferredName })
  } else {
    return t('personalInformation.genericBody', { informationType: t('personalInformation.preferredName.title').toLowerCase() })
  }
}

const getGenderIdentity = (profile: UserDataProfile | undefined, t: TFunction): string => {
  const genderIdentity = GenderIdentityOptions[profile?.genderIdentity as GenderIdentityKey]
  if (genderIdentity) {
    return t('dynamicField', { field: genderIdentity })
  } else {
    return t('personalInformation.genericBody', { informationType: t('personalInformation.genderIdentity.title').toLowerCase() })
  }
}

type PersonalInformationScreenProps = StackScreenProps<HomeStackParamList, 'PersonalInformation'>

const PersonalInformationScreen: FC<PersonalInformationScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { profile, loading, needsDataLoad } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { gutter, condensedMarginBetween } = theme.dimensions
  const profileNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.userProfileUpdate)
  const navigateTo = useRouteNavigation()

  useFocusEffect(
    React.useCallback(() => {
      if (needsDataLoad && profileNotInDowntime) {
        dispatch(getProfileInfo(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID))
      }
    }, [dispatch, needsDataLoad, profileNotInDowntime]),
  )

  /** IN-App review events need to be recorded once, so we use the setState hook to guard this **/
  const [reviewEventRegistered, setReviewEventRegistered] = useState(false)
  if (!reviewEventRegistered) {
    registerReviewEvent()
    setReviewEventRegistered(true)
  }

  const linkProps: TextViewProps = {
    variant: 'HelperText',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    mx: gutter,
    mt: condensedMarginBetween,
  }

  if (useError(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('personalInformation.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loading) {
    return (
      <React.Fragment>
        <LoadingComponent text={t('personalInformation.loading')} />
      </React.Fragment>
    )
  }

  //ToDo add feature flag display logic for preferredName and genderIdentity cards once it is merged into the nav update

  return (
    <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('personalInformation.title')}>
      <TextView {...testIdProps(t('contactInformation.editNoteA11yLabel'))} variant="MobileBody" mx={gutter}>
        {t('contactInformation.editNote')}
      </TextView>
      <Pressable onPress={navigateTo('HowDoIUpdate', { screenType: 'name' })} accessibilityRole="link" accessible={true}>
        <TextView {...linkProps}>{t('personalInformation.howToFixLegalName')}</TextView>
      </Pressable>
      <Box my={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <LargeNavButton
          title={t('personalInformation.dateOfBirth')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
          subText={getBirthDate(profile, t)}
          hideArrow={true}
          linkText={t('personalInformation.howToFixDateOfBirth')}
          linkTextOnPress={navigateTo('HowDoIUpdate', { screenType: 'DOB' })}
        />
        {featureEnabled('preferredNameGender') && (
          <>
            <LargeNavButton
              title={t('personalInformation.preferredName.title')}
              borderWidth={theme.dimensions.buttonBorderWidth}
              borderColor={'secondary'}
              borderColorActive={'primaryDarkest'}
              borderStyle={'solid'}
              subText={getPreferredName(profile, t)}
              onPress={navigateTo('PreferredName')}
            />
            <LargeNavButton
              title={t('personalInformation.genderIdentity.title')}
              borderWidth={theme.dimensions.buttonBorderWidth}
              borderColor={'secondary'}
              borderColorActive={'primaryDarkest'}
              borderStyle={'solid'}
              subText={getGenderIdentity(profile, t)}
              onPress={navigateTo('GenderIdentity')}
            />
          </>
        )}
      </Box>
    </FeatureLandingTemplate>
  )
}

export default PersonalInformationScreen

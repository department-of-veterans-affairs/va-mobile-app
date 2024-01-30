import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'

import { Box, DefaultList, DefaultListItemObj, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextView, TextViewProps } from 'components'
import { GenderIdentityOptions, UserDemographics } from 'api/types/DemographicsData'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { featureEnabled } from 'utils/remoteConfig'
import { registerReviewEvent } from 'utils/inAppReviews'
import { screenContentAllowed } from 'utils/waygateConfig'
import { stringToTitleCase } from 'utils/formattingUtils'
import { useDemographics } from 'api/demographics/getDemographics'
import { useDowntimeByScreenID, useRouteNavigation, useTheme } from 'utils/hooks'
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

function PersonalInformationScreen({ navigation }: PersonalInformationScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { gutter, condensedMarginBetween, formMarginBetween } = theme.dimensions
  const personalInformationInDowntime = useDowntimeByScreenID(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID)
  const isScreenContentAllowed = screenContentAllowed('WG_PersonalInformation')
  const { data: personalInfo, isLoading: loadingPersonalInfo } = usePersonalInformation({ enabled: isScreenContentAllowed })
  const { data: demographics, isFetching: loadingDemographics, isError: getDemographicsError, refetch: refetchDemographics } = useDemographics({ enabled: isScreenContentAllowed })
  const {
    data: genderIdentityOptions,
    isLoading: loadingGenderIdentityOptions,
    isError: getGenderIdentityOptionsError,
    refetch: refetchGenderIdentityOptions,
  } = useGenderIdentityOptions({ enabled: isScreenContentAllowed })

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

  const personalInformationItems = (): Array<DefaultListItemObj> => {
    const items: Array<DefaultListItemObj> = [
      {
        textLines: [{ text: t('personalInformation.preferredName.title'), variant: 'MobileBodyBold' }, { text: getPreferredName(demographics, t) }],
        onPress: () => navigateTo('PreferredName'),
      },
    ]

    if (genderIdentityOptions) {
      items.push({
        textLines: [{ text: t('personalInformation.genderIdentity.title'), variant: 'MobileBodyBold' }, { text: getGenderIdentity(demographics, t, genderIdentityOptions) }],
        onPress: () => navigateTo('GenderIdentity'),
      })
    }
    return items
  }

  const birthdateItems = (): Array<DefaultListItemObj> => [
    {
      textLines: [
        {
          text: t('personalInformation.dateOfBirth'),
          variant: 'MobileBodyBold',
        },
        { text: birthdate },
      ],
    },
  ]

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

  return (
    <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('personalInformation.title')} testID="PersonalInformationTestID">
      {errorCheck ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID} onTryAgain={onTryAgain} />
      ) : loadingCheck ? (
        <LoadingComponent text={t('personalInformation.loading')} />
      ) : (
        <>
          <TextView accessibilityLabel={a11yLabelVA(t('contactInformation.editNote'))} variant="MobileBody" mx={gutter}>
            {t('contactInformation.editNote')}
          </TextView>
          <Pressable onPress={() => navigateTo('HowDoIUpdate', { screenType: 'name' })} accessibilityRole="link" accessible={true}>
            <TextView {...linkProps}>{t('personalInformation.howToFixLegalName')}</TextView>
          </Pressable>
          <Box my={theme.dimensions.standardMarginBetween} mb={birthdate ? theme.dimensions.condensedMarginBetween : undefined}>
            <DefaultList items={birthdateItems()} />
          </Box>
          <Box mx={theme.dimensions.gutter}>
            <Pressable onPress={() => navigateTo('HowDoIUpdate', { screenType: 'DOB' })} accessibilityRole="link" accessible={true}>
              <TextView {...dobLinkProps}>{t('personalInformation.howToFixDateOfBirth')}</TextView>
            </Pressable>
          </Box>
        </>
      )}
      {featureEnabled('preferredNameGenderWaygate') && <DefaultList items={personalInformationItems()} />}
    </FeatureLandingTemplate>
  )
}

export default PersonalInformationScreen

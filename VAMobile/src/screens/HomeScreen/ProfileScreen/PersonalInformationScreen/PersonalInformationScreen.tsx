import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { TFunction } from 'i18next'

import { useDemographics } from 'api/demographics/getDemographics'
import { useGenderIdentityOptions } from 'api/demographics/getGenderIdentityOptions'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { GenderIdentityOptions, UserDemographics } from 'api/types/DemographicsData'
import {
  Box,
  DefaultList,
  DefaultListItemObj,
  ErrorComponent,
  FeatureLandingTemplate,
  LoadingComponent,
  TextView,
  TextViewProps,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { stringToTitleCase } from 'utils/formattingUtils'
import { useDowntimeByScreenID, useRouteNavigation, useTheme } from 'utils/hooks'
import { registerReviewEvent } from 'utils/inAppReviews'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

const getPreferredName = (demographics: UserDemographics | undefined, t: TFunction): string => {
  if (demographics?.preferredName) {
    return stringToTitleCase(demographics.preferredName)
  } else {
    return t('personalInformation.genericBody', {
      informationType: t('personalInformation.preferredName.title').toLowerCase(),
    })
  }
}

const getGenderIdentity = (
  demographics: UserDemographics | undefined,
  t: TFunction,
  genderIdentityOptions: GenderIdentityOptions,
): string => {
  if (demographics?.genderIdentity) {
    return genderIdentityOptions[demographics.genderIdentity]
  } else {
    return t('personalInformation.genericBody', {
      informationType: t('personalInformation.genderIdentity.title').toLowerCase(),
    })
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
  const {
    data: personalInfo,
    isLoading: loadingPersonalInfo,
    isError: personalInfoError,
    refetch: refetchPersonalInfo,
    isRefetching: refetchingPersonalInfo,
  } = usePersonalInformation({
    enabled: isScreenContentAllowed,
  })
  const {
    data: demographics,
    isFetching: loadingDemographics,
    error: getDemographicsError,
    refetch: refetchDemographics,
    isRefetching: refetchingDemographics,
  } = useDemographics({ enabled: isScreenContentAllowed })
  const {
    data: genderIdentityOptions,
    isLoading: loadingGenderIdentityOptions,
    error: getGenderIdentityOptionsError,
    refetch: refetchGenderIdentityOptions,
    isRefetching: refetchingGenderIdentity,
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
        textLines: [
          { text: t('personalInformation.preferredName.title'), variant: 'MobileBodyBold' },
          { text: getPreferredName(demographics, t) },
        ],
        onPress: () => navigateTo('PreferredName'),
      },
    ]

    if (genderIdentityOptions) {
      items.push({
        textLines: [
          { text: t('personalInformation.genderIdentity.title'), variant: 'MobileBodyBold' },
          { text: getGenderIdentity(demographics, t, genderIdentityOptions) },
        ],
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
    if (personalInfoError) {
      refetchPersonalInfo()
    }
  }

  const birthdate = personalInfo?.birthDate || t('personalInformation.informationNotAvailable')
  const errorCheck = personalInformationInDowntime || getDemographicsError || getGenderIdentityOptionsError
  const loadingCheck =
    loadingPersonalInfo ||
    loadingGenderIdentityOptions ||
    loadingDemographics ||
    refetchingPersonalInfo ||
    refetchingDemographics ||
    refetchingGenderIdentity

  return (
    <FeatureLandingTemplate
      backLabel={t('profile.title')}
      backLabelOnPress={navigation.goBack}
      title={t('personalInformation.title')}
      testID="PersonalInformationTestID">
      {loadingCheck ? (
        <LoadingComponent text={t('personalInformation.loading')} />
      ) : errorCheck ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID}
          onTryAgain={onTryAgain}
          error={getDemographicsError || getGenderIdentityOptionsError}
        />
      ) : (
        <>
          <TextView accessibilityLabel={a11yLabelVA(t('contactInformation.editNote'))} variant="MobileBody" mx={gutter}>
            {t('contactInformation.editNote')}
          </TextView>
          <Pressable
            onPress={() => navigateTo('HowDoIUpdate', { screenType: 'name' })}
            accessibilityRole="link"
            accessible={true}>
            <TextView {...linkProps}>{t('personalInformation.howToFixLegalName')}</TextView>
          </Pressable>
          <Box
            my={theme.dimensions.standardMarginBetween}
            mb={birthdate ? theme.dimensions.condensedMarginBetween : undefined}>
            <DefaultList items={birthdateItems()} />
          </Box>
          <Box mx={theme.dimensions.gutter}>
            <Pressable
              onPress={() => navigateTo('HowDoIUpdate', { screenType: 'DOB' })}
              accessibilityRole="link"
              accessible={true}>
              <TextView {...dobLinkProps}>{t('personalInformation.howToFixDateOfBirth')}</TextView>
            </Pressable>
          </Box>
          {featureEnabled('preferredNameGenderWaygate') && <DefaultList items={personalInformationItems()} />}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default PersonalInformationScreen

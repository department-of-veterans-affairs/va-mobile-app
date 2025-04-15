import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { TFunction } from 'i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useDemographics } from 'api/demographics/getDemographics'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { UserDemographics } from 'api/types/DemographicsData'
import {
  AlertWithHaptics,
  Box,
  BoxProps,
  DefaultList,
  DefaultListItemObj,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  TextArea,
  TextView,
  VAScrollView,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { stringToTitleCase } from 'utils/formattingUtils'
import { useDowntimeByScreenID, useRouteNavigation, useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'
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

type PersonalInformationScreenProps = StackScreenProps<HomeStackParamList, 'PersonalInformation'>

function PersonalInformationScreen({ navigation }: PersonalInformationScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { gutter, condensedMarginBetween, formMarginBetween, contentMarginBottom, standardMarginBetween } =
    theme.dimensions
  const personalInformationInDowntime = useDowntimeByScreenID(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID)
  const isScreenContentAllowed = screenContentAllowed('WG_PersonalInformation')
  const registerReviewEvent = useReviewEvent(true)
  const {
    data: userAuthorizedServices,
    isLoading: loadingUserAuthorizedServices,
    error: getUserAuthorizedServicesError,
    refetch: refetchUserAuthorizedServices,
  } = useAuthorizedServices()
  const {
    data: personalInfo,
    isFetching: loadingPersonalInfo,
    isError: personalInfoError,
    refetch: refetchPersonalInfo,
  } = usePersonalInformation({
    enabled: isScreenContentAllowed,
  })
  const {
    data: demographics,
    isFetching: loadingDemographics,
    error: getDemographicsError,
    refetch: refetchDemographics,
  } = useDemographics({ enabled: isScreenContentAllowed })

  /** IN-App review events need to be recorded once, so we use the setState hook to guard this **/
  const [reviewEventRegistered, setReviewEventRegistered] = useState(false)
  if (!reviewEventRegistered) {
    registerReviewEvent()
    setReviewEventRegistered(true)
  }

  useEffect(() => {
    if (!userAuthorizedServices?.userProfileUpdate && !loadingUserAuthorizedServices) {
      logAnalyticsEvent(Events.vama_prof_person_noauth())
    }
  }, [loadingUserAuthorizedServices, userAuthorizedServices?.userProfileUpdate])

  const personalInformationItems = (): Array<DefaultListItemObj> => {
    const items: Array<DefaultListItemObj> = [
      {
        textLines: [
          { text: t('personalInformation.preferredName.title'), variant: 'MobileBodyBold' },
          { text: getPreferredName(demographics, t) },
        ],
        onPress: () => navigateTo('PreferredName'),
        detoxTestID: 'preferredNameRowID',
      },
    ]

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
    if (personalInfoError) {
      refetchPersonalInfo()
    }
  }

  const getNoAuth = () => {
    const alertWrapperProps: BoxProps = {
      mb: standardMarginBetween,
    }
    return (
      <VAScrollView>
        <Box mb={contentMarginBottom}>
          <Box {...alertWrapperProps}>
            <AlertWithHaptics variant="warning" description={t('noAccessProfileInfo.cantAccess')} />
          </Box>
          <Box>
            <TextArea>
              <TextView variant="MobileBody" paragraphSpacing={true}>
                {t('noAccessProfileInfo.systemProblem')}
              </TextView>
              <TextView variant="MobileBody">{t('noAccessProfileInfo.toAccess')}</TextView>
            </TextArea>
          </Box>
        </Box>
      </VAScrollView>
    )
  }

  const birthdate = personalInfo?.birthDate || t('personalInformation.informationNotAvailable')
  const errorCheck = personalInformationInDowntime || getDemographicsError
  const loadingCheck = loadingPersonalInfo || loadingDemographics || loadingUserAuthorizedServices

  return (
    <FeatureLandingTemplate
      backLabel={t('profile.title')}
      backLabelOnPress={navigation.goBack}
      title={t('personalInformation.title')}
      testID="PersonalInformationTestID"
      backLabelTestID="backToProfileID">
      {loadingCheck ? (
        <LoadingComponent text={t('personalInformation.loading')} />
      ) : errorCheck ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID}
          onTryAgain={onTryAgain}
          error={getDemographicsError}
        />
      ) : getUserAuthorizedServicesError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID}
          onTryAgain={refetchUserAuthorizedServices}
          error={getUserAuthorizedServicesError}
        />
      ) : !userAuthorizedServices?.userProfileUpdate ? (
        getNoAuth()
      ) : (
        <>
          <TextView accessibilityLabel={a11yLabelVA(t('contactInformation.editNote'))} variant="MobileBody" mx={gutter}>
            {t('contactInformation.editNote')}
          </TextView>
          <Box mx={gutter} mt={condensedMarginBetween}>
            <LinkWithAnalytics
              type="custom"
              text={t('personalInformation.howToFixLegalName')}
              onPress={() => navigateTo('HowDoIUpdate', { screenType: 'name' })}
              testID="howToFixLegalNameID"
            />
          </Box>
          <Box
            my={theme.dimensions.standardMarginBetween}
            mb={birthdate ? theme.dimensions.condensedMarginBetween : undefined}>
            <DefaultList items={birthdateItems()} />
          </Box>
          <Box mx={theme.dimensions.gutter} mb={formMarginBetween}>
            <LinkWithAnalytics
              type="custom"
              text={t('personalInformation.howToFixDateOfBirth')}
              onPress={() => navigateTo('HowDoIUpdate', { screenType: 'DOB' })}
              testID="howToFixDOBID"
            />
          </Box>
          {featureEnabled('preferredNameGenderWaygate') && <DefaultList items={personalInformationItems()} />}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default PersonalInformationScreen

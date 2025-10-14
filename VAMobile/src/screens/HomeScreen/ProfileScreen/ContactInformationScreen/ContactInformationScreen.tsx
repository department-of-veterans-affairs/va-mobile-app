import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { TFunction } from 'i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useContactInformation } from 'api/contactInformation/getContactInformation'
import { FormattedPhoneType, PhoneData, PhoneKey, PhoneTypeConstants } from 'api/types'
import { UserContactInformation } from 'api/types/ContactInformation'
import {
  AlertWithHaptics,
  Box,
  BoxProps,
  DefaultList,
  DefaultListItemObj,
  EmailConfirmationAlert,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  TextArea,
  TextLine,
  TextView,
  TextViewProps,
  VABulletList,
  VAScrollView,
} from 'components'
import { Events } from 'constants/analytics'
import { DefaultCallingCode } from 'constants/flags'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import AddressSummary, {
  addressDataField,
  profileAddressOptions,
} from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useDowntimeByScreenID, useRouteNavigation, useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

const INTL_NUMBER_NOTIFICATION_SETTINGS_DISMISSED = '@intl_number_notification_settings_dismissed'

const getTextForPhoneData = (
  contactInformation: UserContactInformation | undefined,
  formattedPhoneType: FormattedPhoneType,
  phoneKey: PhoneKey,
  t: TFunction,
): Array<TextLine> => {
  const textIDs: Array<TextLine> = []

  if (contactInformation && contactInformation[formattedPhoneType]) {
    const extension = contactInformation[phoneKey]?.extension
    if (extension) {
      textIDs.push({
        text: t('contactInformation.phoneWithExtension', {
          number: contactInformation[formattedPhoneType] as string,
          extension,
        }),
      })
    } else {
      textIDs.push({ text: t('dynamicField', { field: contactInformation[formattedPhoneType] as string }) })
    }
  } else {
    textIDs.push({ text: t('contactInformation.addYour', { field: t(`contactInformation.${phoneKey}`) }) })
  }

  return textIDs
}

const getPhoneNumberData = (
  contactInformation: UserContactInformation | undefined,
  t: TFunction,
  onHomePhone: () => void,
  onWorkPhone: () => void,
  onCellPhone: () => void,
): Array<DefaultListItemObj> => {
  let homeText: Array<TextLine> = [{ text: t('contactInformation.home'), variant: 'MobileBodyBold' }]
  let workText: Array<TextLine> = [{ text: t('contactInformation.work'), variant: 'MobileBodyBold' }]
  let cellText: Array<TextLine> = [{ text: t('contactInformation.mobile'), variant: 'MobileBodyBold' }]

  homeText = homeText.concat(getTextForPhoneData(contactInformation, 'formattedHomePhone', 'homePhone', t))
  workText = workText.concat(getTextForPhoneData(contactInformation, 'formattedWorkPhone', 'workPhone', t))
  cellText = cellText.concat(getTextForPhoneData(contactInformation, 'formattedMobilePhone', 'mobilePhone', t))

  return [
    {
      textLines: homeText,
      a11yHintText: t('contactInformation.editOrAddHomeNumber'),
      onPress: onHomePhone,
      testId: 'homePhone',
    },
    {
      textLines: workText,
      a11yHintText: t('contactInformation.editOrAddWorkNumber'),
      onPress: onWorkPhone,
      testId: 'workPhone',
    },
    {
      textLines: cellText,
      a11yHintText: t('contactInformation.editOrAddCellNumber'),
      onPress: onCellPhone,
      testId: 'mobilePhone',
    },
  ]
}

const getEmailAddressData = (
  contactInformation: UserContactInformation | undefined,
  t: TFunction,
  onEmailAddress: () => void,
): Array<DefaultListItemObj> => {
  const textLines: Array<TextLine> = [{ text: t('contactInformation.emailAddress'), variant: 'MobileBodyBold' }]

  if (contactInformation?.contactEmail?.emailAddress) {
    textLines.push({ text: t('dynamicField', { field: contactInformation.contactEmail.emailAddress }) })
  } else {
    textLines.push({
      text: t('contactInformation.addYour', { field: t('contactInformation.emailAddress').toLowerCase() }),
    })
  }

  return [
    {
      textLines: textLines,
      a11yHintText: t('contactInformation.editOrAddEmailAddress'),
      onPress: onEmailAddress,
      testId: 'emailAddress',
    },
  ]
}

type ContactInformationScreenProps = StackScreenProps<HomeStackParamList, 'ContactInformation'>

function ContactInformationScreen({ navigation }: ContactInformationScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const {
    data: userAuthorizedServices,
    isLoading: loadingUserAuthorizedServices,
    error: getUserAuthorizedServicesError,
    refetch: refetchUserAuthorizedServices,
  } = useAuthorizedServices()
  const {
    data: contactInformation,
    isFetching: loadingContactInformation,
    error: contactInformationError,
    refetch: refetchContactInformation,
  } = useContactInformation({ enabled: screenContentAllowed('WG_ContactInformation') })
  const registerReviewEvent = useReviewEvent(true)
  const contactInformationInDowntime = useDowntimeByScreenID(ScreenIDTypesConstants.CONTACT_INFORMATION_SCREEN_ID)
  const { contentMarginBottom, gutter, condensedMarginBetween, standardMarginBetween } = theme.dimensions
  const [displayIntlNumberSettingsAlert, setDisplayIntlNumberSettingsAlert] = useState(false)

  useEffect(() => {
    if (!userAuthorizedServices?.userProfileUpdate && !loadingUserAuthorizedServices) {
      logAnalyticsEvent(Events.vama_prof_contact_noauth())
    }
  }, [loadingUserAuthorizedServices, userAuthorizedServices?.userProfileUpdate])

  useEffect(() => {
    const checkIntlNumberNotificationSettingsDismissed = async () => {
      const dismissed = await AsyncStorage.getItem(INTL_NUMBER_NOTIFICATION_SETTINGS_DISMISSED)

      if (dismissed === 'false') {
        setDisplayIntlNumberSettingsAlert(true)
      }
    }

    // Only check notification dismissal if any phone number is an international phone number
    if (contactInformation) {
      const { workPhone, homePhone, mobilePhone } = contactInformation
      // TODO This should instead check the iso code instead of the calling code
      const intlMobilePhone = mobilePhone && mobilePhone.countryCode !== DefaultCallingCode
      const intlWorkPhone = workPhone && workPhone.countryCode !== DefaultCallingCode
      const intlHomePhone = homePhone && homePhone.countryCode !== DefaultCallingCode
      if (intlMobilePhone || intlWorkPhone || intlHomePhone) {
        checkIntlNumberNotificationSettingsDismissed()
      }
    }
  }, [contactInformation])

  const navigateTo = useRouteNavigation()

  /** IN-App review events need to be recorded once, so we use the setState hook to guard this **/
  const [reviewEventRegistered, setReviewEventRegistered] = useState(false)
  if (!reviewEventRegistered) {
    console.debug('REVIEW EVENT REGISTERED')
    registerReviewEvent()
    setReviewEventRegistered(true)
  }

  const onMailingAddress = () => {
    logAnalyticsEvent(Events.vama_click(t('contactInformation.mailingAddress'), t('contactInformation.title')))
    navigateTo('EditAddress', {
      displayTitle: t('contactInformation.mailingAddress'),
      addressType: profileAddressOptions.MAILING_ADDRESS,
    })
  }

  const onResidentialAddress = () => {
    logAnalyticsEvent(Events.vama_click(t('contactInformation.residentialAddress'), t('contactInformation.title')))
    navigateTo('EditAddress', {
      displayTitle: t('contactInformation.residentialAddress'),
      addressType: profileAddressOptions.RESIDENTIAL_ADDRESS,
    })
  }

  const onHomePhone = () => {
    navigateTo('EditPhoneNumber', {
      displayTitle: t('editPhoneNumber.homePhoneTitle'),
      phoneType: PhoneTypeConstants.HOME,
      phoneData: contactInformation?.homePhone || ({} as PhoneData),
    })
  }

  const onWorkPhone = () => {
    navigateTo('EditPhoneNumber', {
      displayTitle: t('editPhoneNumber.workPhoneTitle'),
      phoneType: PhoneTypeConstants.WORK,
      phoneData: contactInformation?.workPhone || ({} as PhoneData),
    })
  }

  const onCellPhone = () => {
    navigateTo('EditPhoneNumber', {
      displayTitle: t('editPhoneNumber.mobilePhoneTitle'),
      phoneType: PhoneTypeConstants.MOBILE,
      phoneData: contactInformation?.mobilePhone || ({} as PhoneData),
    })
  }

  const onEmailAddress = () => {
    navigateTo('EditEmail')
  }

  const onHowWillYou = () => {
    navigateTo('HowWillYou')
  }

  const handleAlertDismiss = (): void => {
    AsyncStorage.setItem(INTL_NUMBER_NOTIFICATION_SETTINGS_DISMISSED, 'true')
    setDisplayIntlNumberSettingsAlert(false)
  }

  const addressData: Array<addressDataField> = [
    { addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onMailingAddress },
    { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: onResidentialAddress },
  ]

  const titleProps: TextViewProps = {
    variant: 'TableHeaderBold',
    mx: gutter,
    mb: condensedMarginBetween,
    mt: standardMarginBetween,
    accessibilityRole: 'header',
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
              <TextView variant="MobileBody">{t('noAccessProfileInfo.systemProblem')}</TextView>
            </TextArea>
          </Box>
        </Box>
      </VAScrollView>
    )
  }

  const loadingCheck = loadingContactInformation || loadingUserAuthorizedServices
  const contactInfoErrorCheck = contactInformationInDowntime || contactInformationError

  return (
    <FeatureLandingTemplate
      backLabel={t('profile.title')}
      backLabelOnPress={navigation.goBack}
      title={t('contactInformation.title')}
      testID="ContactInfoTestID">
      {loadingCheck ? (
        <LoadingComponent text={t('contactInformation.loading')} />
      ) : contactInfoErrorCheck ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.CONTACT_INFORMATION_SCREEN_ID}
          onTryAgain={refetchContactInformation}
          error={contactInformationError}
        />
      ) : getUserAuthorizedServicesError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.CONTACT_INFORMATION_SCREEN_ID}
          onTryAgain={refetchUserAuthorizedServices}
          error={getUserAuthorizedServicesError}
        />
      ) : !userAuthorizedServices?.userProfileUpdate ? (
        getNoAuth()
      ) : (
        <>
          {displayIntlNumberSettingsAlert && (
            <AlertWithHaptics
              variant="info"
              expandable
              initializeExpanded
              header={t('contactInformation.intlWarningTitle')}
              description={t('contactInformation.intlWarningDescription')}
              descriptionA11yLabel={t('contactInformation.intlWarningDescription')}
              secondaryButton={{ label: t('contactInformation.dismissMessage'), onPress: handleAlertDismiss }}>
              <VABulletList
                listOfText={[
                  t('contactInformation.appointments'),
                  t('contactInformation.rxShipping'),
                  t('contactInformation.appealHearingReminders'),
                ]}
              />
            </AlertWithHaptics>
          )}
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView accessibilityLabel={a11yLabelVA(t('contactInformation.editNote'))} variant="MobileBody" mx={gutter}>
            {t('contactInformation.editNote')}
          </TextView>
          <Box mx={gutter} mt={condensedMarginBetween}>
            <LinkWithAnalytics
              type="custom"
              text={t('contactInformation.howWillYouUseContactInfo')}
              onPress={onHowWillYou}
              testID="howWeUseContactInfoLinkTestID"
            />
          </Box>
          <AddressSummary addressData={addressData} title={t('contactInformation.addresses')} />
          <DefaultList
            items={getPhoneNumberData(contactInformation, t, onHomePhone, onWorkPhone, onCellPhone)}
            title={t('contactInformation.phoneNumbers')}
          />
          <TextView {...titleProps} accessible={true} testID={t('contactInformation.contactEmailAddress')}>
            {t('contactInformation.contactEmailAddress')}
          </TextView>
          {featureEnabled('showEmailConfirmationAlert') && <EmailConfirmationAlert inContactInfoScreen />}
          <DefaultList items={getEmailAddressData(contactInformation, t, onEmailAddress)} />

          <TextView variant="TableHeaderLabel" mx={gutter} mt={condensedMarginBetween} mb={contentMarginBottom}>
            {t('contactInformation.thisIsEmailWeUseToContactNote')}
          </TextView>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default ContactInformationScreen

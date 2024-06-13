import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { TFunction } from 'i18next'

import { useContactInformation } from 'api/contactInformation/getContactInformation'
import { FormattedPhoneType, PhoneData, PhoneKey, PhoneTypeConstants } from 'api/types'
import { UserContactInformation } from 'api/types/ContactInformation'
import {
  Box,
  DefaultList,
  DefaultListItemObj,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  TextLine,
  TextView,
} from 'components'
import { Events } from 'constants/analytics'
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
import { registerReviewEvent } from 'utils/inAppReviews'
import { screenContentAllowed } from 'utils/waygateConfig'

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
      testId: 'homePhoneTestID',
    },
    {
      textLines: workText,
      a11yHintText: t('contactInformation.editOrAddWorkNumber'),
      onPress: onWorkPhone,
      testId: 'workPhoneTestID',
    },
    {
      textLines: cellText,
      a11yHintText: t('contactInformation.editOrAddCellNumber'),
      onPress: onCellPhone,
      testId: 'mobilePhoneTestID',
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
      testId: 'emailAddressTestID',
    },
  ]
}

type ContactInformationScreenProps = StackScreenProps<HomeStackParamList, 'ContactInformation'>

function ContactInformationScreen({ navigation }: ContactInformationScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const {
    data: contactInformation,
    isFetching: loadingContactInformation,
    error: contactInformationError,
    refetch: refetchContactInformation,
    failureCount,
  } = useContactInformation({ enabled: screenContentAllowed('WG_ContactInformation') })
  const contactInformationInDowntime = useDowntimeByScreenID(ScreenIDTypesConstants.CONTACT_INFORMATION_SCREEN_ID)
  const { contentMarginBottom, gutter, condensedMarginBetween } = theme.dimensions
  const [retried, setRetried] = useState(false)

  useEffect(() => {
    if (failureCount > 0) {
      setRetried(true)
    }

    if (retried && !loadingContactInformation) {
      const retryStatus = contactInformationError ? 'fail' : 'success'
      logAnalyticsEvent(Events.vama_react_query_retry(retryStatus))
    }
  }, [failureCount, contactInformationError, loadingContactInformation, retried])

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

  const addressData: Array<addressDataField> = [
    { addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onMailingAddress },
    { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: onResidentialAddress },
  ]

  return (
    <FeatureLandingTemplate
      backLabel={t('profile.title')}
      backLabelOnPress={navigation.goBack}
      title={t('contactInformation.title')}
      testID="ContactInfoTestID">
      {loadingContactInformation ? (
        <LoadingComponent text={t('contactInformation.loading')} />
      ) : contactInformationInDowntime || contactInformationError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.CONTACT_INFORMATION_SCREEN_ID}
          onTryAgain={refetchContactInformation}
          error={contactInformationError}
        />
      ) : (
        <>
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
          <DefaultList
            items={getEmailAddressData(contactInformation, t, onEmailAddress)}
            title={t('contactInformation.contactEmailAddress')}
          />
          <TextView variant="TableHeaderLabel" mx={gutter} mt={condensedMarginBetween} mb={contentMarginBottom}>
            {t('contactInformation.thisIsEmailWeUseToContactNote')}
          </TextView>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default ContactInformationScreen

import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { DefaultList, DefaultListItemObj, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextLine, TextView, TextViewProps } from 'components'
import { FormattedPhoneType, PhoneData, PhoneKey, PhoneTypeConstants } from 'api/types'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types'
import { UserContactInformation } from 'api/types/ContactInformation'
import { a11yLabelVA } from 'utils/a11yLabel'
import { registerReviewEvent } from 'utils/inAppReviews'
import { useContactInformation } from 'api/contactInformation/getContactInformation'
import { useDowntimeByScreenID, useRouteNavigation, useTheme } from 'utils/hooks'
import AddressSummary, { addressDataField, profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'

const getTextForPhoneData = (contactInformation: UserContactInformation | undefined, formattedPhoneType: FormattedPhoneType, phoneKey: PhoneKey, t: TFunction): Array<TextLine> => {
  const textIDs: Array<TextLine> = []

  if (contactInformation && contactInformation[formattedPhoneType]) {
    const extension = contactInformation[phoneKey]?.extension
    if (extension) {
      textIDs.push({ text: t('contactInformation.phoneWithExtension', { number: contactInformation[formattedPhoneType] as string, extension }) })
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
    { textLines: homeText, a11yHintText: t('contactInformation.editOrAddHomeNumber'), onPress: onHomePhone, testId: 'homePhoneTestID' },
    { textLines: workText, a11yHintText: t('contactInformation.editOrAddWorkNumber'), onPress: onWorkPhone, testId: 'workPhoneTestID' },
    { textLines: cellText, a11yHintText: t('contactInformation.editOrAddCellNumber'), onPress: onCellPhone, testId: 'mobilePhoneTestID' },
  ]
}

const getEmailAddressData = (contactInformation: UserContactInformation | undefined, t: TFunction, onEmailAddress: () => void): Array<DefaultListItemObj> => {
  const textLines: Array<TextLine> = [{ text: t('contactInformation.emailAddress'), variant: 'MobileBodyBold' }]

  if (contactInformation?.contactEmail?.emailAddress) {
    textLines.push({ text: t('dynamicField', { field: contactInformation.contactEmail.emailAddress }) })
  } else {
    textLines.push({ text: t('contactInformation.addYour', { field: t('contactInformation.emailAddress').toLowerCase() }) })
  }

  return [{ textLines: textLines, a11yHintText: t('contactInformation.editOrAddEmailAddress'), onPress: onEmailAddress, testId: 'emailAddressTestID' }]
}

type ContactInformationScreenProps = StackScreenProps<HomeStackParamList, 'ContactInformation'>

const ContactInformationScreen: FC<ContactInformationScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { data: contactInformation, isLoading: loadingContactInformation, isError: contactInformationError, refetch: refetchContactInformation } = useContactInformation()
  const contactInformationInDowntime = useDowntimeByScreenID(ScreenIDTypesConstants.CONTACT_INFORMATION_SCREEN_ID)

  const { contentMarginBottom, gutter, condensedMarginBetween } = theme.dimensions

  const navigateTo = useRouteNavigation()

  /** IN-App review events need to be recorded once, so we use the setState hook to guard this **/
  const [reviewEventRegistered, setReviewEventRegistered] = useState(false)
  if (!reviewEventRegistered) {
    console.debug('REVIEW EVENT REGISTERED')
    registerReviewEvent()
    setReviewEventRegistered(true)
  }
  const onMailingAddress = navigateTo('EditAddress', {
    displayTitle: t('contactInformation.mailingAddress'),
    addressType: profileAddressOptions.MAILING_ADDRESS,
  })

  const onResidentialAddress = navigateTo('EditAddress', {
    displayTitle: t('contactInformation.residentialAddress'),
    addressType: profileAddressOptions.RESIDENTIAL_ADDRESS,
  })

  const onHomePhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.homePhoneTitle'),
    phoneType: PhoneTypeConstants.HOME,
    phoneData: contactInformation?.homePhone || ({} as PhoneData),
  })

  const onWorkPhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.workPhoneTitle'),
    phoneType: PhoneTypeConstants.WORK,
    phoneData: contactInformation?.workPhone || ({} as PhoneData),
  })

  const onCellPhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.mobilePhoneTitle'),
    phoneType: PhoneTypeConstants.MOBILE,
    phoneData: contactInformation?.mobilePhone || ({} as PhoneData),
  })

  const onEmailAddress = navigateTo('EditEmail')

  const linkProps: TextViewProps = {
    variant: 'MobileBodyLink',
    mx: gutter,
    mt: condensedMarginBetween,
  }

  const addressData: Array<addressDataField> = [
    { addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onMailingAddress },
    { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: onResidentialAddress },
  ]

  if (contactInformationInDowntime || contactInformationError) {
    return (
      <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('contactInformation.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.CONTACT_INFORMATION_SCREEN_ID} onTryAgain={refetchContactInformation} />
      </FeatureLandingTemplate>
    )
  }

  if (loadingContactInformation) {
    return (
      <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('contactInformation.title')}>
        <LoadingComponent text={t('contactInformation.loading')} />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('contactInformation.title')} testID="ContactInfoTestID">
      <TextView accessibilityLabel={a11yLabelVA(t('contactInformation.editNote'))} variant="MobileBody" mx={gutter}>
        {t('contactInformation.editNote')}
      </TextView>
      <Pressable onPress={navigateTo('HowWillYou')} accessibilityRole="link" accessible={true}>
        <TextView testID="howWeUseContactInfoLinkTestID" {...linkProps}>
          {t('contactInformation.howWillYouUseContactInfo')}
        </TextView>
      </Pressable>
      <AddressSummary addressData={addressData} title={t('contactInformation.addresses')} />
      <DefaultList items={getPhoneNumberData(contactInformation, t, onHomePhone, onWorkPhone, onCellPhone)} title={t('contactInformation.phoneNumbers')} />
      <DefaultList items={getEmailAddressData(contactInformation, t, onEmailAddress)} title={t('contactInformation.contactEmailAddress')} />
      <TextView variant="TableHeaderLabel" mx={gutter} mt={condensedMarginBetween} mb={contentMarginBottom}>
        {t('contactInformation.thisIsEmailWeUseToContactNote')}
      </TextView>
    </FeatureLandingTemplate>
  )
}

export default ContactInformationScreen

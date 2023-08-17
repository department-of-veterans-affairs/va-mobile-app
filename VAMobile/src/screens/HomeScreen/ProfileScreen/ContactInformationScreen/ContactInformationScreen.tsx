import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { DefaultList, DefaultListItemObj, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextLine, TextView, TextViewProps } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState } from 'store/slices/personalInformationSlice'
import { PhoneData, PhoneTypeConstants, ProfileFormattedFieldType, UserDataProfile } from 'store/api/types'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types'
import { getA11yLabelText } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'
import { stringToTitleCase } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import AddressSummary, { addressDataField, profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'

type phoneType = 'homePhoneNumber' | 'workPhoneNumber' | 'mobilePhoneNumber'

const getTextForPhoneData = (profile: UserDataProfile | undefined, profileField: ProfileFormattedFieldType, phoneType: phoneType, t: TFunction): Array<TextLine> => {
  const textIDs: Array<TextLine> = []

  if (profile && profile[profileField]) {
    const extension = profile[phoneType].extension
    if (extension) {
      textIDs.push({ text: t('contactInformation.phoneWithExtension', { number: profile[profileField] as string, extension }) })
    } else {
      textIDs.push({ text: t('dynamicField', { field: profile[profileField] as string }) })
    }
  } else {
    textIDs.push({ text: t('contactInformation.addYour', { field: t(`contactInformation.${phoneType}`) }) })
  }

  return textIDs
}

const getPhoneNumberData = (
  profile: UserDataProfile | undefined,
  t: TFunction,
  onHomePhone: () => void,
  onWorkPhone: () => void,
  onCellPhone: () => void,
): Array<DefaultListItemObj> => {
  let homeText: Array<TextLine> = [{ text: t('contactInformation.home'), variant: 'MobileBodyBold' }]
  let workText: Array<TextLine> = [{ text: t('contactInformation.work'), variant: 'MobileBodyBold' }]
  let cellText: Array<TextLine> = [{ text: t('contactInformation.mobile'), variant: 'MobileBodyBold' }]

  homeText = homeText.concat(getTextForPhoneData(profile, 'formattedHomePhone', 'homePhoneNumber', t))
  workText = workText.concat(getTextForPhoneData(profile, 'formattedWorkPhone', 'workPhoneNumber', t))
  cellText = cellText.concat(getTextForPhoneData(profile, 'formattedMobilePhone', 'mobilePhoneNumber', t))

  return [
    { textLines: homeText, a11yHintText: t('contactInformation.editOrAddHomeNumber'), onPress: onHomePhone, testId: getA11yLabelText(homeText) },
    { textLines: workText, a11yHintText: t('contactInformation.editOrAddWorkNumber'), onPress: onWorkPhone, testId: getA11yLabelText(workText) },
    { textLines: cellText, a11yHintText: t('contactInformation.editOrAddCellNumber'), onPress: onCellPhone, testId: getA11yLabelText(cellText) },
  ]
}

const getEmailAddressData = (profile: UserDataProfile | undefined, t: TFunction, onEmailAddress: () => void): Array<DefaultListItemObj> => {
  const textLines: Array<TextLine> = [{ text: t('contactInformation.emailAddress'), variant: 'MobileBodyBold' }]

  if (profile?.contactEmail?.emailAddress) {
    textLines.push({ text: t('dynamicField', { field: profile.contactEmail.emailAddress }) })
  } else {
    textLines.push({ text: t('contactInformation.addYour', { field: t('contactInformation.emailAddress').toLowerCase() }) })
  }

  return [{ textLines: textLines, a11yHintText: t('contactInformation.editOrAddEmailAddress'), onPress: onEmailAddress, testId: getA11yLabelText(textLines) }]
}

type ContactInformationScreenProps = StackScreenProps<HomeStackParamList, 'ContactInformation'>

const ContactInformationScreen: FC<ContactInformationScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { profile, loading } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)

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
    phoneData: profile ? profile.homePhoneNumber : ({} as PhoneData),
  })

  const onWorkPhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.workPhoneTitle'),
    phoneType: PhoneTypeConstants.WORK,
    phoneData: profile ? profile.workPhoneNumber : ({} as PhoneData),
  })

  const onCellPhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.mobilePhoneTitle'),
    phoneType: PhoneTypeConstants.MOBILE,
    phoneData: profile ? profile.mobilePhoneNumber : ({} as PhoneData),
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

  if (useError(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('contactInformation.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID} overrideFeatureName={stringToTitleCase(t('contactInformation.title'))} />
      </FeatureLandingTemplate>
    )
  }

  if (loading) {
    return (
      <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('contactInformation.title')}>
        <LoadingComponent text={t('contactInformation.loading')} />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('contactInformation.title')}>
      <TextView {...testIdProps(t('contactInformation.editNoteA11yLabel'))} variant="MobileBody" mx={gutter}>
        {t('contactInformation.editNote')}
      </TextView>
      <Pressable onPress={navigateTo('HowWillYou')} accessibilityRole="link" accessible={true}>
        <TextView {...linkProps}>{t('contactInformation.howWillYouUseContactInfo')}</TextView>
      </Pressable>
      <AddressSummary addressData={addressData} title={t('contactInformation.addresses')} />
      <DefaultList items={getPhoneNumberData(profile, t, onHomePhone, onWorkPhone, onCellPhone)} title={t('contactInformation.phoneNumbers')} />
      <DefaultList items={getEmailAddressData(profile, t, onEmailAddress)} title={t('contactInformation.contactEmailAddress')} />
      <TextView variant="TableHeaderLabel" mx={gutter} mt={condensedMarginBetween} mb={contentMarginBottom}>
        {t('contactInformation.thisIsEmailWeUseToContactNote')}
      </TextView>
    </FeatureLandingTemplate>
  )
}

export default ContactInformationScreen

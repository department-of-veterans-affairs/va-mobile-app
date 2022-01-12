import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC, useState } from 'react'

import { DefaultList, DefaultListItemObj, ErrorComponent, LoadingComponent, TextLine, TextView, TextViewProps, VAScrollView } from 'components'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { PhoneData, PhoneTypeConstants, ProfileFormattedFieldType, UserDataProfile } from 'store/api/types'
import { ProfileStackParamList } from '../ProfileStackScreens'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getA11yLabelText } from 'utils/common'
import { getProfileInfo } from 'store/slices/personalInformationSlice'
import { registerReviewEvent } from 'utils/inAppReviews'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useAppSelector, useDowntime, useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import AddressSummary, { addressDataField, profileAddressOptions } from 'screens/ProfileScreen/AddressSummary'
import ProfileBanner from '../ProfileBanner'

const getPersonalInformationData = (profile: UserDataProfile | undefined, t: TFunction): Array<DefaultListItemObj> => {
  const dateOfBirthTextIDs: Array<TextLine> = [{ text: t('personalInformation.dateOfBirth'), variant: 'MobileBodyBold' }]
  const genderTextIDs: Array<TextLine> = [{ text: t('personalInformation.gender'), variant: 'MobileBodyBold' }]

  if (profile && profile.birthDate) {
    const formattedBirthDate = formatDateMMMMDDYYYY(profile.birthDate)
    dateOfBirthTextIDs.push({ text: t('personalInformation.dynamicField', { field: formattedBirthDate }) })
  } else {
    dateOfBirthTextIDs.push({ text: t('personalInformation.informationNotAvailable') })
  }

  if (profile && profile.gender) {
    const text = profile.gender.toLowerCase() === 'm' ? t('personalInformation.male') : t('personalInformation.female')
    genderTextIDs.push({ text })
  } else {
    genderTextIDs.push({ text: t('personalInformation.informationNotAvailable') })
  }

  return [
    { textLines: dateOfBirthTextIDs, a11yHintText: '', testId: getA11yLabelText(dateOfBirthTextIDs) },
    { textLines: genderTextIDs, a11yHintText: '' },
  ]
}

type phoneType = 'homePhoneNumber' | 'workPhoneNumber' | 'mobilePhoneNumber' | 'faxNumber'

const getTextForPhoneData = (profile: UserDataProfile | undefined, profileField: ProfileFormattedFieldType, phoneType: phoneType, t: TFunction): Array<TextLine> => {
  const textIDs: Array<TextLine> = []

  if (profile && profile[profileField]) {
    const extension = profile[phoneType].extension
    if (extension) {
      textIDs.push({ text: t('personalInformation.phoneWithExtension', { number: profile[profileField] as string, extension }) })
    } else {
      textIDs.push({ text: t('personalInformation.dynamicField', { field: profile[profileField] as string }) })
    }
  } else {
    textIDs.push({ text: t('personalInformation.addYour', { field: t(`personalInformation.${phoneType}`) }) })
  }

  return textIDs
}

const getPhoneNumberData = (
  profile: UserDataProfile | undefined,
  t: TFunction,
  onHomePhone: () => void,
  onWorkPhone: () => void,
  onCellPhone: () => void,
  onFax: () => void,
): Array<DefaultListItemObj> => {
  let homeText: Array<TextLine> = [{ text: t('personalInformation.home'), variant: 'MobileBodyBold' }]
  let workText: Array<TextLine> = [{ text: t('personalInformation.work'), variant: 'MobileBodyBold' }]
  let cellText: Array<TextLine> = [{ text: t('personalInformation.mobile'), variant: 'MobileBodyBold' }]
  let faxText: Array<TextLine> = [{ text: t('personalInformation.faxTextIDs'), variant: 'MobileBodyBold' }]

  homeText = homeText.concat(getTextForPhoneData(profile, 'formattedHomePhone', 'homePhoneNumber', t))
  workText = workText.concat(getTextForPhoneData(profile, 'formattedWorkPhone', 'workPhoneNumber', t))
  cellText = cellText.concat(getTextForPhoneData(profile, 'formattedMobilePhone', 'mobilePhoneNumber', t))
  faxText = faxText.concat(getTextForPhoneData(profile, 'formattedFaxPhone', 'faxNumber', t))

  return [
    { textLines: homeText, a11yHintText: t('personalInformation.editOrAddHomeNumber'), onPress: onHomePhone, testId: getA11yLabelText(homeText) },
    { textLines: workText, a11yHintText: t('personalInformation.editOrAddWorkNumber'), onPress: onWorkPhone, testId: getA11yLabelText(workText) },
    { textLines: cellText, a11yHintText: t('personalInformation.editOrAddCellNumber'), onPress: onCellPhone, testId: getA11yLabelText(cellText) },
    { textLines: faxText, a11yHintText: t('personalInformation.editOrAddFaxNumber'), onPress: onFax, testId: getA11yLabelText(faxText) },
  ]
}

const getEmailAddressData = (profile: UserDataProfile | undefined, t: TFunction, onEmailAddress: () => void): Array<DefaultListItemObj> => {
  const textLines: Array<TextLine> = [{ text: t('personalInformation.emailAddress'), variant: 'MobileBodyBold' }]

  if (profile?.contactEmail?.emailAddress) {
    textLines.push({ text: t('personalInformation.dynamicField', { field: profile.contactEmail.emailAddress }) })
  } else {
    textLines.push({ text: t('personalInformation.addYour', { field: t('personalInformation.emailAddress').toLowerCase() }) })
  }

  return [{ textLines: textLines, a11yHintText: t('personalInformation.editOrAddEmailAddress'), onPress: onEmailAddress, testId: getA11yLabelText(textLines) }]
}

type PersonalInformationScreenProps = StackScreenProps<ProfileStackParamList, 'PersonalInformation'>

const PersonalInformationScreen: FC<PersonalInformationScreenProps> = () => {
  const dispatch = useAppDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const { profile, loading, needsDataLoad } = useAppSelector((state) => state.personalInformation)

  const { contentMarginTop, contentMarginBottom, gutter, standardMarginBetween, condensedMarginBetween } = theme.dimensions
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
    console.debug('REVIEW EVENT REGISTERED')
    registerReviewEvent()
    setReviewEventRegistered(true)
  }
  const onMailingAddress = navigateTo('EditAddress', {
    displayTitle: t('personalInformation.mailingAddress'),
    addressType: profileAddressOptions.MAILING_ADDRESS,
  })

  const onResidentialAddress = navigateTo('EditAddress', {
    displayTitle: t('personalInformation.residentialAddress'),
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
    displayTitle: t('editPhoneNumber.cellPhoneTitle'),
    phoneType: PhoneTypeConstants.MOBILE,
    phoneData: profile ? profile.mobilePhoneNumber : ({} as PhoneData),
  })

  const onFax = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.faxPhoneTitle'),
    phoneType: PhoneTypeConstants.FAX,
    phoneData: profile ? profile.faxNumber : ({} as PhoneData),
  })

  const onEmailAddress = navigateTo('EditEmail')

  const linkProps: TextViewProps = {
    variant: 'MobileBody',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    mx: gutter,
    mt: standardMarginBetween,
  }

  const addressData: Array<addressDataField> = [
    { addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onMailingAddress },
    { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: onResidentialAddress },
  ]

  if (useError(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID} />
  }

  if (loading) {
    return (
      <React.Fragment>
        <ProfileBanner />
        <LoadingComponent />
      </React.Fragment>
    )
  }

  return (
    <VAScrollView {...testIdProps('Personal-information-page')}>
      <ProfileBanner />
      <TextView {...testIdProps(t('personalInformation.editNoteA11yLabel'))} variant="MobileBody" mx={gutter} mt={contentMarginTop}>
        {t('personalInformation.editNote')}
      </TextView>

      <DefaultList items={getPersonalInformationData(profile, t)} title={t('personalInformation.buttonTitle')} />

      <Pressable onPress={navigateTo('HowDoIUpdate')} {...testIdProps(t('personalInformation.howDoIUpdatePersonalInfo'))} accessibilityRole="link" accessible={true}>
        <TextView {...linkProps}>{t('personalInformation.howDoIUpdatePersonalInfo')}</TextView>
      </Pressable>

      <AddressSummary addressData={addressData} title={t('personalInformation.addresses')} />

      <DefaultList items={getPhoneNumberData(profile, t, onHomePhone, onWorkPhone, onCellPhone, onFax)} title={t('personalInformation.phoneNumbers')} />

      <Pressable onPress={navigateTo('HowWillYou')} {...testIdProps(t('personalInformation.howWillYouUseContactInfo.a11yLabel'))} accessibilityRole="link" accessible={true}>
        <TextView {...linkProps}>{t('personalInformation.howWillYouUseContactInfo')}</TextView>
      </Pressable>

      <DefaultList items={getEmailAddressData(profile, t, onEmailAddress)} title={t('personalInformation.contactEmailAddress')} />
      <TextView variant="TableHeaderLabel" mx={gutter} mt={condensedMarginBetween} mb={contentMarginBottom}>
        {t('personalInformation.thisIsEmailWeUseToContactNote')}
      </TextView>
    </VAScrollView>
  )
}

export default PersonalInformationScreen

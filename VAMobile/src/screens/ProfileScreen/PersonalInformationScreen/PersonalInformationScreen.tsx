import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { PersonalInformationState, StoreState } from 'store/reducers'
import { PhoneData, UserDataProfile } from 'store/api/types'

import { ButtonList, ButtonListItemObj, TextLine, TextView, TextViewProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../ProfileScreen'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTranslation } from 'utils/hooks'
import AddressSummary, { addressDataField, profileAddressOptions } from 'screens/ProfileScreen/AddressSummary'
import ProfileBanner from '../ProfileBanner'

const getPersonalInformationData = (profile: UserDataProfile | undefined, t: TFunction): Array<ButtonListItemObj> => {
  const dateOfBirthTextIDs: Array<TextLine> = [{ text: t('personalInformation.dateOfBirth'), isBold: true }]
  const genderTextIDs: Array<TextLine> = [{ text: t('personalInformation.gender'), isBold: true }]

  if (profile && profile.birth_date) {
    const formattedBirthDate = formatDateMMMMDDYYYY(profile.birth_date)
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
    { textLines: dateOfBirthTextIDs, a11yHintText: '' },
    { textLines: genderTextIDs, a11yHintText: '' },
  ]
}

type profileFieldType = 'formatted_home_phone' | 'formatted_work_phone' | 'formatted_mobile_phone' | 'formatted_fax_phone'
type phoneType = 'homeNumber' | 'workNumber' | 'cellNumber' | 'faxNumber'

const getTextForPhoneData = (profile: UserDataProfile | undefined, profileField: profileFieldType, phoneType: phoneType, t: TFunction): Array<TextLine> => {
  const textIDs: Array<TextLine> = []

  if (profile && profile[profileField]) {
    textIDs.push({ text: t('personalInformation.dynamicField', { field: profile[profileField] as string }) })
  } else {
    textIDs.push({ text: t('personalInformation.pleaseAddYour', { field: t(`personalInformation.${phoneType}`) }) })
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
): Array<ButtonListItemObj> => {
  let homeText: Array<TextLine> = [{ text: t('personalInformation.home'), isBold: true }]
  let workText: Array<TextLine> = [{ text: t('personalInformation.work'), isBold: true }]
  let cellText: Array<TextLine> = [{ text: t('personalInformation.cell'), isBold: true }]
  let faxText: Array<TextLine> = [{ text: t('personalInformation.faxTextIDs'), isBold: true }]

  homeText = homeText.concat(getTextForPhoneData(profile, 'formatted_home_phone', 'homeNumber', t))
  workText = workText.concat(getTextForPhoneData(profile, 'formatted_work_phone', 'workNumber', t))
  cellText = cellText.concat(getTextForPhoneData(profile, 'formatted_mobile_phone', 'cellNumber', t))
  faxText = faxText.concat(getTextForPhoneData(profile, 'formatted_fax_phone', 'faxNumber', t))

  return [
    { textLines: homeText, a11yHintText: t('personalInformation.editOrAddHomeNumber'), onPress: onHomePhone },
    { textLines: workText, a11yHintText: t('personalInformation.editOrAddWorkNumber'), onPress: onWorkPhone },
    { textLines: cellText, a11yHintText: t('personalInformation.editOrAddCellNumber'), onPress: onCellPhone },
    { textLines: faxText, a11yHintText: t('personalInformation.editOrAddFaxNumber'), onPress: onFax },
  ]
}

const getEmailAddressData = (profile: UserDataProfile | undefined, t: TFunction, onEmailAddress: () => void): Array<ButtonListItemObj> => {
  const textLines: Array<TextLine> = [{ text: t('personalInformation.emailAddress'), isBold: true }]

  if (profile && profile.email) {
    textLines.push({ text: t('personalInformation.dynamicField', { field: profile.email }) })
  } else {
    textLines.push({ text: t('personalInformation.pleaseAddYour', { field: t('personalInformation.emailAddress').toLowerCase() }) })
  }

  return [{ textLines: textLines, a11yHintText: t('personalInformation.editOrAddEmailAddress'), onPress: onEmailAddress }]
}

type PersonalInformationScreenProps = StackScreenProps<ProfileStackParamList, 'PersonalInformation'>

const PersonalInformationScreen: FC<PersonalInformationScreenProps> = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  const navigateTo = useRouteNavigation()

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
    phoneType: 'HOME',
    phoneData: profile ? profile.home_phone : ({} as PhoneData),
  })

  const onWorkPhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.workPhoneTitle'),
    phoneType: 'WORK',
    phoneData: profile ? profile.work_phone : ({} as PhoneData),
  })

  const onCellPhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.cellPhoneTitle'),
    phoneType: 'MOBILE',
    phoneData: profile ? profile.mobile_phone : ({} as PhoneData),
  })

  const onFax = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.faxPhoneTitle'),
    phoneType: 'FAX',
    phoneData: profile ? profile.fax_phone : ({} as PhoneData),
  })

  const onEmailAddress = navigateTo('EditEmail')

  const linkProps: TextViewProps = {
    variant: 'MobileBody',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    ml: 20,
    mt: 15,
    mr: 47,
    mb: 20,
    accessibilityRole: 'link',
  }

  const howDoIUpdateProps: TextViewProps = {
    ...linkProps,
    onPress: navigateTo('HowDoIUpdate'),
  }

  const howWillYouProps: TextViewProps = {
    ...linkProps,
    onPress: navigateTo('HowWillYou'),
  }

  const addressData: Array<addressDataField> = [
    { addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onMailingAddress },
    { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: onResidentialAddress },
  ]

  return (
    <ScrollView {...testIdProps('Personal-information-screen')}>
      <ProfileBanner name={profile ? profile.full_name : ''} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
      <TextView variant="MobileBody" ml={20} mt={20} mr={25} mb={12}>
        {t('personalInformation.editNote')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mb={4} accessibilityRole="header" {...testIdProps(generateTestID(t('personalInformation.headerTitle'), ''))}>
        {t('personalInformation.headerTitle')}
      </TextView>
      <ButtonList items={getPersonalInformationData(profile, t)} />
      <TextView {...howDoIUpdateProps} {...testIdProps(generateTestID(t('personalInformation.howDoIUpdatePersonalInfo'), ''))}>
        {t('personalInformation.howDoIUpdatePersonalInfo')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mt={8} mb={4} accessibilityRole="header" {...testIdProps(generateTestID(t('personalInformation.addresses'), ''))}>
        {t('personalInformation.addresses')}
      </TextView>
      <AddressSummary addressData={addressData} />
      <TextView variant="TableHeaderBold" ml={20} mt={43} mb={4} accessibilityRole="header" {...testIdProps(generateTestID(t('personalInformation.phoneNumbers'), ''))}>
        {t('personalInformation.phoneNumbers')}
      </TextView>
      <ButtonList items={getPhoneNumberData(profile, t, onHomePhone, onWorkPhone, onCellPhone, onFax)} />
      <TextView {...howWillYouProps} {...testIdProps(generateTestID(t('personalInformation.howWillYouUseContactInfo'), ''))}>
        {t('personalInformation.howWillYouUseContactInfo')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mt={8} mb={4} accessibilityRole="header" {...testIdProps(generateTestID(t('personalInformation.contactEmailAddress'), ''))}>
        {t('personalInformation.contactEmailAddress')}
      </TextView>
      <ButtonList items={getEmailAddressData(profile, t, onEmailAddress)} />
      <TextView variant="TableHeaderLabel" mx={20} mt={10} mb={45}>
        {t('personalInformation.thisIsEmailWeUseToContactNote')}
      </TextView>
    </ScrollView>
  )
}

export default PersonalInformationScreen

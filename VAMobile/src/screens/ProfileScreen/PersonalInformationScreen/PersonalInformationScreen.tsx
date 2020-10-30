import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { format } from 'date-fns'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { PersonalInformationState, StoreState } from 'store/reducers'
import { PhoneData, UserDataProfile } from 'store/api/types'

import { ButtonList, ButtonListItemObj, TextView, TextViewProps, textIDObj } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../ProfileScreen'
import { generateTestID } from 'utils/common'
import { startEditEmail } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTranslation } from 'utils/hooks'
import AddressSummary, { addressDataField, profileAddressOptions } from 'screens/ProfileScreen/AddressSummary'
import ProfileBanner from '../ProfileBanner'

const getPersonalInformationData = (profile: UserDataProfile | undefined): Array<ButtonListItemObj> => {
  const dateOfBirthTextIDs: Array<textIDObj> = [{ textID: 'personalInformation.dateOfBirth' }]
  const genderTextIDs: Array<textIDObj> = [{ textID: 'personalInformation.gender' }]

  if (profile && profile.birth_date) {
    const birthDate = new Date(profile.birth_date)
    const formattedBirthDate = format(new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getUTCDate()), 'MMMM dd, yyyy')
    dateOfBirthTextIDs.push({ textID: 'personalInformation.dynamicField', fieldObj: { field: formattedBirthDate } })
  } else {
    dateOfBirthTextIDs.push({ textID: 'personalInformation.informationNotAvailable' })
  }

  if (profile && profile.gender) {
    const textID = profile.gender.toLowerCase() === 'm' ? 'personalInformation.male' : 'personalInformation.female'
    genderTextIDs.push({ textID })
  } else {
    genderTextIDs.push({ textID: 'personalInformation.informationNotAvailable' })
  }

  return [
    { textIDs: dateOfBirthTextIDs, a11yHintID: '' },
    { textIDs: genderTextIDs, a11yHintID: '' },
  ]
}

type profileFieldType = 'formatted_home_phone' | 'formatted_work_phone' | 'formatted_mobile_phone' | 'formatted_fax_phone'
type phoneType = 'homeNumber' | 'workNumber' | 'cellNumber' | 'faxNumber'

const getTextIDsForPhoneData = (profile: UserDataProfile | undefined, profileField: profileFieldType, phoneType: phoneType, translate: TFunction): Array<textIDObj> => {
  const textIDs: Array<textIDObj> = []

  if (profile && profile[profileField]) {
    textIDs.push({ textID: 'personalInformation.dynamicField', fieldObj: { field: profile[profileField] as string } })
  } else {
    textIDs.push({ textID: 'personalInformation.pleaseAddYour', fieldObj: { field: translate(`personalInformation.${phoneType}`) } })
  }

  return textIDs
}

const getPhoneNumberData = (
  profile: UserDataProfile | undefined,
  translate: TFunction,
  onHomePhone: () => void,
  onWorkPhone: () => void,
  onCellPhone: () => void,
  onFax: () => void,
): Array<ButtonListItemObj> => {
  let homeTextIDs: Array<textIDObj> = [{ textID: 'personalInformation.home' }]
  let workTextIDs: Array<textIDObj> = [{ textID: 'personalInformation.work' }]
  let cellTextIDs: Array<textIDObj> = [{ textID: 'personalInformation.cell' }]
  let faxTextIDs: Array<textIDObj> = [{ textID: 'personalInformation.faxTextIDs' }]

  homeTextIDs = homeTextIDs.concat(getTextIDsForPhoneData(profile, 'formatted_home_phone', 'homeNumber', translate))
  workTextIDs = workTextIDs.concat(getTextIDsForPhoneData(profile, 'formatted_work_phone', 'workNumber', translate))
  cellTextIDs = cellTextIDs.concat(getTextIDsForPhoneData(profile, 'formatted_mobile_phone', 'cellNumber', translate))
  faxTextIDs = faxTextIDs.concat(getTextIDsForPhoneData(profile, 'formatted_fax_phone', 'faxNumber', translate))

  return [
    { textIDs: homeTextIDs, a11yHintID: 'personalInformation.editOrAddHomeNumber', onPress: onHomePhone },
    { textIDs: workTextIDs, a11yHintID: 'personalInformation.editOrAddWorkNumber', onPress: onWorkPhone },
    { textIDs: cellTextIDs, a11yHintID: 'personalInformation.editOrAddCellNumber', onPress: onCellPhone },
    { textIDs: faxTextIDs, a11yHintID: 'personalInformation.editOrAddFaxNumber', onPress: onFax },
  ]
}

const getEmailAddressData = (profile: UserDataProfile | undefined, translate: TFunction, onEmailAddress: () => void): Array<ButtonListItemObj> => {
  const textIDs: Array<textIDObj> = [{ textID: 'personalInformation.emailAddress' }]

  if (profile && profile.email) {
    textIDs.push({ textID: 'personalInformation.dynamicField', fieldObj: { field: profile.email } })
  } else {
    textIDs.push({ textID: 'personalInformation.pleaseAddYour', fieldObj: { field: translate('personalInformation.emailAddress').toLowerCase() } })
  }

  return [{ textIDs, a11yHintID: 'personalInformation.editOrAddEmailAddress', onPress: onEmailAddress }]
}

type PersonalInformationScreenProps = StackScreenProps<ProfileStackParamList, 'PersonalInformation'>

const PersonalInformationScreen: FC<PersonalInformationScreenProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const dispatch = useDispatch()
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  const navigateTo = useRouteNavigation()

  const onMailingAddress = (): void => {
    navigation.navigate('EditAddress', { displayTitle: t('personalInformation.mailingAddress') })
  }

  const onResidentialAddress = (): void => {
    navigation.navigate('EditAddress', { displayTitle: t('personalInformation.residentialAddress') })
  }

  const onHomePhone = (): void => {
    navigation.navigate('EditPhoneNumber', { displayTitle: t('editPhoneNumber.homePhoneTitle'), phoneType: 'HOME', phoneData: profile ? profile.home_phone : ({} as PhoneData) })
  }

  const onWorkPhone = (): void => {
    navigation.navigate('EditPhoneNumber', { displayTitle: t('editPhoneNumber.workPhoneTitle'), phoneType: 'WORK', phoneData: profile ? profile.work_phone : ({} as PhoneData) })
  }

  const onCellPhone = (): void => {
    navigation.navigate('EditPhoneNumber', {
      displayTitle: t('editPhoneNumber.cellPhoneTitle'),
      phoneType: 'MOBILE',
      phoneData: profile ? profile.mobile_phone : ({} as PhoneData),
    })
  }

  const onFax = (): void => {
    navigation.navigate('EditPhoneNumber', { displayTitle: t('editPhoneNumber.faxPhoneTitle'), phoneType: 'FAX', phoneData: profile ? profile.fax_phone : ({} as PhoneData) })
  }

  const onEmailAddress = (): void => {
    dispatch(startEditEmail())
    navigation.navigate('EditEmail')
  }

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
      <ButtonList items={getPersonalInformationData(profile)} translationNameSpace="profile" />
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
      <ButtonList items={getPhoneNumberData(profile, t, onHomePhone, onWorkPhone, onCellPhone, onFax)} translationNameSpace="profile" />
      <TextView {...howWillYouProps} {...testIdProps(generateTestID(t('personalInformation.howWillYouUseContactInfo'), ''))}>
        {t('personalInformation.howWillYouUseContactInfo')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mt={8} mb={4} accessibilityRole="header" {...testIdProps(generateTestID(t('personalInformation.contactEmailAddress'), ''))}>
        {t('personalInformation.contactEmailAddress')}
      </TextView>
      <ButtonList items={getEmailAddressData(profile, t, onEmailAddress)} translationNameSpace="profile" />
      <TextView variant="TableHeaderLabel" mx={20} mt={10} mb={45}>
        {t('personalInformation.thisIsEmailWeUseToContactNote')}
      </TextView>
    </ScrollView>
  )
}

export default PersonalInformationScreen

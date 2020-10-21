import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AddressData } from 'store/api/types'
import { AuthState, StoreState } from 'store/reducers'
import { ButtonList, ButtonListItemObj, TextView, textIDObj } from 'components'
import { ProfileStackParamList } from '../ProfileScreen'
import { format } from 'date-fns'
import { useTranslation } from 'utils/hooks'
import ProfileBanner from '../ProfileBanner'

type PersonalInformationScreenProps = StackScreenProps<ProfileStackParamList, 'PersonalInformation'>

const PersonalInformationScreen: FC<PersonalInformationScreenProps> = () => {
  const t = useTranslation('profile')
  const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)

  const onMailingAddress = (): void => {}

  const onResidentialAddress = (): void => {}

  const onHomePhone = (): void => {}

  const onWorkPhone = (): void => {}

  const onCellPhone = (): void => {}

  const onFax = (): void => {}

  const onEmailAddress = (): void => {}

  const getPersonalInformationData = (): Array<ButtonListItemObj> => {
    const dateOfBirthTextIDs: Array<textIDObj> = [{ textID: 'personalInformationScreen.dateOfBirth' }]
    const genderTextIDs: Array<textIDObj> = [{ textID: 'personalInformationScreen.gender' }]

    if (profile && profile.birth_date) {
      const birthDate = new Date(profile.birth_date)
      const formattedBirthDate = format(new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getUTCDate()), 'MMMM dd, yyyy')
      dateOfBirthTextIDs.push({ textID: 'personalInformationScreen.dynamicField', fieldObj: { field: formattedBirthDate } })
    } else {
      dateOfBirthTextIDs.push({ textID: 'personalInformationScreen.informationNotAvailable' })
    }

    if (profile && profile.gender) {
      const textID = profile.gender.toLowerCase() === 'm' ? 'personalInformationScreen.male' : 'personalInformationScreen.female'
      genderTextIDs.push({ textID })
    } else {
      genderTextIDs.push({ textID: 'personalInformationScreen.informationNotAvailable' })
    }

    return [
      { textIDs: dateOfBirthTextIDs, a11yHintID: '' },
      { textIDs: genderTextIDs, a11yHintID: '' },
    ]
  }

  const getCityStateZip = (address: AddressData): string => {
    return [address.city, address.stateCode, address.zipCode].filter(Boolean).join(', ').trim()
  }

  type profileAddressType = 'mailing_address' | 'residential_address'
  type translationAddressType = 'mailingAddress' | 'residentialAddress'

  const getTextIDsForAddressData = (profileAddressType: profileAddressType, translationAddressType: translationAddressType): Array<textIDObj> => {
    const textIDs: Array<textIDObj> = []

    if (profile && profile[profileAddressType]) {
      const address = profile[profileAddressType] as AddressData

      if (address.addressLine1) {
        textIDs.push({ textID: 'personalInformationScreen.dynamicField', fieldObj: { field: address.addressLine1 } })
      }

      if (address.addressLine2) {
        textIDs.push({ textID: 'personalInformationScreen.dynamicField', fieldObj: { field: address.addressLine2 } })
      }

      if (address.addressLine3) {
        textIDs.push({ textID: 'personalInformationScreen.dynamicField', fieldObj: { field: address.addressLine3 } })
      }

      const cityStateZip = getCityStateZip(address)
      if (cityStateZip !== '') {
        textIDs.push({ textID: 'personalInformationScreen.dynamicField', fieldObj: { field: cityStateZip } })
      }

      // if no address data exists, add please add your ___ message
      if ([address.addressLine1, address.addressLine2, address.addressLine3].filter(Boolean).length === 0 && cityStateZip === '') {
        textIDs.push({ textID: 'personalInformationScreen.pleaseAddYour', fieldObj: { field: t(`personalInformationScreen.${translationAddressType}`).toLowerCase() } })
      }
    } else {
      textIDs.push({ textID: 'personalInformationScreen.pleaseAddYour', fieldObj: { field: t(`personalInformationScreen.${translationAddressType}`).toLowerCase() } })
    }

    return textIDs
  }

  const getAddressData = (): Array<ButtonListItemObj> => {
    let mailingTextIDs: Array<textIDObj> = [{ textID: 'personalInformationScreen.mailingAddress' }]
    let residentialTextIDs: Array<textIDObj> = [{ textID: 'personalInformationScreen.residentialAddress' } as textIDObj]

    mailingTextIDs = mailingTextIDs.concat(getTextIDsForAddressData('mailing_address', 'mailingAddress'))
    residentialTextIDs = residentialTextIDs.concat(getTextIDsForAddressData('residential_address', 'residentialAddress'))

    return [
      { textIDs: mailingTextIDs, a11yHintID: '', onPress: onMailingAddress },
      { textIDs: residentialTextIDs, a11yHintID: '', onPress: onResidentialAddress },
    ]
  }

  type profileFieldType = 'formatted_home_phone' | 'formatted_work_phone' | 'formatted_mobile_phone' | 'formatted_fax_phone'
  type phoneType = 'homeNumber' | 'workNumber' | 'cellNumber' | 'faxNumber'

  const getTextIDsForPhoneData = (profileField: profileFieldType, phoneType: phoneType): Array<textIDObj> => {
    const textIDs: Array<textIDObj> = []

    if (profile && profile[profileField]) {
      textIDs.push({ textID: 'personalInformationScreen.dynamicField', fieldObj: { field: profile[profileField] as string } })
    } else {
      textIDs.push({ textID: 'personalInformationScreen.pleaseAddYour', fieldObj: { field: t(`personalInformationScreen.${phoneType}`) } })
    }

    return textIDs
  }

  const getPhoneNumberData = (): Array<ButtonListItemObj> => {
    let homeTextIDs: Array<textIDObj> = [{ textID: 'personalInformationScreen.home' }]
    let workTextIDs: Array<textIDObj> = [{ textID: 'personalInformationScreen.work' }]
    let cellTextIDs: Array<textIDObj> = [{ textID: 'personalInformationScreen.cell' }]
    let faxTextIDs: Array<textIDObj> = [{ textID: 'personalInformationScreen.faxTextIDs' }]

    homeTextIDs = homeTextIDs.concat(getTextIDsForPhoneData('formatted_home_phone', 'homeNumber'))
    workTextIDs = workTextIDs.concat(getTextIDsForPhoneData('formatted_work_phone', 'workNumber'))
    cellTextIDs = cellTextIDs.concat(getTextIDsForPhoneData('formatted_mobile_phone', 'cellNumber'))
    faxTextIDs = faxTextIDs.concat(getTextIDsForPhoneData('formatted_fax_phone', 'faxNumber'))

    return [
      { textIDs: homeTextIDs, a11yHintID: '', onPress: onHomePhone },
      { textIDs: workTextIDs, a11yHintID: '', onPress: onWorkPhone },
      { textIDs: cellTextIDs, a11yHintID: '', onPress: onCellPhone },
      { textIDs: faxTextIDs, a11yHintID: '', onPress: onFax },
    ]
  }

  const getEmailAddressData = (): Array<ButtonListItemObj> => {
    const textIDs: Array<textIDObj> = [{ textID: 'personalInformationScreen.emailAddress' }]

    if (profile && profile.email) {
      textIDs.push({ textID: 'personalInformationScreen.dynamicField', fieldObj: { field: profile.email } })
    } else {
      textIDs.push({ textID: 'personalInformationScreen.pleaseAddYour', fieldObj: { field: t('personalInformationScreen.emailAddress').toLowerCase() } })
    }

    return [{ textIDs, a11yHintID: '', onPress: onEmailAddress }]
  }

  return (
    <ScrollView>
      <ProfileBanner name={profile ? profile.full_name : ''} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
      <TextView variant="MobileBody" ml={20} mt={20} mr={25} mb={12}>
        {t('personalInformationScreen.editNote')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mr={25} mb={4} accessibilityRole="header">
        {t('personalInformationScreen.title')}
      </TextView>
      <ButtonList items={getPersonalInformationData()} translationNameSpace="profile" />
      <TextView variant="MobileBody" color="link" textDecoration="underline" textDecorationColor="link" ml={20} mt={15} mr={47} mb={20} accessibilityRole="link">
        {t('personalInformationScreen.howDoIUpdatePersonalInfo')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mt={8} mr={25} mb={4} accessibilityRole="header">
        {t('personalInformationScreen.addresses')}
      </TextView>
      <ButtonList items={getAddressData()} translationNameSpace="profile" />
      <TextView variant="TableHeaderBold" ml={20} mt={43} mr={25} mb={4} accessibilityRole="header">
        {t('personalInformationScreen.phoneNumbers')}
      </TextView>
      <ButtonList items={getPhoneNumberData()} translationNameSpace="profile" />
      <TextView variant="MobileBody" color="link" textDecoration="underline" textDecorationColor="link" ml={20} mt={15} mr={47} mb={20} accessibilityRole="link">
        {t('personalInformationScreen.howWillYouUseContactInfo')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mt={8} mr={25} mb={4} accessibilityRole="header">
        {t('personalInformationScreen.contactEmailAddress')}
      </TextView>
      <ButtonList items={getEmailAddressData()} translationNameSpace="profile" />
      <TextView variant="TableHeaderLabel" mx={20} mt={10} mb={45}>
        {t('personalInformationScreen.thisIsEmailWeUseToContactNote')}
      </TextView>
    </ScrollView>
  )
}

export default PersonalInformationScreen

import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AddressData } from 'store/api/types'
import { AuthState, StoreState } from 'store/reducers'
import { ButtonList, ButtonListItemObj, TextView } from 'components'
import { format } from 'date-fns'
import { useTranslation } from 'utils/hooks'
import ProfileBanner from '../ProfileBanner'

const PersonalInformationScreen: FC = () => {
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
    const dateOfBirthTextIDs = ['personalInformationScreen.dateOfBirth']
    const genderTextIDs = ['personalInformationScreen.gender']

    if (profile && profile.birth_date) {
      const birthDate = new Date(profile.birth_date)
      const formattedBirthDate = format(new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getUTCDate()), 'MMMM dd, yyyy')
      dateOfBirthTextIDs.push(formattedBirthDate)
    } else {
      dateOfBirthTextIDs.push('personalInformationScreen.informationNotAvailable')
    }

    if (profile && profile.gender) {
      genderTextIDs.push(profile.gender === 'M' ? 'personalInformationScreen.male' : 'personalInformationScreen.female')
    } else {
      genderTextIDs.push('personalInformationScreen.informationNotAvailable')
    }

    return [
      { textIDs: dateOfBirthTextIDs, a11yHintID: '' },
      { textIDs: genderTextIDs, a11yHintID: '' },
    ]
  }

  const getCityStateZip = (address: AddressData): string => {
    return [address.city, address.stateCode, address.zipCode].filter(Boolean).join(', ').trim()
  }

  const getTextIDsForAddressData = (address: AddressData, addressType: 'mailingAddress' | 'residentialAddress'): Array<string> => {
    const textIDs = []

    if (address.addressLine1) {
      textIDs.push(address.addressLine1)
    }

    if (address.addressLine2) {
      textIDs.push(address.addressLine2)
    }

    if (address.addressLine3) {
      textIDs.push(address.addressLine3)
    }

    const cityStateZip = getCityStateZip(address)
    if (cityStateZip !== '') {
      textIDs.push(cityStateZip)
    }

    // if no address data exists, add please add your ___ message
    if ([address.addressLine1, address.addressLine2, address.addressLine3].filter(Boolean).length === 0 && cityStateZip === '') {
      textIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t(`personalInformationScreen.${addressType}`).toLowerCase() }))
    }

    return textIDs
  }

  const getAddressData = (): Array<ButtonListItemObj> => {
    let mailingTextIDs = ['personalInformationScreen.mailingAddress']
    let residentialTextIDs = ['personalInformationScreen.residentialAddress']

    if (profile && profile.mailing_address) {
      mailingTextIDs = mailingTextIDs.concat(getTextIDsForAddressData(profile.mailing_address, 'mailingAddress'))
    } else {
      mailingTextIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t('personalInformationScreen.mailingAddress').toLowerCase() }))
    }

    if (profile && profile.residential_address) {
      residentialTextIDs = residentialTextIDs.concat(getTextIDsForAddressData(profile.residential_address, 'residentialAddress'))
    } else {
      residentialTextIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t('personalInformationScreen.residentialAddress').toLowerCase() }))
    }

    return [
      { textIDs: mailingTextIDs, a11yHintID: '', onPress: onMailingAddress },
      { textIDs: residentialTextIDs, a11yHintID: '', onPress: onResidentialAddress },
    ]
  }

  type profileFieldType = 'formatted_home_phone' | 'formatted_work_phone' | 'formatted_mobile_phone' | 'formatted_fax_phone'
  type phoneType = 'homeNumber' | 'workNumber' | 'cellNumber' | 'faxNumber'

  const getTextIDsForPhoneData = (profileField: profileFieldType, phoneType: phoneType): Array<string> => {
    const textIDs = []

    if (profile && profile[profileField]) {
      textIDs.push(profile[profileField] as string)
    } else {
      textIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t(`personalInformationScreen.${phoneType}`) }))
    }

    return textIDs
  }

  const getPhoneNumberData = (): Array<ButtonListItemObj> => {
    let homeTextIDs = ['personalInformationScreen.home']
    let workTextIDs = ['personalInformationScreen.work']
    let cellTextIDs = ['personalInformationScreen.cell']
    let faxTextIDs = ['personalInformationScreen.faxTextIDs']

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
    const textIDs = ['personalInformationScreen.emailAddress']

    if (profile && profile.email) {
      textIDs.push(profile.email)
    } else {
      textIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t('personalInformationScreen.emailAddress').toLowerCase() }))
    }

    return [{ textIDs, a11yHintID: '', onPress: onEmailAddress }]
  }

  return (
    <ScrollView>
      <ProfileBanner name={profile ? profile.full_name : ''} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
      <TextView variant="MobileBody" ml={20} mt={20} mr={25} mb={12}>
        {t('personalInformationScreen.editNote')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mr={25} mb={4}>
        {t('personalInformationScreen.title')}
      </TextView>
      <ButtonList items={getPersonalInformationData()} translationNameSpace="profile" />
      <TextView variant="MobileBody" color="link" textDecoration="underline" textDecorationColor="link" ml={20} mt={15} mr={47} mb={20}>
        {t('personalInformationScreen.howDoIUpdatePersonalInfo')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mt={8} mr={25} mb={4}>
        {t('personalInformationScreen.addresses')}
      </TextView>
      <ButtonList items={getAddressData()} translationNameSpace="profile" />
      <TextView variant="TableHeaderBold" ml={20} mt={43} mr={25} mb={4}>
        {t('personalInformationScreen.phoneNumbers')}
      </TextView>
      <ButtonList items={getPhoneNumberData()} translationNameSpace="profile" />
      <TextView variant="MobileBody" color="link" textDecoration="underline" textDecorationColor="link" ml={20} mt={15} mr={47} mb={20}>
        {t('personalInformationScreen.howWillYouUseContactInfo')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mt={8} mr={25} mb={4}>
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

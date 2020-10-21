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

  // TODO: check and simplify
  const getAddressData = (): Array<ButtonListItemObj> => {
    const mailingTextIDs = ['personalInformationScreen.mailingAddress']
    const residentialTextIDs = ['personalInformationScreen.residentialAddress']

    if (profile && profile.mailing_address) {
      const { mailing_address } = profile

      if (mailing_address.addressLine1) {
        mailingTextIDs.push(mailing_address.addressLine1)
      }

      if (mailing_address.addressLine2) {
        mailingTextIDs.push(mailing_address.addressLine2)
      }

      if (mailing_address.addressLine3) {
        mailingTextIDs.push(mailing_address.addressLine3)
      }

      const cityStateZip = getCityStateZip(mailing_address)
      if (cityStateZip !== '') {
        mailingTextIDs.push(cityStateZip)
      }

      if ([mailing_address.addressLine1, mailing_address.addressLine2, mailing_address.addressLine3].filter(Boolean).length === 0 && cityStateZip === '') {
        mailingTextIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t('personalInformationScreen.mailingAddress') }))
      }
    } else {
      mailingTextIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t('personalInformationScreen.mailingAddress') }))
    }

    if (profile && profile.residential_address) {
      const { residential_address } = profile

      if (residential_address.addressLine1) {
        residentialTextIDs.push(residential_address.addressLine1)
      }

      if (residential_address.addressLine2) {
        residentialTextIDs.push(residential_address.addressLine2)
      }

      if (residential_address.addressLine3) {
        residentialTextIDs.push(residential_address.addressLine3)
      }

      const cityStateZip = getCityStateZip(residential_address)
      if (cityStateZip !== '') {
        residentialTextIDs.push(cityStateZip)
      }

      if ([residential_address.addressLine1, residential_address.addressLine2, residential_address.addressLine3].filter(Boolean).length === 0 && cityStateZip === '') {
        residentialTextIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t('personalInformationScreen.mailingAddress') }))
      }
    } else {
      residentialTextIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t('personalInformationScreen.mailingAddress') }))
    }

    return [
      { textIDs: mailingTextIDs, a11yHintID: '', onPress: onMailingAddress },
      { textIDs: residentialTextIDs, a11yHintID: '', onPress: onResidentialAddress },
    ]
  }

  const getPhoneNumberData = (): Array<ButtonListItemObj> => {
    const homeTextIDs = ['personalInformationScreen.home']
    const workTextIDs = ['personalInformationScreen.work']
    const cellTextIDs = ['personalInformationScreen.cell']
    const faxTextIDs = ['personalInformationScreen.faxTextIDs']

    if (profile && profile.formatted_home_phone) {
      homeTextIDs.push(profile.formatted_home_phone)
    } else {
      homeTextIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t('personalInformationScreen.homeNumber') }))
    }

    if (profile && profile.formatted_work_phone) {
      workTextIDs.push(profile.formatted_work_phone)
    } else {
      workTextIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t('personalInformationScreen.workNumber') }))
    }

    if (profile && profile.formatted_mobile_phone) {
      cellTextIDs.push(profile.formatted_mobile_phone)
    } else {
      cellTextIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t('personalInformationScreen.cellNumber') }))
    }

    if (profile && profile.formatted_fax_phone) {
      faxTextIDs.push(profile.formatted_fax_phone)
    } else {
      faxTextIDs.push(t('personalInformationScreen.pleaseAddYour', { field: t('personalInformationScreen.faxNumber') }))
    }

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

import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import _ from 'underscore'

import { AddressData, UserDataProfile, addressTypeFields } from 'store/api/types'
import { ButtonList, ButtonListItemObj, textIDObj } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { TFunction } from 'i18next'
import { useTranslation } from 'utils/hooks'

export const profileAddressOptions: {
  MAILING_ADDRESS: profileAddressType
  RESIDENTIAL_ADDRESS: profileAddressType
} = {
  MAILING_ADDRESS: 'mailing_address',
  RESIDENTIAL_ADDRESS: 'residential_address',
}
export type profileAddressType = 'mailing_address' | 'residential_address'

const profileTranslationAddressOptions: {
  MAILING_ADDRESS: translationAddressType
  RESIDENTIAL_ADDRESS: translationAddressType
} = {
  MAILING_ADDRESS: 'mailingAddress',
  RESIDENTIAL_ADDRESS: 'residentialAddress',
}
type translationAddressType = 'mailingAddress' | 'residentialAddress'

const getCommaSeparatedAddressLine = (address: AddressData): string => {
  let fieldList = []
  let joinBy = ', '

  if (address.addressType === addressTypeFields.domestic) {
    // US addresses
    fieldList = [address.city, address.stateCode, address.zipCode]
  } else if (address.addressType === addressTypeFields.overseasMilitary) {
    // Military addresses
    const city = address.city ? `${address.city},` : undefined
    fieldList = [city, address.stateCode, address.zipCode]
    joinBy = ' '
  } else {
    // International addresses
    fieldList = [address.city, address.internationalPostalCode]
  }

  return fieldList.filter(Boolean).join(joinBy).trim()
}

const getTextIDsForAddressData = (
  profile: UserDataProfile | undefined,
  profileAddressType: profileAddressType,
  translationAddressType: translationAddressType,
  translate: TFunction,
): Array<textIDObj> => {
  const textIDs: Array<textIDObj> = []

  if (profile && profile[profileAddressType]) {
    const address = profile[profileAddressType] as AddressData

    if (address.addressLine1) {
      textIDs.push({ textID: 'personalInformation.dynamicField', fieldObj: { field: address.addressLine1 } })
    }

    if (address.addressLine2) {
      textIDs.push({ textID: 'personalInformation.dynamicField', fieldObj: { field: address.addressLine2 } })
    }

    if (address.addressLine3) {
      textIDs.push({ textID: 'personalInformation.dynamicField', fieldObj: { field: address.addressLine3 } })
    }

    const commaSeparatedAddressLine = getCommaSeparatedAddressLine(address)
    if (commaSeparatedAddressLine !== '') {
      textIDs.push({ textID: 'personalInformation.dynamicField', fieldObj: { field: commaSeparatedAddressLine } })
    }

    if (address.addressType === addressTypeFields.international && address.countryCode) {
      textIDs.push({ textID: 'personalInformation.dynamicField', fieldObj: { field: address.countryCode } })
    }

    // if no address data exists, add please add your ___ message
    if ([address.addressLine1, address.addressLine2, address.addressLine3].filter(Boolean).length === 0 && commaSeparatedAddressLine === '') {
      // if its an international address, check additionally if countryCode does not exist
      if ((address.addressType === addressTypeFields.international && !address.countryCode) || address.addressType !== addressTypeFields.international) {
        textIDs.push({ textID: 'personalInformation.pleaseAddYour', fieldObj: { field: translate(`personalInformation.${translationAddressType}`).toLowerCase() } })
      }
    }
  } else {
    textIDs.push({ textID: 'personalInformation.pleaseAddYour', fieldObj: { field: translate(`personalInformation.${translationAddressType}`).toLowerCase() } })
  }

  return textIDs
}

const getAddressData = (profile: UserDataProfile | undefined, translate: TFunction, addressData: Array<addressDataField>): Array<ButtonListItemObj> => {
  const resultingData: Array<ButtonListItemObj> = []

  _.map(addressData, ({ addressType, onPress }) => {
    const addressTypeTranslation =
      addressType === profileAddressOptions.MAILING_ADDRESS ? profileTranslationAddressOptions.MAILING_ADDRESS : profileTranslationAddressOptions.RESIDENTIAL_ADDRESS
    let textIDs: Array<textIDObj> = [{ textID: `personalInformation.${addressTypeTranslation}` }]

    textIDs = textIDs.concat(getTextIDsForAddressData(profile, addressType, addressTypeTranslation, translate))
    const a11yHintTextSuffix = addressType === profileAddressOptions.MAILING_ADDRESS ? 'editOrAddMailingAddress' : 'editOrAddResidentialAddress'

    resultingData.push({ textIDs, a11yHintText: translate(`personalInformation.${a11yHintTextSuffix}`), onPress })
  })

  return resultingData
}

/**
 * Signifies the type of the array items in {@link AddressSummaryProps} addressData
 */
export type addressDataField = {
  /** Address type of the address displayed */
  addressType: profileAddressType
  /** Called on press of the address summary */
  onPress: () => void
}

/**
 * Signifies the props that need to be passed into {@link AddressSummary}
 */
export type AddressSummaryProps = {
  /** List of objects containing the addressType and onPress function */
  addressData: Array<addressDataField>
}

const AddressSummary: FC<AddressSummaryProps> = ({ addressData }) => {
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const t = useTranslation(NAMESPACE.PROFILE)

  const data = getAddressData(profile, t, addressData)

  return <ButtonList items={data} translationNameSpace="profile" />
}

export default AddressSummary

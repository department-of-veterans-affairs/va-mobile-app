import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import _ from 'underscore'

import { AddressData, UserDataProfile, addressTypeFields } from 'store/api/types'
import { Countries } from 'constants/countries'
import { DefaultList, DefaultListItemObj, ListProps, TextLine } from 'components'
import { MilitaryStates } from 'constants/militaryStates'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { TFunction } from 'i18next'
import { generateTestID, getAllFieldsThatExist } from 'utils/common'
import { useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { IS_TEST } = getEnv()

export const profileAddressOptions: {
  MAILING_ADDRESS: profileAddressType
  RESIDENTIAL_ADDRESS: profileAddressType
} = {
  MAILING_ADDRESS: 'mailingAddress',
  RESIDENTIAL_ADDRESS: 'residentialAddress',
}
export type profileAddressType = 'mailingAddress' | 'residentialAddress'

const getCommaSeparatedAddressLine = (address: AddressData): string => {
  let fieldList = []
  let joinBy = ', '

  if (address.addressType === addressTypeFields.domestic) {
    // US addresses
    fieldList = [address.city, address.stateCode, address.zipCode]
  } else if (address.addressType === addressTypeFields.overseasMilitary) {
    // Military addresses
    const city = address.city ? `${address.city},` : undefined
    const stateLabel = address.stateCode ? MilitaryStates.find((militaryState) => militaryState.value === address.stateCode)?.label : undefined
    fieldList = [city, stateLabel, address.zipCode]
    joinBy = ' '
  } else {
    // International addresses
    fieldList = [address.city, address.province, address.internationalPostalCode]
  }

  return fieldList.filter(Boolean).join(joinBy).trim()
}

export const getTextForAddressData = (profile: UserDataProfile | undefined, profileAddressType: profileAddressType, translate: TFunction): Array<TextLine> => {
  const textLines: Array<TextLine> = []

  if (profile && profile[profileAddressType]) {
    const address = profile[profileAddressType] as AddressData

    const existingAddressLines = getAllFieldsThatExist([address.addressLine1, address.addressLine2 || '', address.addressLine3 || ''])
    if (existingAddressLines.length > 0) {
      const addressLine = existingAddressLines.join(', ').trim()
      textLines.push({ text: translate('personalInformation.dynamicField', { field: addressLine }) })
    }

    const commaSeparatedAddressLine = getCommaSeparatedAddressLine(address)
    if (commaSeparatedAddressLine !== '') {
      textLines.push({ text: translate('personalInformation.dynamicField', { field: commaSeparatedAddressLine }) })
    }

    if (address.addressType === addressTypeFields.international && address.countryCodeIso3) {
      const countryText = Countries.find((countryField) => countryField.value === address.countryCodeIso3)
      textLines.push({ text: translate('personalInformation.dynamicField', { field: countryText?.label }) })
    }

    // if no address data exists, add please add your ___ message
    if (existingAddressLines.length === 0 && commaSeparatedAddressLine === '') {
      // if its an international address, check additionally if countryCodeIso3 does not exist
      if ((address.addressType === addressTypeFields.international && !address.countryCodeIso3) || address.addressType !== addressTypeFields.international) {
        textLines.push({ text: translate('personalInformation.addYour', { field: translate(`personalInformation.${profileAddressType}`).toLowerCase() }) })
      }
    }
  } else {
    textLines.push({ text: translate('personalInformation.addYour', { field: translate(`personalInformation.${profileAddressType}`).toLowerCase() }) })
  }

  return textLines
}

const getAddressData = (profile: UserDataProfile | undefined, translate: TFunction, addressData: Array<addressDataField>): Array<DefaultListItemObj> => {
  const resultingData: Array<DefaultListItemObj> = []

  _.map(addressData, ({ addressType, onPress }) => {
    let textLines: Array<TextLine> = [{ text: translate(`personalInformation.${addressType}`), variant: 'MobileBodyBold', color: 'primaryTitle' }]

    textLines = textLines.concat(getTextForAddressData(profile, addressType, translate))
    const a11yHintTextSuffix = addressType === profileAddressOptions.MAILING_ADDRESS ? 'editOrAddMailingAddress' : 'editOrAddResidentialAddress'

    // For integration tests, change the test id and accessibility label to just be the header so we can query for the address summary
    const testId = IS_TEST ? generateTestID(translate(`personalInformation.${addressType}`), '') : _.map(textLines, 'text').join(' ')
    resultingData.push({ textLines: textLines, a11yHintText: translate(`personalInformation.${a11yHintTextSuffix}`), onPress, testId })
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
} & Partial<ListProps>

const AddressSummary: FC<AddressSummaryProps> = ({ addressData, title }) => {
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const t = useTranslation(NAMESPACE.PROFILE)

  const data = getAddressData(profile, t, addressData)

  return <DefaultList items={data} title={title} />
}

export default AddressSummary

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TFunction } from 'i18next'
import _ from 'underscore'

import { useContactInformation } from 'api/contactInformation/getContactInformation'
import { AddressData, UserContactInformation, addressTypeFields } from 'api/types'
import { DefaultList, DefaultListItemObj, ListProps, TextLine } from 'components'
import { Events } from 'constants/analytics'
import { Countries } from 'constants/countries'
import { MilitaryStates } from 'constants/militaryStates'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { generateTestID, getAllFieldsThatExist } from 'utils/common'
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
    const stateLabel = address.stateCode
      ? MilitaryStates.find((militaryState) => militaryState.value === address.stateCode)?.label
      : undefined
    fieldList = [city, stateLabel, address.zipCode]
    joinBy = ' '
  } else {
    // International addresses
    fieldList = [address.city, address.province, address.internationalPostalCode]
  }

  return fieldList.filter(Boolean).join(joinBy).trim()
}

export const getTextForAddressData = (
  contactInformation: UserContactInformation | undefined,
  profileAddressType: profileAddressType,
  translate: TFunction,
): Array<TextLine> => {
  const textLines: Array<TextLine> = []

  if (contactInformation && contactInformation[profileAddressType]) {
    const address = contactInformation[profileAddressType] as AddressData

    const existingAddressLines = getAllFieldsThatExist([
      address.addressLine1,
      address.addressLine2 || '',
      address.addressLine3 || '',
    ])
    if (existingAddressLines.length > 0) {
      const addressLine = existingAddressLines.join(', ').trim()
      textLines.push({ text: translate('dynamicField', { field: addressLine }) })
    }

    const commaSeparatedAddressLine = getCommaSeparatedAddressLine(address)
    if (commaSeparatedAddressLine !== '') {
      textLines.push({ text: translate('dynamicField', { field: commaSeparatedAddressLine }) })
    }

    if (address.addressType === addressTypeFields.international && address.countryCodeIso3) {
      const countryText = Countries.find((countryField) => countryField.value === address.countryCodeIso3)
      textLines.push({ text: translate('dynamicField', { field: countryText?.label }) })
    }

    // if no address data exists, add please add your ___ message
    if (existingAddressLines.length === 0 && commaSeparatedAddressLine === '') {
      // if its an international address, check additionally if countryCodeIso3 does not exist
      if (
        (address.addressType === addressTypeFields.international && !address.countryCodeIso3) ||
        address.addressType !== addressTypeFields.international
      ) {
        textLines.push({
          text: translate('contactInformation.addYour', {
            field: translate(`contactInformation.${profileAddressType}`).toLowerCase(),
          }),
        })
      }
    }
  } else {
    textLines.push({
      text: translate('contactInformation.addYour', {
        field: translate(`contactInformation.${profileAddressType}`).toLowerCase(),
      }),
    })
  }

  return textLines
}

const getAddressData = (
  contactInformation: UserContactInformation | undefined,
  translate: TFunction,
  addressData: Array<addressDataField>,
): Array<DefaultListItemObj> => {
  const resultingData: Array<DefaultListItemObj> = []

  _.map(addressData, ({ addressType, onPress }) => {
    let textLines: Array<TextLine> = [
      { text: translate(`contactInformation.${addressType}`), variant: 'MobileBodyBold' },
    ]

    textLines = textLines.concat(getTextForAddressData(contactInformation, addressType, translate))
    const a11yHintTextSuffix =
      addressType === profileAddressOptions.MAILING_ADDRESS ? 'editOrAddMailingAddress' : 'editOrAddResidentialAddress'

    // For integration tests, change the test id and accessibility label to just be the header so we can query for the address summary
    const testId = IS_TEST
      ? generateTestID(translate(`contactInformation.${addressType}`), '')
      : _.map(textLines, 'text').join(' ')
    resultingData.push({
      textLines: textLines,
      a11yHintText: translate(`contactInformation.${a11yHintTextSuffix}`),
      onPress,
      testId,
    })
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

function AddressSummary({ addressData, title }: AddressSummaryProps) {
  const contactInformationQuery = useContactInformation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const [retried, setRetried] = useState(false)

  useEffect(() => {
    if (contactInformationQuery.failureCount > 0) {
      setRetried(true)
    }

    if (retried && !contactInformationQuery.isFetching) {
      const retryStatus = contactInformationQuery.error ? 'fail' : 'success'
      logAnalyticsEvent(Events.vama_react_query_retry(retryStatus))
    }
  }, [contactInformationQuery.failureCount, contactInformationQuery.error, contactInformationQuery.isFetching, retried])

  const data = getAddressData(contactInformationQuery.data, t, addressData)

  return <DefaultList items={data} title={title} />
}

export default AddressSummary

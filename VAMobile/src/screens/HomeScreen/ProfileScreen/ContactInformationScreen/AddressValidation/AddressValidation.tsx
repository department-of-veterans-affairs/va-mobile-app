import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { Button, ButtonVariants, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { UseMutateFunction } from '@tanstack/react-query'
import { map, pick } from 'underscore'

import { useContactInformation } from 'api/contactInformation'
import { AddressData, SaveAddressParameters, SuggestedAddress, ValidateAddressData } from 'api/types'
import { AlertWithHaptics, Box, RadioGroup, TextArea, TextView, VAScrollView, radioOption } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { EditResponseData } from 'store/api'
import { GenerateAddressMessage } from 'translations/en/functions'
import { useTheme } from 'utils/hooks'
import { getAddressDataFromSuggestedAddress, getAddressDataPayload } from 'utils/personalInformation'

import { profileAddressType } from '../AddressSummary'

/**
 *  Signifies the props that need to be passed in to {@link AddressValidation}
 */
export type AddressValidationProps = {
  addressEntered: AddressData
  addressId: number
  addressType: profileAddressType
  validationData: ValidateAddressData
  saveAddress: UseMutateFunction<EditResponseData | undefined, unknown, SaveAddressParameters, unknown>
  setShowAddressValidation: (shouldShow: boolean) => void
}

function AddressValidation({
  addressEntered,
  addressId,
  addressType,
  validationData,
  saveAddress,
  setShowAddressValidation,
}: AddressValidationProps) {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigation = useNavigation()
  const theme = useTheme()
  const { data: contactInformation } = useContactInformation()
  const [error, setError] = useState('')

  const { standardMarginBetween, contentMarginTop, contentMarginBottom, condensedMarginBetween } = theme.dimensions
  const { confirmedSuggestedAddresses, validationKey } = validationData
  const [selectedSuggestedAddress, setSelectedSuggestedAddress] = useState<AddressData | SuggestedAddress>()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }
  const containerStyles = {
    flex: 0,
    mx: theme.dimensions.gutter,
    mb: contentMarginBottom,
    mt: standardMarginBetween,
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => undefined,
      headerRight: () => undefined,
    })
  })

  const onEditAddress = (): void => {
    setShowAddressValidation(false)
  }

  const onSetSuggestedAddress = (address: SuggestedAddress | AddressData): void => {
    if (address) {
      setSelectedSuggestedAddress(address)
    }
  }

  const getFormattedAddressLines = (line1: string, line2?: string, line3?: string): string => {
    return [line1, line2, line3].filter(Boolean).join('\n').trim()
  }

  const onUseThisAddress = (): void => {
    let revalidate = false
    if (!selectedSuggestedAddress) {
      setError(t('selectAddress'))
      return
    }

    let addressData: AddressData

    if ('attributes' in selectedSuggestedAddress) {
      addressData = getAddressDataFromSuggestedAddress(selectedSuggestedAddress, addressId)
      revalidate = true
    } else {
      addressData = selectedSuggestedAddress
    }

    // removes null properties
    addressData = pick(addressData, (value) => {
      return !!value
    }) as AddressData

    // need to send validation key with all addresses
    addressData.validationKey = validationKey

    addressData = getAddressDataPayload(addressData, contactInformation)

    const save = () => {
      const mutateOptions = {
        onSuccess: () => snackbar.show(GenerateAddressMessage(t, addressType, false)),
        onError: () =>
          snackbar.show(GenerateAddressMessage(t, addressType, true), {
            isError: true,
            offset: theme.dimensions.snackBarBottomOffset,
            onActionPressed: () => save,
          }),
      }
      saveAddress({ addressData, revalidate }, mutateOptions)
    }

    save()
  }

  const getSuggestedAddressLabelArgs = (address: SuggestedAddress | AddressData): { [key: string]: string } => {
    const suggestedAddress = 'attributes' in address ? address.attributes : address
    const addressLines = getFormattedAddressLines(
      suggestedAddress.addressLine1,
      suggestedAddress.addressLine2,
      suggestedAddress.addressLine3,
    )

    if (suggestedAddress.province && suggestedAddress.internationalPostalCode) {
      return {
        addressLines: addressLines,
        city: suggestedAddress.city,
        state: suggestedAddress.province,
        postCode: suggestedAddress.internationalPostalCode,
      }
    }

    return {
      addressLines: addressLines,
      city: suggestedAddress.city,
      state: suggestedAddress.stateCode || '',
      postCode: suggestedAddress.zipCode,
    }
  }

  function getAlert() {
    return (
      <Box>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView
          variant="MobileBody"
          paragraphSpacing={true}
          accessibilityLabel={t('editAddress.validation.verifyAddress.body.1.a11yLabel')}>
          {t('editAddress.validation.verifyAddress.body.1')}
        </TextView>
        <TextView variant="MobileBody">{t('editAddress.validation.verifyAddress.body.2')}</TextView>
      </Box>
    )
  }

  function getSuggestedAddresses() {
    let suggestedAddressOptions: Array<radioOption<AddressData | SuggestedAddress>> = []

    suggestedAddressOptions.push({
      value: addressEntered,
      labelKey: 'editAddress.address',
      labelArgs: getSuggestedAddressLabelArgs(addressEntered),
      headerText: t('editAddress.validation.youEntered'),
      testID: 'youEnteredTestID',
    })

    if (confirmedSuggestedAddresses) {
      suggestedAddressOptions = suggestedAddressOptions.concat(
        map(confirmedSuggestedAddresses, (address, index) => {
          return {
            value: address,
            labelKey: 'editAddress.address',
            labelArgs: getSuggestedAddressLabelArgs(address),
            addHeader: index === 0 ? true : false,
            headerText: t('editAddress.validation.suggestedAddresses'),
            testID: 'suggestedAddressTestID',
          }
        }),
      )
    }

    return (
      <TextArea>
        <RadioGroup<SuggestedAddress | AddressData>
          options={suggestedAddressOptions}
          value={selectedSuggestedAddress}
          onChange={onSetSuggestedAddress}
          error={error}
        />
      </TextArea>
    )
  }

  function getFooterButtons() {
    const useThisAddressButtonProps = {
      testID: t('editAddress.validation.useThisAddress'),
      label: t('editAddress.validation.useThisAddress'),
      onPress: onUseThisAddress,
    }

    const editAddressButtonProps = {
      buttonType: ButtonVariants.Secondary,
      label: t('editAddress.validation.editAddress'),
      testID: t('editAddress.validation.editAddress'),
      onPress: onEditAddress,
    }

    return (
      <Box>
        <Box mb={condensedMarginBetween}>
          <Button {...useThisAddressButtonProps} />
        </Box>
        <Box>
          <Button {...editAddressButtonProps} />
        </Box>
      </Box>
    )
  }

  return (
    <VAScrollView testID="AddressVerificationTestID" contentContainerStyle={scrollStyles}>
      <Box flex={1}>
        <AlertWithHaptics
          variant="warning"
          expandable={true}
          focusOnError={false}
          header={t('editAddress.validation.verifyAddress.title')}
          testID="verifyYourAddressTestID">
          {getAlert()}
        </AlertWithHaptics>
        <Box mt={contentMarginTop}>{getSuggestedAddresses()}</Box>
      </Box>
      <Box {...containerStyles}>{getFooterButtons()}</Box>
    </VAScrollView>
  )
}

export default AddressValidation

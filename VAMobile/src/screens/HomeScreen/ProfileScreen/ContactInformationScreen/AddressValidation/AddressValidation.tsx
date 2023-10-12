import { UseMutateFunction } from '@tanstack/react-query'
import { ViewStyle } from 'react-native'
import { map, pick } from 'underscore'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'

import { AddressData, SaveAddressParameters, SuggestedAddress, ValidateAddressData } from 'api/types'
import { Box, ButtonTypesConstants, RadioGroup, TextArea, TextView, VAButton, VAScrollView, radioOption } from 'components'
import { EditResponseData } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { SnackbarMessages } from 'components/SnackBar'
import { getAddressDataFromSuggestedAddress, getAddressDataPayload } from 'utils/personalInformation'
import { showSnackBar } from 'utils/common'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { useContactInformation } from 'api/contactInformation'
import CollapsibleAlert from 'components/CollapsibleAlert'

/**
 *  Signifies the props that need to be passed in to {@link AddressValidation}
 */
export type AddressValidationProps = {
  addressEntered: AddressData
  addressId: number
  snackbarMessages: SnackbarMessages
  validationData: ValidateAddressData
  saveAddress: UseMutateFunction<EditResponseData | undefined, unknown, SaveAddressParameters, unknown>
  setShowAddressValidation: (shouldShow: boolean) => void
}

const AddressValidation: FC<AddressValidationProps> = ({ addressEntered, addressId, snackbarMessages, validationData, saveAddress, setShowAddressValidation }) => {
  const dispatch = useAppDispatch()
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
        onSuccess: () => showSnackBar(snackbarMessages.successMsg, dispatch, undefined, true, false, true),
        onError: () => showSnackBar(snackbarMessages.errorMsg, dispatch, () => save, false, true),
      }
      saveAddress({ addressData, revalidate }, mutateOptions)
    }

    save()
  }

  const getSuggestedAddressLabelArgs = (address: SuggestedAddress | AddressData): { [key: string]: string } => {
    const suggestedAddress = 'attributes' in address ? address.attributes : address
    const addressLines = getFormattedAddressLines(suggestedAddress.addressLine1, suggestedAddress.addressLine2, suggestedAddress.addressLine3)

    if (suggestedAddress.province && suggestedAddress.internationalPostalCode) {
      return { addressLines: addressLines, city: suggestedAddress.city, state: suggestedAddress.province, postCode: suggestedAddress.internationalPostalCode }
    }

    return { addressLines: addressLines, city: suggestedAddress.city, state: suggestedAddress.stateCode || '', postCode: suggestedAddress.zipCode }
  }

  const getAlert = (): ReactNode => {
    return (
      <Box>
        <TextView variant="MobileBody" mt={standardMarginBetween} paragraphSpacing={true} accessibilityLabel={t('editAddress.validation.verifyAddress.body.1.a11yLabel')}>
          {t('editAddress.validation.verifyAddress.body.1')}
        </TextView>
        <TextView variant="MobileBody" mb={standardMarginBetween}>
          {t('editAddress.validation.verifyAddress.body.2')}
        </TextView>
      </Box>
    )
  }

  const getSuggestedAddresses = (): ReactElement => {
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
        <RadioGroup<SuggestedAddress | AddressData> options={suggestedAddressOptions} value={selectedSuggestedAddress} onChange={onSetSuggestedAddress} error={error} />
      </TextArea>
    )
  }

  const getFooterButtons = (): ReactElement => {
    const useThisAddressButtonProps = {
      testID: t('editAddress.validation.useThisAddress'),
      label: t('editAddress.validation.useThisAddress'),
      onPress: onUseThisAddress,
    }

    const editAddressButtonProps = {
      label: t('editAddress.validation.editAddress'),
      testID: t('editAddress.validation.editAddress.a11yLabel'),
      onPress: onEditAddress,
    }

    return (
      <Box>
        <Box mb={condensedMarginBetween}>
          <VAButton {...useThisAddressButtonProps} buttonType={ButtonTypesConstants.buttonPrimary} />
        </Box>
        <Box>
          <VAButton {...editAddressButtonProps} buttonType={ButtonTypesConstants.buttonSecondary} />
        </Box>
      </Box>
    )
  }

  return (
    <VAScrollView testID="AddressVerificationTestID" contentContainerStyle={scrollStyles}>
      <Box flex={1}>
        <CollapsibleAlert
          border="warning"
          headerText={t('editAddress.validation.verifyAddress.title')}
          body={getAlert()}
          a11yLabel={t('editAddress.validation.verifyAddress.title')}
          testID="verifyYourAddressTestID"
        />
        <Box mt={contentMarginTop}>{getSuggestedAddresses()}</Box>
      </Box>
      <Box {...containerStyles}>{getFooterButtons()}</Box>
    </VAScrollView>
  )
}

export default AddressValidation

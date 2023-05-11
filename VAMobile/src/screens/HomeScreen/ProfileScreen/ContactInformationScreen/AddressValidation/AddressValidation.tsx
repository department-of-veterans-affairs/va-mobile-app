import { map, pick } from 'underscore'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'

import { AddressData, ScreenIDTypesConstants, SuggestedAddress } from 'store/api/types'
import { Box, ButtonTypesConstants, RadioGroup, TextArea, TextView, VAButton, VAScrollView, radioOption } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, finishValidateAddress, updateAddress } from 'store/slices'
import { RootState } from 'store'
import { SnackbarMessages } from 'components/SnackBar'
import { ViewStyle } from 'react-native'
import { getAddressDataFromSuggestedAddress } from 'utils/personalInformation'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import CollapsibleAlert from 'components/CollapsibleAlert'

/**
 *  Signifies the props that need to be passed in to {@link AddressValidation}
 */
export type AddressValidationProps = {
  addressEntered: AddressData
  addressId: number
  snackbarMessages: SnackbarMessages
}

const AddressValidation: FC<AddressValidationProps> = ({ addressEntered, addressId, snackbarMessages }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigation = useNavigation()
  const theme = useTheme()

  const { validationKey, confirmedSuggestedAddresses } = useSelector<RootState, PersonalInformationState>((storeState) => storeState.personalInformation)
  const [selectedSuggestedAddress, setSelectedSuggestedAddress] = useState<AddressData | SuggestedAddress>()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }
  const containerStyles = {
    flex: 0,
    mx: theme?.dimensions?.gutter,
    mb: theme?.dimensions?.contentMarginBottom,
    mt: theme?.dimensions?.standardMarginBetween,
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => undefined,
      headerRight: () => undefined,
    })
  })

  const onEditAddress = (): void => {
    dispatch(finishValidateAddress())
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
      return
    }

    let address: AddressData

    if ('attributes' in selectedSuggestedAddress) {
      address = getAddressDataFromSuggestedAddress(selectedSuggestedAddress, addressId)
      revalidate = true
    } else {
      address = selectedSuggestedAddress
    }

    //removes null properties
    address = pick(address, (value) => {
      return !!value
    }) as AddressData

    // need to send validation key with all addresses
    address.validationKey = validationKey

    dispatch(updateAddress(address, snackbarMessages, ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID, revalidate))
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
      <TextView variant="MobileBody" my={theme?.dimensions?.standardMarginBetween} accessibilityLabel={t('editAddress.validation.verifyAddress.body.a11yLabel')}>
        {t('editAddress.validation.verifyAddress.body')}
      </TextView>
    )
  }

  const getSuggestedAddresses = (): ReactElement => {
    let suggestedAddressOptions: Array<radioOption<AddressData | SuggestedAddress>> = []

    suggestedAddressOptions.push({
      value: addressEntered,
      labelKey: 'editAddress.address',
      labelArgs: getSuggestedAddressLabelArgs(addressEntered),
      headerText: t('editAddress.validation.youEntered'),
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
          }
        }),
      )
    }

    return (
      <TextArea>
        <RadioGroup<SuggestedAddress | AddressData> options={suggestedAddressOptions} value={selectedSuggestedAddress} onChange={onSetSuggestedAddress} />
      </TextArea>
    )
  }

  const getFooterButtons = (): ReactElement => {
    const useThisAddressButtonProps = {
      testID: t('editAddress.validation.useThisAddress'),
      a11yHint: t('editAddress.validation.useThisAddress.a11yHint'),
      label: t('editAddress.validation.useThisAddress'),
      onPress: onUseThisAddress,
    }

    const editAddressButtonProps = {
      label: t('editAddress.validation.editAddress'),
      testID: t('editAddress.validation.editAddress.a11yLabel'),
      a11yHint: t('editAddress.validation.editAddress.a11yHint'),
      onPress: onEditAddress,
    }

    return (
      <Box>
        <Box mb={theme?.dimensions?.condensedMarginBetween}>
          <VAButton {...useThisAddressButtonProps} buttonType={ButtonTypesConstants.buttonPrimary} />
        </Box>
        <Box>
          <VAButton {...editAddressButtonProps} buttonType={ButtonTypesConstants.buttonSecondary} />
        </Box>
      </Box>
    )
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box flex={1}>
        <Box mt={theme?.dimensions?.contentMarginTop}>
          <CollapsibleAlert
            border="warning"
            headerText={t('editAddress.validation.verifyAddress.title')}
            body={getAlert()}
            a11yLabel={t('editAddress.validation.verifyAddress.title')}
          />
        </Box>
        <Box mt={theme?.dimensions?.contentMarginTop}>{getSuggestedAddresses()}</Box>
      </Box>
      <Box {...containerStyles}>{getFooterButtons()}</Box>
    </VAScrollView>
  )
}

export default AddressValidation

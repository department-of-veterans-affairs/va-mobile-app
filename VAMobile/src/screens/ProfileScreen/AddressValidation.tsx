import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'

import { AccordionCollapsible, Box, ButtonTypesConstants, RadioGroup, TextArea, TextView, VAButton, VAScrollView, radioOption } from 'components'
import { AddressData, AddressValidationScenarioTypesConstants, ScreenIDTypesConstants, SuggestedAddress } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { ViewStyle } from 'react-native'
import { finishValidateAddress, updateAddress } from 'store'
import { getAddressDataFromSuggestedAddress } from 'utils/personalInformation'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

/**
 *  Signifies the props that need to be passed in to {@link AddressValidation}
 */
export type AddressValidationProps = {
  addressEntered: AddressData
  addressId: number
}

const AddressValidation: FC<AddressValidationProps> = ({ addressEntered, addressId }) => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const navigation = useNavigation()
  const theme = useTheme()

  const { standardMarginBetween, contentMarginTop, contentMarginBottom, condensedMarginBetween } = theme.dimensions
  const { validationKey, addressValidationScenario, confirmedSuggestedAddresses } = useSelector<StoreState, PersonalInformationState>(
    (storeState) => storeState.personalInformation,
  )
  const [selectedSuggestedAddress, setSelectedSuggestedAddress] = useState<AddressData | SuggestedAddress>()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.main,
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
    if (!selectedSuggestedAddress) {
      return
    }

    let address: AddressData

    if ('attributes' in selectedSuggestedAddress) {
      address = getAddressDataFromSuggestedAddress(selectedSuggestedAddress, addressId)
    } else {
      address = selectedSuggestedAddress
      // overriding with an invalid address requires a validation key
      address.validationKey = validationKey
    }

    dispatch(updateAddress(address, ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID))
  }

  const getSuggestedAddressLabelArgs = (address: SuggestedAddress | AddressData): { [key: string]: string } => {
    const suggestedAddress = 'attributes' in address ? address.attributes : address
    const addressLines = getFormattedAddressLines(suggestedAddress.addressLine1, suggestedAddress.addressLine2, suggestedAddress.addressLine3)

    if (suggestedAddress.province && suggestedAddress.internationalPostalCode) {
      return { addressLines: addressLines, city: suggestedAddress.city, state: suggestedAddress.province, postCode: suggestedAddress.internationalPostalCode }
    }

    return { addressLines: addressLines, city: suggestedAddress.city, state: suggestedAddress.stateCode ?? '', postCode: suggestedAddress.zipCode }
  }

  const getAlertTitle = (): string => {
    switch (addressValidationScenario) {
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_NO_CONFIRMED:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE:
        return t('editAddress.validation.confirmAddress.title')
      case AddressValidationScenarioTypesConstants.MISSING_UNIT_OVERRIDE:
        return t('editAddress.validation.addUnit.title')
      case AddressValidationScenarioTypesConstants.BAD_UNIT_NUMBER_OVERRIDE:
        return t('editAddress.validation.badUnit.title')
      default:
        return t('editAddress.validation.confirmAddress.title')
    }
  }

  const getAlertBody = (): string => {
    switch (addressValidationScenario) {
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE:
        return t('editAddress.validation.confirmAddress.noSuggestions.body')
      case AddressValidationScenarioTypesConstants.MISSING_UNIT_OVERRIDE:
        return t('editAddress.validation.addUnit.body')
      case AddressValidationScenarioTypesConstants.BAD_UNIT_NUMBER_OVERRIDE:
        return t('editAddress.validation.badUnit.body')
      default:
        return t('editAddress.validation.confirmAddress.suggestions.body')
    }
  }

  const getAlertBodyA11yLabel = (): string => {
    switch (addressValidationScenario) {
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE:
        return t('editAddress.validation.confirmAddress.noSuggestions.body.a11yLabel')
      default:
        return getAlertBody()
    }
  }

  const accordionHeader = (): ReactNode => {
    return <TextView variant="MobileBodyBold">{getAlertTitle()}</TextView>
  }

  const getAlert = (): ReactNode => {
    return (
      <TextView color="primary" variant="MobileBody" my={standardMarginBetween} accessibilityLabel={getAlertBodyA11yLabel()}>
        {getAlertBody()}
      </TextView>
    )
  }

  const getSuggestedAddresses = (): ReactElement => {
    let suggestedAddressOptions: Array<radioOption<AddressData | SuggestedAddress>> = []

    suggestedAddressOptions.push({
      value: addressEntered,
      labelKey: 'profile:editAddress.address',
      labelArgs: getSuggestedAddressLabelArgs(addressEntered),
      addHeader: true,
      headerText: t('editAddress.validation.youEntered'),
    })

    if (confirmedSuggestedAddresses) {
      suggestedAddressOptions = suggestedAddressOptions.concat(
        map(confirmedSuggestedAddresses, (address, index) => {
          return {
            value: address,
            labelKey: 'profile:editAddress.address',
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
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box flex={1}>
        <Box mt={contentMarginTop}>
          <AccordionCollapsible expandedContent={getAlert()} header={accordionHeader()} alertBorder={'warning'} testID={getAlertTitle()} />
        </Box>
        <Box mt={contentMarginTop}>{getSuggestedAddresses()}</Box>
      </Box>
      <Box {...containerStyles}>{getFooterButtons()}</Box>
    </VAScrollView>
  )
}

export default AddressValidation

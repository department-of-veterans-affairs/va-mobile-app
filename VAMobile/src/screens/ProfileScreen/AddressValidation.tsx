import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import React, { FC, ReactElement, useEffect, useState } from 'react'

import { AddressValidationScenarioTypesConstants, ScreenIDTypesConstants, SuggestedAddress } from 'store/api/types'
import { AlertBox, Box, ButtonTypesConstants, RadioGroup, TextArea, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { ViewStyle } from 'react-native'
import { finishValidateAddress, updateAddress } from 'store'
import { getAddressDataFromSuggestedAddress } from 'utils/personalInformation'
import { useCancelEditAddress, useTheme, useTranslation } from 'utils/hooks'

/**
 *  Signifies the props that need to be passed in to {@link AddressValidation}
 */
export type AddressValidationProps = {
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  city: string
  state: string
  zipCode: string
  addressId: number
  country: string
}

const AddressValidation: FC<AddressValidationProps> = ({ addressLine1, addressLine2, addressLine3, city, state, zipCode, addressId, country }) => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const navigation = useNavigation()
  const theme = useTheme()
  const onCancel = useCancelEditAddress()

  const { standardMarginBetween, contentMarginTop, contentMarginBottom, condensedMarginBetween } = theme.dimensions
  const { addressData, validationKey, addressValidationScenario, confirmedSuggestedAddresses } = useSelector<StoreState, PersonalInformationState>(
    (storeState) => storeState.personalInformation,
  )
  const [selectedSuggestedAddress, setSelectedSuggestedAddress] = useState(confirmedSuggestedAddresses ? confirmedSuggestedAddresses[0] : undefined)
  const showSuggestions =
    addressValidationScenario === AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS ||
    addressValidationScenario === AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE
  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.main,
  }
  const containerStyles = {
    flex: 1,
    mx: theme.dimensions.gutter,
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

  const onSetSuggestedAddress = (address: SuggestedAddress): void => {
    setSelectedSuggestedAddress(address as SuggestedAddress)
  }

  const getFormattedAddressLines = (line1: string, line2?: string, line3?: string): string => {
    return [line1, line2, line3].filter(Boolean).join('\n').trim()
  }

  const onUseThisAddress = (): void => {
    if (addressData) {
      // overriding with an invalid address requires a validation key
      addressData.validationKey = validationKey
      dispatch(updateAddress(addressData, ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID))
    }
  }

  const onUseSuggestedAddress = (): void => {
    if (!selectedSuggestedAddress) {
      return
    }

    const address = getAddressDataFromSuggestedAddress(selectedSuggestedAddress, addressId)

    dispatch(updateAddress(address, ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID))
  }

  const getSuggestedAddressLabelArgs = (address: SuggestedAddress): { [key: string]: string } => {
    const suggestedAddress = address.attributes
    const addressLines = getFormattedAddressLines(suggestedAddress.addressLine1, suggestedAddress.addressLine2, suggestedAddress.addressLine3)

    if (suggestedAddress.province && suggestedAddress.internationalPostalCode) {
      return { addressLines: addressLines, city: suggestedAddress.city, state: suggestedAddress.province, postCode: suggestedAddress.internationalPostalCode }
    }

    return { addressLines: addressLines, city: suggestedAddress.city, state: suggestedAddress.stateCode, postCode: suggestedAddress.zipCode }
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
        return t('editAddress.validation.confirmAddress.suggestions.body')
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE:
        return t('editAddress.validation.confirmAddress.noSuggestions.body')
      case AddressValidationScenarioTypesConstants.MISSING_UNIT_OVERRIDE:
        return t('editAddress.validation.addUnit.body')
      case AddressValidationScenarioTypesConstants.BAD_UNIT_NUMBER_OVERRIDE:
        return t('editAddress.validation.badUnit.body')
      default:
        return t('editAddress.validation.confirmAddress.noSuggestions.body')
    }
  }

  const getAlertBodyA11yLabel = (): string => {
    switch (addressValidationScenario) {
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE:
        return t('editAddress.validation.confirmAddress.suggestions.body.a11yLabel')
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE:
        return t('editAddress.validation.confirmAddress.noSuggestions.body.a11yLabel')
      default:
        return getAlertBody()
    }
  }

  const getAlert = (): ReactElement => {
    return (
      <Box accessibilityRole="header">
        <AlertBox title={getAlertTitle()} border="warning" background="noCardBackground">
          <Box>
            <TextView color="primary" variant="MobileBody" my={standardMarginBetween} accessibilityLabel={getAlertBodyA11yLabel()}>
              {getAlertBody()}
            </TextView>
          </Box>
        </AlertBox>
      </Box>
    )
  }

  const getUserEnteredAddress = (): ReactElement => {
    const addressLines = getFormattedAddressLines(addressLine1, addressLine2, addressLine3)

    const editAddressButtonProps = {
      label: t('editAddress.validation.editAddress'),
      testID: t('editAddress.validation.editAddress.a11yLabel'),
      a11yHint: t('editAddress.validation.editAddress.a11yHint'),
      onPress: onEditAddress,
    }

    const useThisAddressButtonProps = {
      label: t('editAddress.validation.useThisAddress'),
      testID: t('editAddress.validation.useThisAddress'),
      a11yHint: t('editAddress.validation.useThisAddress.a11yHint'),
      onPress: onUseThisAddress,
    }

    const formattedEnteredAddressSecondLine = state ? city + ', ' + state + ', ' + zipCode : city + ', ' + zipCode

    return (
      <TextArea>
        <Box>
          <TextView color="primary" variant="MobileBodyBold" accessibilityRole="header">
            {t('editAddress.validation.youEntered')}
          </TextView>
        </Box>
        <Box>
          <TextView color="primary" variant="MobileBody" mt={standardMarginBetween}>
            {addressLines}
          </TextView>
          <TextView color="primary" variant="MobileBody">
            {formattedEnteredAddressSecondLine}
          </TextView>
          <TextView color="primary" variant="MobileBody" mb={standardMarginBetween}>
            {country}
          </TextView>
        </Box>
        {showSuggestions ? (
          <Box>
            <Box mb={condensedMarginBetween}>
              <VAButton {...useThisAddressButtonProps} buttonType={ButtonTypesConstants.buttonPrimary} />
            </Box>
            <Box>
              <VAButton {...editAddressButtonProps} buttonType={ButtonTypesConstants.buttonSecondary} />
            </Box>
          </Box>
        ) : (
          <Box>
            <VAButton {...editAddressButtonProps} buttonType={ButtonTypesConstants.buttonPrimary} />
          </Box>
        )}
      </TextArea>
    )
  }

  const getSuggestedAddresses = (): ReactElement => {
    if (!confirmedSuggestedAddresses || !selectedSuggestedAddress) {
      return <></>
    }

    const useSuggestedAddressButtonProps = {
      testID: t('editAddress.validation.useSuggestedAddress'),
      a11yHint: t('editAddress.validation.useSuggestedAddress.a11yHint'),
      label: t('editAddress.validation.useSuggestedAddress'),
    }

    // only looping through confirmed suggested addresses because the whole list of suggestions may include addresses with non confirmed delivery points
    const suggestedAddressOptions = map(confirmedSuggestedAddresses, (address) => {
      return {
        value: address,
        labelKey: 'profile:editAddress.address',
        labelArgs: getSuggestedAddressLabelArgs(address),
      }
    })

    return (
      <TextArea>
        <TextView variant="MobileBodyBold">{t('editAddress.validation.suggestedAddresses')}</TextView>
        <Box mt={contentMarginTop}>
          <RadioGroup<SuggestedAddress> options={suggestedAddressOptions} value={selectedSuggestedAddress} onChange={onSetSuggestedAddress} />
        </Box>
        <Box>
          <VAButton onPress={onUseSuggestedAddress} {...useSuggestedAddressButtonProps} buttonType={ButtonTypesConstants.buttonPrimary} />
        </Box>
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

    const cancelButtonProps = {
      testID: t('editAddress.validation.cancel'),
      a11yHint: t('editAddress.validation.cancel.a11yHint'),
      label: t('editAddress.validation.cancel'),
      onPress: onCancel,
    }

    return (
      <Box>
        {!showSuggestions && (
          <Box mb={condensedMarginBetween}>
            <VAButton {...useThisAddressButtonProps} buttonType={ButtonTypesConstants.buttonPrimary} />
          </Box>
        )}
        <Box>
          <VAButton {...cancelButtonProps} buttonType={ButtonTypesConstants.buttonSecondary} />
        </Box>
      </Box>
    )
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box mt={contentMarginTop} mx={theme.dimensions.gutter}>
        {getAlert()}
      </Box>
      <Box mt={contentMarginTop}>{getUserEnteredAddress()}</Box>
      {showSuggestions && (
        <Box mt={contentMarginTop} mb={condensedMarginBetween}>
          {getSuggestedAddresses()}
        </Box>
      )}
      <Box {...containerStyles} mt={standardMarginBetween} mb={contentMarginBottom}>
        {getFooterButtons()}
      </Box>
    </VAScrollView>
  )
}

export default AddressValidation

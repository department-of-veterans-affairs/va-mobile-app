import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import React, { FC, ReactElement, useState } from 'react'

import { AddressValidationScenarioTypesConstants, ScreenIDTypesConstants, SuggestedAddress } from 'store/api/types'
import { AlertBox, Box, TextArea, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { ScrollView, ViewStyle } from 'react-native'
import { finishValidateAddress, updateAddress } from 'store'
import { getAddressDataFromSuggestedAddress } from 'utils/personalInformation'
import { useTheme, useTranslation } from 'utils/hooks'
import RadioGroup from 'components/RadioGroup'

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
}

const AddressValidation: FC<AddressValidationProps> = ({ addressLine1, addressLine2, addressLine3, city, state, zipCode, addressId }) => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const navigation = useNavigation()
  const theme = useTheme()

  const { marginBetween, contentMarginTop, contentMarginBottom, marginBetweenButtons } = theme.dimensions
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

  const onCancel = (): void => {
    navigation.goBack()
    dispatch(finishValidateAddress())
  }

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

  const getSuggestedAddressLabel = (address: SuggestedAddress): string => {
    const suggestedAddress = address.attributes
    const addressLines = getFormattedAddressLines(suggestedAddress.addressLine1, suggestedAddress.addressLine2, suggestedAddress.addressLine3)

    if (suggestedAddress.province && suggestedAddress.internationalPostalCode) {
      return `${addressLines}\n` + `${suggestedAddress.city}, ${suggestedAddress.province}, ${suggestedAddress.internationalPostalCode}`
    }

    return `${addressLines}\n` + `${suggestedAddress.city}, ${suggestedAddress.stateCode}, ${suggestedAddress.zipCode}`
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

  const getAlert = (): ReactElement => {
    return (
      <Box justifyContent="center" {...containerStyles} accessibilityRole="header">
        <AlertBox title={getAlertTitle()} border="warning" background="noCardBackground">
          <Box>
            <TextView color="primary" variant="MobileBody" my={marginBetween}>
              {getAlertBody()}
            </TextView>
          </Box>
        </AlertBox>
      </Box>
    )
  }

  const getYouEnteredAddress = (): ReactElement => {
    const addressLines = getFormattedAddressLines(addressLine1, addressLine2, addressLine3)

    const editAddressButtonA11yProps = {
      testID: t('editAddress.validation.editAddress'),
      a11yHint: t('editAddress.validation.editAddress.a11yHint'),
      label: t('editAddress.validation.editAddress'),
    }

    const useThisAddressButtonA11yProps = {
      testID: t('editAddress.validation.useThisAddress'),
      a11yHint: t('editAddress.validation.useThisAddress.a11yHint'),
      label: t('editAddress.validation.useThisAddress'),
    }

    return (
      <TextArea>
        <Box>
          <TextView color="primary" variant="MobileBodyBold" accessibilityRole="header">
            {t('editAddress.validation.youEntered')}
          </TextView>
        </Box>
        <Box>
          <TextView color="primary" variant="MobileBody" mt={marginBetween}>
            {addressLines}
          </TextView>
          <TextView color="primary" variant="MobileBody" mb={marginBetween}>
            {city + ', ' + state + ', ' + zipCode}
          </TextView>
        </Box>
        {showSuggestions ? (
          <Box>
            <Box mb={marginBetweenButtons}>
              <VAButton onPress={onUseThisAddress} {...useThisAddressButtonA11yProps} textColor="primaryContrast" backgroundColor="button" />
            </Box>
            <Box>
              <VAButton onPress={onEditAddress} {...editAddressButtonA11yProps} textColor="link" backgroundColor="textBox" borderColor="secondary" />
            </Box>
          </Box>
        ) : (
          <Box>
            <VAButton
              onPress={onEditAddress}
              {...editAddressButtonA11yProps}
              label={t('editAddress.validation.editAddress')}
              textColor="primaryContrast"
              backgroundColor="button"
            />
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
        label: getSuggestedAddressLabel(address),
      }
    })

    return (
      <TextArea>
        <TextView variant="MobileBodyBold">{t('editAddress.validation.suggestedAddresses')}</TextView>
        <Box mt={contentMarginTop}>
          <RadioGroup<SuggestedAddress> options={suggestedAddressOptions} value={selectedSuggestedAddress} onChange={onSetSuggestedAddress} />
        </Box>
        <Box>
          <VAButton onPress={onUseSuggestedAddress} {...useSuggestedAddressButtonProps} textColor="primaryContrast" backgroundColor="button" />
        </Box>
      </TextArea>
    )
  }

  const getFooterButtons = (): ReactElement => {
    const editAddressButtonA11yProps = {
      testID: t('editAddress.validation.editAddress'),
      a11yHint: t('editAddress.validation.editAddress.a11yHint'),
      label: t('editAddress.validation.useThisAddress'),
    }

    const cancelButtonProps = {
      testID: t('editAddress.validation.cancel'),
      a11yHint: t('editAddress.validation.cancel.a11yHint'),
      label: t('editAddress.validation.cancel'),
    }

    return (
      <Box>
        {!showSuggestions && (
          <Box mb={marginBetweenButtons}>
            <VAButton onPress={onUseThisAddress} {...editAddressButtonA11yProps} textColor="primaryContrast" backgroundColor="button" />
          </Box>
        )}
        <Box>
          <VAButton onPress={onCancel} {...cancelButtonProps} textColor="link" backgroundColor="textBox" borderColor="secondary" />
        </Box>
      </Box>
    )
  }

  return (
    <ScrollView contentContainerStyle={scrollStyles}>
      <Box mt={contentMarginTop}>{getAlert()}</Box>
      <Box mt={contentMarginTop}>{getYouEnteredAddress()}</Box>
      {showSuggestions && (
        <Box mt={contentMarginTop} mb={marginBetweenButtons}>
          {getSuggestedAddresses()}
        </Box>
      )}
      <Box {...containerStyles} mt={marginBetween} mb={contentMarginBottom}>
        {getFooterButtons()}
      </Box>
    </ScrollView>
  )
}

export default AddressValidation

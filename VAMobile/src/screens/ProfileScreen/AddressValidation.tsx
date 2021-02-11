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
 *  Signifies the props that need to be passed in to {@link ProfileBanner}
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
  const marginBetween = theme.dimensions.marginBetween
  const marginContentTop = theme.dimensions.contentMarginTop
  const marginContentBottom = theme.dimensions.contentMarginBottom
  const marginBetweenButtons = theme.dimensions.marginBetweenButtons
  const { addressData, validationKey, addressValidationScenario, confirmedSuggestedAddresses } = useSelector<StoreState, PersonalInformationState>(
    (state) => state.personalInformation,
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

  const onSetSuggestedAddress = (address: SuggestedAddress) => {
    setSelectedSuggestedAddress(address as SuggestedAddress)
  }

  const getFormattedAddressLines = (addressLine1: string, addressLine2?: string, addressLine3?: string): string => {
    let addressLines = `${addressLine1}`

    if (addressLine2) {
      addressLines = addressLines + `\n${addressLine2}`
    }
    if (addressLine3) {
      addressLines = addressLines + `\n${addressLine3}`
    }

    return addressLines
  }

  const onUseThisAddress = (): void => {
    if (addressData) {
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
      accessibilityLabel: t('editAddress.validation.editAddress'),
      accessibilityHint: t('editAddress.validation.editAddress.a11yHint'),
    }

    const useThisAddressButtonA11yProps = {
      accessibilityLabel: t('editAddress.validation.useThisAddress'),
      accessibilityHint: t('editAddress.validation.useThisAddress.a11yHint'),
    }

    return (
      <TextArea>
        <Box accessibilityRole="header">
          <TextView color="primary" variant="MobileBodyBold">
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
            <Box {...useThisAddressButtonA11yProps} mb={marginBetweenButtons} accessibilityRole="button">
              <VAButton onPress={onUseThisAddress} label={t('editAddress.validation.useThisAddress')} textColor="primaryContrast" backgroundColor="button" />
            </Box>
            <Box {...editAddressButtonA11yProps} accessibilityRole="button">
              <VAButton onPress={onEditAddress} label={t('editAddress.validation.editAddress')} textColor="link" backgroundColor="textBox" borderColor="secondary" />
            </Box>
          </Box>
        ) : (
          <Box {...editAddressButtonA11yProps} accessibilityRole="button">
            <VAButton onPress={onEditAddress} label={t('editAddress.validation.editAddress')} textColor="primaryContrast" backgroundColor="button" />
          </Box>
        )}
      </TextArea>
    )
  }

  const getSuggestedAddresses = (): ReactElement => {
    if (!confirmedSuggestedAddresses || !selectedSuggestedAddress) {
      return <></>
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
        <Box mt={marginContentTop}>
          <RadioGroup<SuggestedAddress> options={suggestedAddressOptions} value={selectedSuggestedAddress} onChange={onSetSuggestedAddress} />
        </Box>
        <Box>
          <VAButton onPress={onUseSuggestedAddress} label={t('editAddress.validation.useSuggestedAddress')} textColor="primaryContrast" backgroundColor="button" />
        </Box>
      </TextArea>
    )
  }

  const getFooterButtons = (): ReactElement => {
    return (
      <Box>
        {!showSuggestions && (
          <Box mb={marginBetweenButtons}>
            <VAButton onPress={onUseThisAddress} label={t('editAddress.validation.useThisAddress')} textColor="primaryContrast" backgroundColor="button" />
          </Box>
        )}
        <Box>
          <VAButton onPress={onCancel} label={t('editAddress.validation.cancel')} textColor="link" backgroundColor="textBox" borderColor="secondary" />
        </Box>
      </Box>
    )
  }

  return (
    <ScrollView contentContainerStyle={scrollStyles}>
      <Box mt={marginContentTop}>{getAlert()}</Box>
      <Box mt={marginContentTop}>{getYouEnteredAddress()}</Box>
      {showSuggestions && (
        <Box mt={marginContentTop} mb={marginBetweenButtons}>
          {getSuggestedAddresses()}
        </Box>
      )}
      <Box {...containerStyles} mt={marginBetween} mb={marginContentBottom}>
        {getFooterButtons()}
      </Box>
    </ScrollView>
  )
}

export default AddressValidation

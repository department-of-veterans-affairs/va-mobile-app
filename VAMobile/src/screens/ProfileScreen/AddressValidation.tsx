import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useState } from 'react'

import { AddressData, AddressValidationScenarioTypesConstants, ScreenIDTypesConstants, SuggestedAddress } from 'store/api'
import { AlertBox, Box, TextArea, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { ScrollView, ViewStyle } from 'react-native'
import { a11yHintProp } from 'utils/accessibility'
import { finishValidateAddress, updateAddress } from 'store'
import { getAddressDataFromSuggestedAddress } from '../../utils/personalInformation'
import { useTheme, useTranslation } from 'utils/hooks'
import RadioGroup from 'components/RadioGroup'

/**
 *  Signifies the props that need to be passed in to {@link ProfileBanner}
 */
export type AddressValidationProps = {
  addressLine1: string
  addressLine2: string
  addressLine3: string
  city: string
  state: string
  zipCode: string
  addressId: number
}

const AddressValidation: FC<AddressValidationProps> = ({ addressLine1, addressLine2, addressLine3, city, state, zipCode, addressId }) => {
  const { addressData, validationKey, addressValidationScenario, confirmedSuggestedAddresses } = useSelector<StoreState, PersonalInformationState>(
    (state) => state.personalInformation,
  )
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const [selectedSuggestedAddress, setSelectedSuggestedAddress] = useState(confirmedSuggestedAddresses ? confirmedSuggestedAddresses[0] : undefined)
  const showSuggestions =
    addressValidationScenario === AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS ||
    addressValidationScenario === AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE

  const marginBetween = theme.dimensions.marginBetween
  const marginContentTop = theme.dimensions.contentMarginTop
  const marginContentBottom = theme.dimensions.contentMarginBottom
  const marginBetweenButtons = theme.dimensions.marginBetweenButtons
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
    dispatch(finishValidateAddress())
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

    const address: AddressData = getAddressDataFromSuggestedAddress(selectedSuggestedAddress, addressId)

    console.log('notyalc selected suggested address', selectedSuggestedAddress)
    console.log('notyalc address to send', address)
    console.log('notyalc addressData ', addressData)

    dispatch(updateAddress(address, ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID))
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

  const getSuggestedAddressLabel = (address: SuggestedAddress): string => {
    const suggestedAddress = address.attributes
    const addressLines = getFormattedAddressLines(suggestedAddress.addressLine1, suggestedAddress.addressLine2, suggestedAddress.addressLine3)

    if (suggestedAddress.province && suggestedAddress.internationalPostalCode) {
      return `${addressLines}\n` + `${suggestedAddress.city}, ${suggestedAddress.province}, ${suggestedAddress.internationalPostalCode}`
    }

    return `${addressLines}\n` + `${suggestedAddress.city}, ${suggestedAddress.stateCode}, ${suggestedAddress.zipCode}`
  }

  const onSetSuggestedAddress = (address: any) => {
    setSelectedSuggestedAddress(address)
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
      <Box justifyContent="center" {...containerStyles}>
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
    let addressLines = `${addressLine1}`
    if (addressLine2) {
      addressLines = addressLines + `\n${addressLine2}`
    }
    if (addressLine3) {
      addressLines = addressLines + `\n${addressLine3}`
    }

    return (
      <TextArea>
        <TextView color="primary" variant="MobileBodyBold">
          {t('editAddress.validation.youEntered')}
        </TextView>
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
              <VAButton onPress={onUseThisAddress} label={t('editAddress.validation.useAddress')} textColor="primaryContrast" backgroundColor="button" />
            </Box>
            <Box>
              <VAButton onPress={onCancel} label={t('editAddress.validation.editAddress')} textColor="link" backgroundColor="textBox" borderColor="secondary" />
            </Box>
          </Box>
        ) : (
          <VAButton onPress={onCancel} label={t('editAddress.validation.editAddress')} textColor="primaryContrast" backgroundColor="button" />
        )}
      </TextArea>
    )
  }

  const getSuggestedAddresses = (): ReactElement => {
    if (!confirmedSuggestedAddresses) {
      return <></>
    }

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
          <RadioGroup options={suggestedAddressOptions} value={selectedSuggestedAddress} onChange={onSetSuggestedAddress} />
        </Box>
        <Box mb={marginBetweenButtons}>
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
            <VAButton onPress={onUseThisAddress} label={t('editAddress.validation.useAddress')} textColor="primaryContrast" backgroundColor="button" />
          </Box>
        )}
        <Box>
          <VAButton onPress={onCancel} label={t('editAddress.validation.cancel')} textColor="link" backgroundColor="textBox" borderColor="secondary" />
        </Box>
      </Box>
    )
  }

  console.log('notyalc scenario: ', addressValidationScenario)
  console.log('notyalc address: ', selectedSuggestedAddress)

  return (
    <ScrollView contentContainerStyle={scrollStyles}>
      <Box mt={marginContentTop}>{getAlert()}</Box>
      <Box mt={marginContentTop}>{getYouEnteredAddress()}</Box>
      {showSuggestions && <Box mt={marginContentTop}>{getSuggestedAddresses()}</Box>}
      <Box {...containerStyles} mt={marginBetween} mb={marginContentBottom}>
        {getFooterButtons()}
      </Box>
    </ScrollView>
  )
}

export default AddressValidation

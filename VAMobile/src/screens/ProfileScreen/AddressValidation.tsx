import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AddressDataEditedFields } from './EditAddressScreen'
import { AddressValidationScenarioTypesConstants, ScreenIDTypesConstants } from 'store/api'
import { AlertBox, Box, ClickForActionLink, LinkTypeOptionsConstants, TextArea, TextView, VAButton, VAIcon } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { ScrollView, ViewStyle } from 'react-native'
import { a11yHintProp } from 'utils/accessibility'
import { finishValidateAddress, updateAddress } from 'store'
import { useTheme, useTranslation } from 'utils/hooks'

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
}

const AddressValidation: FC<AddressValidationProps> = ({ addressLine1, addressLine2, addressLine3, city, state, zipCode }) => {
  const { addressData, validationKey, addressValidationScenario, suggestedAddresses } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()

  const getAlertTitle = () => {
    switch (addressValidationScenario) {
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_NO_CONFIRMED:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE:
        return t('editAddress.validation.confirmAddress.title')
      case AddressValidationScenarioTypesConstants.MISSING_UNIT_OVERRIDE:
        return t('editAddress.validation.addUnit.title')
      default:
        return ''
    }
  }

  const getAlertBody = () => {
    switch (addressValidationScenario) {
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS:
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE:
        return t('editAddress.validation.confirmAddress.suggestions.body')
      case AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE:
        return t('editAddress.validation.confirmAddress.noSuggestions.body')
      case AddressValidationScenarioTypesConstants.MISSING_UNIT_OVERRIDE:
        return t('editAddress.validation.addUnit.body')
      default:
        return ''
    }
  }

  const getAlert = () => {
    return (
      <Box justifyContent="center" {...containerStyles} mt={marginContentTop}>
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

  const getYouEnteredAddress = () => {
    return (
      <Box mt={theme.dimensions.contentMarginTop}>
        <TextArea>
          <TextView color="primary" variant="MobileBodyBold">
            {t('editAddress.validation.youEntered')}
          </TextView>
          <Box>
            <TextView color="primary" variant="MobileBody" mt={marginBetween}>
              {addressLine1}
            </TextView>
            <TextView color="primary" variant="MobileBody" mb={marginBetween}>
              {city + ', ' + state + ', ' + zipCode}
            </TextView>
          </Box>
          <VAButton onPress={onCancel} label={t('editAddress.validation.editAddress')} textColor="primaryContrast" backgroundColor="button" />
        </TextArea>
      </Box>
    )
  }

  const getSuggestedAddresses = () => {
    if (!suggestedAddresses) {
      return <></>
    }

    const suggestedAddressFields = map(suggestedAddresses, (address) => {
      return (
        <>
          <TextView>{address.attributes.addressLine1}</TextView>
          <TextView>{address.attributes.city + ', ' + address.attributes.stateCode + ', ' + address.attributes.zipCode}</TextView>
        </>
      )
    })

    return (
      <Box mt={theme.dimensions.contentMarginTop}>
        <TextArea>{suggestedAddressFields}</TextArea>
      </Box>
    )
  }

  const onUseThisAddress = () => {
    if (addressData) {
      addressData.validationKey = validationKey
      dispatch(updateAddress(addressData, ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID))
    }
  }

  const onCancel = () => {
    dispatch(finishValidateAddress())
  }

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.main,
  }

  const containerStyles = {
    flex: 1,
    mx: theme.dimensions.gutter,
  }

  const marginBetween = theme.dimensions.marginBetween
  const marginContentTop = theme.dimensions.contentMarginTop
  const marginContentBottom = theme.dimensions.contentMarginBottom
  const marginBetweenButtons = theme.dimensions.marginBetweenButtons

  const showSuggestions =
    addressValidationScenario === AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS ||
    addressValidationScenario === AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE

  return (
    <ScrollView contentContainerStyle={scrollStyles}>
      {getAlert()}
      {getYouEnteredAddress()}
      {showSuggestions && getSuggestedAddresses()}
      <Box {...containerStyles} mt={marginBetween} mb={marginContentBottom}>
        <Box mb={marginBetweenButtons}>
          <VAButton onPress={onUseThisAddress} label={t('editAddress.validation.useAddress')} textColor="primaryContrast" backgroundColor="button" />
        </Box>
        <Box>
          <VAButton onPress={onCancel} label={t('editAddress.validation.cancel')} textColor="link" backgroundColor="textBox" borderColor="secondary" />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default AddressValidation

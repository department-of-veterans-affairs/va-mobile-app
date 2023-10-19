import { ScrollView, TextInput } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useRef, useState } from 'react'

import { AddressData, addressTypeFields, addressTypes } from 'api/types'
import {
  AlertBox,
  Box,
  ButtonTypesConstants,
  FieldType,
  FormFieldType,
  FormWrapper,
  FullScreenSubtask,
  LoadingComponent,
  PickerItem,
  VAButton,
  VATextInputTypes,
  ValidationFunctionItems,
} from 'components'
import { Countries } from 'constants/countries'
import { GenerateAddressMessages } from 'translations/en/functions'
import { MilitaryPostOffices } from 'constants/militaryPostOffices'
import { MilitaryStates } from 'constants/militaryStates'
import { NAMESPACE } from 'constants/namespaces'
import { RootNavStackParamList } from 'App'
import { SnackbarMessages } from 'components/SnackBar'
import { States } from 'constants/states'
import { getAddressDataPayload } from 'utils/personalInformation'
import { profileAddressOptions } from '../AddressSummary'
import { showSnackBar } from 'utils/common'
import { useAlert, useAppDispatch, useBeforeNavBackListener, useDestructiveActionSheet, useIsScreenReaderEnabled, useTheme } from 'utils/hooks'
import { useContactInformation } from 'api/contactInformation'
import { useDeleteAddress, useSaveAddress, useValidateAddress } from 'api/contactInformation'
import AddressValidation from '../AddressValidation'

const MAX_ADDRESS_LENGTH = 35
const ZIP_CODE_LENGTH = 5

const USA_VALUE = 'USA'

export const AddressDataEditedFieldValues: {
  countryCodeIso3: AddressDataEditedFields
  addressLine1: AddressDataEditedFields
  addressLine2: AddressDataEditedFields
  addressLine3: AddressDataEditedFields
  city: AddressDataEditedFields
  stateCode: AddressDataEditedFields
  zipCode: AddressDataEditedFields
  addressType: AddressDataEditedFields
  province: AddressDataEditedFields
  internationalPostalCode: AddressDataEditedFields
} = {
  countryCodeIso3: 'countryCodeIso3',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  addressLine3: 'addressLine3',
  city: 'city',
  stateCode: 'stateCode',
  zipCode: 'zipCode',
  addressType: 'addressType',
  province: 'province',
  internationalPostalCode: 'internationalPostalCode',
}
export type AddressDataEditedFields =
  | 'countryCodeIso3'
  | 'addressLine1'
  | 'addressLine2'
  | 'addressLine3'
  | 'city'
  | 'stateCode'
  | 'zipCode'
  | 'addressType'
  | 'province'
  | 'internationalPostalCode'

type IEditAddressScreen = StackScreenProps<RootNavStackParamList, 'EditAddress'>

const EditAddressScreen: FC<IEditAddressScreen> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { displayTitle, addressType } = route.params
  const { data: contactInformation } = useContactInformation()
  const { mutate: deleteAddress, isLoading: deletingAddress, isSuccess: addressDeleted } = useDeleteAddress()
  const { mutate: saveAddress, isLoading: savingAddress, isSuccess: addressSaved } = useSaveAddress()
  const { mutate: validateAddress, isLoading: validatingAddress, data: validationData } = useValidateAddress()
  const [addressValidated, setAddressValidated] = useState(false)
  const deleteAddressAlert = useAlert()
  const destructiveActionSheet = useDestructiveActionSheet()
  const scrollViewRef = useRef<ScrollView>(null)
  const screenReaderEnabled = useIsScreenReaderEnabled()

  const addressLine1Ref = useRef<TextInput>(null)
  const addressLine3Ref = useRef<TextInput>(null)
  const zipCodeRef = useRef<TextInput>(null)
  const cityRef = useRef<TextInput>(null)

  const snackbarMessages: SnackbarMessages = GenerateAddressMessages(t, addressType)

  const removalSnackbarMessages: SnackbarMessages = {
    successMsg: t('contactInformation.residentialAddress.removed'),
    errorMsg: t('contactInformation.residentialAddress.removed.error'),
  }

  const getInitialState = (itemToGet: AddressDataEditedFields): string => {
    const item = contactInformation?.[addressType]?.[itemToGet]
    return item ? item : ''
  }

  const getInitialStateForPicker = (itemToGet: AddressDataEditedFields, listToSearch: Array<PickerItem>): string => {
    const item = getInitialState(itemToGet)
    const found = listToSearch.find((obj) => obj.value === item)
    return found ? found.value : ''
  }

  const getInitialStateForCheckBox = (itemToGet: AddressDataEditedFields): boolean => {
    const item = getInitialState(itemToGet)
    return item ? item === addressTypeFields.overseasMilitary : false
  }

  const onCancel = (): void => {
    navigation.goBack()
  }

  const initialCheckbox = getInitialStateForCheckBox(AddressDataEditedFieldValues.addressType)
  const initialCountry = getInitialStateForPicker(AddressDataEditedFieldValues.countryCodeIso3, Countries)
  const initialAddressLine1 = getInitialState(AddressDataEditedFieldValues.addressLine1)
  const initialAddressLine2 = getInitialState(AddressDataEditedFieldValues.addressLine2)
  const initialAddressLine3 = getInitialState(AddressDataEditedFieldValues.addressLine3)
  const initialMilitaryPostOffice = getInitialStateForPicker(AddressDataEditedFieldValues.city, MilitaryPostOffices)
  const initialCity = getInitialState(AddressDataEditedFieldValues.city)
  const initialState =
    contactInformation?.[addressType]?.countryCodeIso3 === USA_VALUE
      ? getInitialStateForPicker(AddressDataEditedFieldValues.stateCode, States)
      : getInitialState(AddressDataEditedFieldValues.stateCode) || getInitialState(AddressDataEditedFieldValues.province)
  const initialZipCode = getInitialState(AddressDataEditedFieldValues.zipCode) || getInitialState(AddressDataEditedFieldValues.internationalPostalCode)

  const [checkboxSelected, setCheckboxSelected] = useState(initialCheckbox)
  const [country, setCountry] = useState(initialCountry)
  const [addressLine1, setAddressLine1] = useState(initialAddressLine1)
  const [addressLine2, setAddressLine2] = useState(initialAddressLine2)
  const [addressLine3, setAddressLine3] = useState(initialAddressLine3)
  const [militaryPostOffice, setMilitaryPostOffice] = useState(initialMilitaryPostOffice)
  const [city, setCity] = useState(initialCity)
  const [state, setState] = useState(initialState)
  const [zipCode, setZipCode] = useState(initialZipCode)
  const [formContainsError, setFormContainsError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [showAddressValidation, setShowAddressValidation] = useState(false)

  const abortController = new AbortController()
  const abortSignal = abortController.signal

  useBeforeNavBackListener(navigation, (e) => {
    // If address is being validated when exiting screen, abort API call
    if (validatingAddress) {
      abortController.abort()
    }

    if (!formChanged() && !showAddressValidation) {
      return
    }

    if (addressDeleted || addressSaved || addressValidated) {
      return
    }

    e.preventDefault()
    const title =
      addressType === profileAddressOptions.RESIDENTIAL_ADDRESS ? t('editAddress.validation.cancelConfirm.home.title') : t('editAddress.validation.cancelConfirm.mailing.title')

    destructiveActionSheet({
      title,
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('keepEditing'),
        },
        {
          text: t('deleteChanges'),
          onPress: () => {
            navigation.dispatch(e.data.action)
          },
        },
      ],
    })
  })

  const isDomestic = (countryVal: string): boolean => {
    return countryVal === USA_VALUE || !countryVal
  }

  const getAddressLocationType = (): addressTypes => {
    if (checkboxSelected) {
      return addressTypeFields.overseasMilitary
    } else {
      if (isDomestic(country)) {
        return addressTypeFields.domestic
      } else {
        return addressTypeFields.international
      }
    }
  }

  const onDelete = (): void => {
    const currentAddressData = contactInformation?.[addressType]

    if (!currentAddressData) {
      // Cannot delete without existing data
      return
    }

    const mutateOptions = {
      onSuccess: () => showSnackBar(removalSnackbarMessages.successMsg, dispatch, undefined, true, false, true),
      onError: () => showSnackBar(removalSnackbarMessages.errorMsg, dispatch, () => deleteAddress(currentAddressData, mutateOptions), false, true),
    }
    deleteAddress(currentAddressData, mutateOptions)
  }

  const getAddressValues = (): AddressData => {
    const addressLocationType = getAddressLocationType()

    const addressId = contactInformation?.[addressType]?.id || 0
    const countryNameObj = Countries.find((countryDef) => countryDef.value === country)
    const countryName = countryNameObj ? countryNameObj.label : ''

    const isInternationalAddress = addressLocationType === addressTypeFields.international

    const addressPost: AddressData = {
      id: addressId,
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim(),
      addressLine3: addressLine3?.trim(),
      addressPou: addressType === profileAddressOptions.RESIDENTIAL_ADDRESS ? 'RESIDENCE/CHOICE' : 'CORRESPONDENCE',
      addressType: addressLocationType,
      city: city.trim(),
      countryName,
      countryCodeIso3: country,
      stateCode: state,
      zipCode: !isInternationalAddress ? zipCode?.trim() : '',
      internationalPostalCode: isInternationalAddress ? zipCode?.trim() : '',
    }

    if (addressLocationType === addressTypeFields.overseasMilitary) {
      addressPost.city = militaryPostOffice
    }

    // international addresses are to use 'province' instead of 'stateCode'(Backend error if included)
    if (isInternationalAddress) {
      delete addressPost.stateCode
      addressPost.province = state
    }
    return addressPost
  }

  const onSave = (): void => {
    const addressValues = getAddressValues()
    const addressData = getAddressDataPayload(addressValues, contactInformation)

    const save = () => {
      validateAddress(
        { addressData, abortSignal },
        {
          onSuccess: (data) => {
            if (data?.confirmedSuggestedAddresses) {
              setShowAddressValidation(true)
            } else {
              setAddressValidated(true)
              showSnackBar(snackbarMessages.successMsg, dispatch, undefined, true, false, true)
            }
          },
          onError: () => showSnackBar(snackbarMessages.errorMsg, dispatch, () => save, false, true),
        },
      )
    }

    save()
  }

  useEffect(() => {
    // if the address is a military base address
    if (checkboxSelected && country !== USA_VALUE) {
      setCountry(USA_VALUE)
    }
  }, [checkboxSelected, country])

  useEffect(() => {
    if (addressDeleted || addressSaved || addressValidated) {
      navigation.goBack()
    }
  }, [addressDeleted, addressSaved, addressValidated, navigation])

  const formChanged = (): boolean =>
    checkboxSelected !== initialCheckbox ||
    country !== initialCountry ||
    addressLine1 !== initialAddressLine1 ||
    addressLine2 !== initialAddressLine2 ||
    addressLine3 !== initialAddressLine3 ||
    militaryPostOffice !== initialMilitaryPostOffice ||
    city !== initialCity ||
    state !== initialState ||
    zipCode !== initialZipCode

  if (deletingAddress || savingAddress || validatingAddress) {
    const loadingText = deletingAddress ? t('contactInformation.delete.address') : t('contactInformation.savingAddress')

    return (
      <FullScreenSubtask title={displayTitle} leftButtonText={t('cancel')} onLeftButtonPress={onCancel}>
        <LoadingComponent text={loadingText} />
      </FullScreenSubtask>
    )
  }

  if (showAddressValidation && validationData) {
    const addressValues = getAddressValues()
    const addressValidationProps = {
      addressEntered: getAddressDataPayload(addressValues, contactInformation),
      addressId: contactInformation?.[addressType]?.id || 0,
      snackbarMessages: snackbarMessages,
      validationData,
      saveAddress,
      setShowAddressValidation,
    }
    return (
      <FullScreenSubtask title={displayTitle} leftButtonText={t('cancel')} onLeftButtonPress={onCancel}>
        <AddressValidation {...addressValidationProps} />
      </FullScreenSubtask>
    )
  }

  const clearFieldsAndErrors = (): void => {
    setAddressLine1('')
    setAddressLine2('')
    setAddressLine3('')
    setCity('')
    setState('')
    setZipCode('')
    setMilitaryPostOffice('')

    // clear all current field errors since inputs change
    setResetErrors(true)
  }

  const onCountryChange = (updatedValue: string): void => {
    // if the country used to be domestic and now its not, or vice versa, all fields should be reset
    // and all current field errors should be cleared
    if (isDomestic(country) !== isDomestic(updatedValue)) {
      clearFieldsAndErrors()
    }

    setCountry(updatedValue)
  }

  const onCheckboxChange = (updatedValue: boolean): void => {
    setCheckboxSelected(updatedValue)
    clearFieldsAndErrors()

    if (!updatedValue) {
      setCountry('')
    }
  }

  const getCityOrMilitaryBaseFormFieldType = (): FormFieldType<unknown> => {
    if (checkboxSelected) {
      return {
        fieldType: FieldType.Picker,
        fieldProps: {
          selectedValue: militaryPostOffice,
          onSelectionChange: setMilitaryPostOffice,
          pickerOptions: MilitaryPostOffices,
          includeBlankPlaceholder: true,
          labelKey: 'editAddress.militaryPostOffices',
          isRequiredField: true,
          testID: 'militaryPostOfficeTestID',
        },
        fieldErrorMessage: t('editAddress.validOptionFieldError'),
      }
    }

    return {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'editAddress.city',
        value: city,
        onChange: setCity,
        inputRef: cityRef,
        isRequiredField: true,
        testID: 'cityTestID',
      },
      fieldErrorMessage: t('editAddress.cityFieldError'),
    }
  }

  const getStatesFormFieldType = (): FormFieldType<unknown> => {
    if (isDomestic(country)) {
      const pickerOptions = checkboxSelected ? MilitaryStates : States

      return {
        fieldType: FieldType.Picker,
        fieldProps: {
          selectedValue: state,
          onSelectionChange: setState,
          pickerOptions: pickerOptions,
          labelKey: 'editAddress.state',
          includeBlankPlaceholder: true,
          isRequiredField: true,
          testID: 'stateTestID',
        },
        fieldErrorMessage: checkboxSelected ? t('editAddress.validOptionFieldError') : t('editAddress.stateFieldError'),
      }
    }

    return {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'editAddress.state',
        value: state,
        onChange: setState,
        testID: 'stateTestID',
      },
    }
  }

  const zipCodeLengthValidation = (): boolean => {
    // returns true if the zip code is greater than 0 characters and the length is not equal to 5 - this means the
    // corresponding error message should be displayed
    return zipCode.length !== ZIP_CODE_LENGTH && zipCode.length > 0
  }

  const getZipCodeOrInternationalCodeFields = (): {
    zipCodeLabelKey: string
    zipCodeInputType: VATextInputTypes
    zipCodeFieldError: string
    zipCodeValidationList?: Array<ValidationFunctionItems>
  } => {
    if (isDomestic(country)) {
      return {
        zipCodeLabelKey: 'editAddress.zipCode',
        zipCodeInputType: 'phone',
        zipCodeFieldError: t('editAddress.zipCodeFieldError'),
        zipCodeValidationList: [
          {
            validationFunction: zipCodeLengthValidation,
            validationFunctionErrorMessage: t('editAddress.zipCodeLengthValidationFieldError'),
          },
        ],
      }
    }

    return {
      zipCodeLabelKey: 'editAddress.internationalPostCode',
      zipCodeInputType: 'none',
      zipCodeFieldError: t('editAddress.internationalPostCodeFieldError'),
    }
  }

  const { zipCodeLabelKey, zipCodeInputType, zipCodeFieldError, zipCodeValidationList } = getZipCodeOrInternationalCodeFields()

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'editAddress.liveOnMilitaryBase',
        selected: checkboxSelected,
        onSelectionChange: onCheckboxChange,
        testID: 'USMilitaryBaseCheckboxTestID',
      },
    },
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        selectedValue: country,
        onSelectionChange: onCountryChange,
        pickerOptions: Countries,
        labelKey: 'editAddress.country',
        includeBlankPlaceholder: true,
        isRequiredField: true,
        disabled: checkboxSelected,
        testID: 'countryPickerTestID',
      },
      fieldErrorMessage: t('editAddress.countryFieldError'),
      hideField: checkboxSelected,
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'editAddress.streetAddressLine1',
        value: addressLine1,
        onChange: setAddressLine1,
        maxLength: MAX_ADDRESS_LENGTH,
        inputRef: addressLine1Ref,
        isRequiredField: true,
        helperTextKey: 'editAddress.streetAddress.helperText',
        testID: 'streetAddressLine1TestID',
      },
      fieldErrorMessage: t('editAddress.streetAddressLine1FieldError'),
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'editAddress.streetAddressLine2',
        value: addressLine2,
        onChange: setAddressLine2,
        maxLength: MAX_ADDRESS_LENGTH,
        helperTextKey: 'editAddress.streetAddress.helperText',
        testID: 'streetAddressLine2TestID',
      },
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'editAddress.streetAddressLine3',
        value: addressLine3,
        onChange: setAddressLine3,
        maxLength: MAX_ADDRESS_LENGTH,
        inputRef: addressLine3Ref,
        helperTextKey: 'editAddress.streetAddress.helperText',
        testID: 'streetAddressLine3TestID',
      },
    },
    getCityOrMilitaryBaseFormFieldType(),
    getStatesFormFieldType(),
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: zipCodeInputType,
        labelKey: zipCodeLabelKey,
        value: zipCode,
        onChange: setZipCode,
        inputRef: zipCodeRef,
        isRequiredField: true,
        testID: 'zipCodeTestID',
      },
      fieldErrorMessage: zipCodeFieldError,
      validationList: zipCodeValidationList,
    },
  ]

  const noAddressData = !contactInformation?.[addressType]

  const lowerCaseTitle = displayTitle.toLowerCase()

  const onDeletePressed = (): void => {
    deleteAddressAlert({
      title: t('contactInformation.removeInformation.title', { info: lowerCaseTitle }),
      message: t('contactInformation.removeInformation.body', { info: lowerCaseTitle }),
      buttons: [
        {
          text: t('keep'),
        },
        {
          text: t('remove'),
          onPress: onDelete,
        },
      ],
      screenReaderEnabled: screenReaderEnabled,
    })
  }

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={displayTitle}
      leftButtonText={t('cancel')}
      onLeftButtonPress={onCancel}
      rightButtonText={t('save')}
      onRightButtonPress={() => setOnSaveClicked(true)}
      testID="EditAddressTestID">
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {addressType === profileAddressOptions.RESIDENTIAL_ADDRESS && !noAddressData && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <VAButton
              onPress={onDeletePressed}
              label={t('contactInformation.removeData', { pageName: lowerCaseTitle })}
              buttonType={ButtonTypesConstants.buttonDestructive}
              testID="EditAddressSaveTestID"
            />
          </Box>
        )}
        {formContainsError && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox title={t('editAddress.alertError')} border="error" scrollViewRef={scrollViewRef} focusOnError={onSaveClicked} />
          </Box>
        )}
        <FormWrapper
          fieldsList={formFieldsList}
          onSave={onSave}
          setFormContainsError={setFormContainsError}
          resetErrors={resetErrors}
          setResetErrors={setResetErrors}
          onSaveClicked={onSaveClicked}
          setOnSaveClicked={setOnSaveClicked}
        />
      </Box>
    </FullScreenSubtask>
  )
}

export default EditAddressScreen

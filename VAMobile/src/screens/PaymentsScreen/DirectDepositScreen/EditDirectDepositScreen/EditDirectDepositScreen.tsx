import { ScrollView, TextInput } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'

import { AccountOptions } from 'constants/accounts'
import { AccountTypes } from 'store/api/types'
import {
  AlertBox,
  Box,
  CollapsibleView,
  ErrorComponent,
  FieldType,
  FormFieldType,
  FormWrapper,
  FullScreenSubtask,
  LoadingComponent,
  PickerItem,
  TextView,
  VAImage,
} from 'components'
import { DirectDepositState, finishEditBankInfo, updateBankInfo } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootNavStackParamList } from 'App'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SnackbarMessages } from 'components/SnackBar'
import { VATheme } from 'styles/theme'
import { getTranslation } from 'utils/formattingUtils'
import { useAppDispatch, useError } from 'utils/hooks'
import { useSelector } from 'react-redux'
import { useTheme } from 'styled-components'

const MAX_ROUTING_DIGITS = 9
const MAX_ACCOUNT_DIGITS = 17

type EditDirectDepositProps = StackScreenProps<RootNavStackParamList, 'EditDirectDeposit'>

/**
 * Screen for displaying editing direct deposit information
 */
const EditDirectDepositScreen: FC<EditDirectDepositProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { t: tc } = useTranslation()
  const { displayTitle } = route.params
  const theme = useTheme() as VATheme
  const accountNumRef = useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const { bankInfoUpdated, saving, invalidRoutingNumberError } = useSelector<RootState, DirectDepositState>((state) => state.directDeposit)

  const [routingNumber, setRoutingNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountType, setAccountType] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)

  const snackbarMessages: SnackbarMessages = {
    successMsg: t('directDeposit.saved'),
    errorMsg: t('directDeposit.saved.error'),
  }

  const accountOptions: Array<PickerItem> = AccountOptions.map((option) => {
    // translate key
    return {
      value: option.value,
      label: getTranslation(option.label, tc),
    }
  })

  const goBack = useCallback(() => {
    dispatch(finishEditBankInfo(ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID))
    navigation.goBack()
  }, [dispatch, navigation])

  useEffect(() => {
    if (bankInfoUpdated) {
      goBack()
    }
  })

  if (useError(ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID)) {
    return (
      <FullScreenSubtask onLeftButtonPress={goBack} leftButtonText={t('cancel')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID} />
      </FullScreenSubtask>
    )
  }

  if (saving) {
    return (
      <FullScreenSubtask onLeftButtonPress={goBack} leftButtonText={t('cancel')}>
        <LoadingComponent text={t('directDeposit.savingInformation')} />
      </FullScreenSubtask>
    )
  }

  const onSave = (): void => {
    dispatch(updateBankInfo(accountNumber, routingNumber, accountType as AccountTypes, snackbarMessages, ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID))
  }

  const containsNonNumbersValidation = (input: string): boolean => {
    // returns true if the input contains anything else but numbers
    return !/^\d+$/.test(input)
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        labelKey: 'editDirectDeposit.routingNumber',
        inputType: 'phone',
        onChange: setRoutingNumber,
        maxLength: MAX_ROUTING_DIGITS,
        value: routingNumber,
        isRequiredField: true,
        helperTextKey: 'editDirectDeposit.routingNumberHelperText',
      },
      fieldErrorMessage: t('editDirectDeposit.routingNumberFieldError'),
      validationList: [
        {
          validationFunction: (): boolean => containsNonNumbersValidation(routingNumber),
          validationFunctionErrorMessage: t('editDirectDeposit.routingNumberFieldError'),
        },
      ],
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        labelKey: 'editDirectDeposit.accountNumber',
        inputType: 'phone',
        onChange: setAccountNumber,
        maxLength: MAX_ACCOUNT_DIGITS,
        value: accountNumber,
        inputRef: accountNumRef,
        isRequiredField: true,
        helperTextKey: 'editDirectDeposit.accountNumberHelperText',
      },
      fieldErrorMessage: t('editDirectDeposit.accountNumberFieldError'),
      validationList: [
        {
          validationFunction: (): boolean => containsNonNumbersValidation(accountNumber),
          validationFunctionErrorMessage: t('editDirectDeposit.routingNumberFieldError'),
        },
      ],
    },
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'common:editDirectDeposit.accountType',
        selectedValue: accountType,
        onSelectionChange: setAccountType,
        pickerOptions: accountOptions,
        includeBlankPlaceholder: true,
        isRequiredField: true,
      },
      fieldErrorMessage: t('editDirectDeposit.accountTypeFieldError'),
    },
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'editDirectDeposit.confirm',
        selected: confirmed,
        onSelectionChange: setConfirmed,
        a11yHint: t('editDirectDeposit.confirmHint'),
        isRequiredField: true,
      },
      fieldErrorMessage: t('editDirectDeposit.checkBoxFieldError'),
    },
  ]

  return (
    <>
      <FullScreenSubtask
        scrollViewRef={scrollViewRef}
        onLeftButtonPress={goBack}
        leftButtonText={t('cancel')}
        rightButtonText={t('save')}
        onRightButtonPress={() => setOnSaveClicked(true)}
        title={displayTitle}>
        <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
          {formContainsError && (
            <Box mb={theme.dimensions.standardMarginBetween}>
              <AlertBox scrollViewRef={scrollViewRef} title={t('editDirectDeposit.pleaseCheckDDInfo')} border="error" focusOnError={onSaveClicked} />
            </Box>
          )}
          {invalidRoutingNumberError && (
            <Box mb={theme.dimensions.standardMarginBetween}>
              <AlertBox
                scrollViewRef={scrollViewRef}
                title={t('editDirectDeposit.error')}
                text={t('editDirectDeposit.errorInvalidRoutingNumber')}
                border="error"
                focusOnError={onSaveClicked}
              />
            </Box>
          )}
          <Box mx={theme.dimensions.gutter} accessible={true}>
            <TextView variant="MobileBody">{t('editDirectDeposit.bankInfoTitle')}</TextView>
          </Box>
          <Box mt={theme.dimensions.condensedMarginBetween}>
            <CollapsibleView text={t('editDirectDeposit.findTheseNumbers')}>
              <VAImage name={'PaperCheck'} a11yLabel={t('editDirectDeposit.checkingExample')} marginX={theme.dimensions.gutter} />
            </CollapsibleView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
            <FormWrapper
              fieldsList={formFieldsList}
              onSave={onSave}
              setFormContainsError={setFormContainsError}
              onSaveClicked={onSaveClicked}
              setOnSaveClicked={setOnSaveClicked}
            />
          </Box>
        </Box>
      </FullScreenSubtask>
    </>
  )
}

export default EditDirectDepositScreen

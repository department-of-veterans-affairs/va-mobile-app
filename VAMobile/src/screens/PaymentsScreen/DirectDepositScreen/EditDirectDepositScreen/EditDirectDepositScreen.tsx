import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, TextInput } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { RootNavStackParamList } from 'App'

import { checkIfRoutingNumberIsInvalid, useUpdateBankInfo } from 'api/directDeposit'
import { AccountTypes, PaymentAccountData } from 'api/types'
import {
  AlertWithHaptics,
  Box,
  CollapsibleView,
  FieldType,
  FormFieldType,
  FormWrapper,
  FullScreenSubtask,
  LoadingComponent,
  PickerItem,
  TextView,
  VAImage,
} from 'components'
import { AccountOptions } from 'constants/accounts'
import { NAMESPACE } from 'constants/namespaces'
import { isErrorObject } from 'utils/common'
import { getTranslation } from 'utils/formattingUtils'
import { useBeforeNavBackListener, useDestructiveActionSheet, useTheme } from 'utils/hooks'

const MAX_ROUTING_DIGITS = 9
const MAX_ACCOUNT_DIGITS = 17

type EditDirectDepositProps = StackScreenProps<RootNavStackParamList, 'EditDirectDeposit'>

/**
 * Screen for displaying editing direct deposit information
 */
function EditDirectDepositScreen({ navigation, route }: EditDirectDepositProps) {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { t: tc } = useTranslation()
  const { displayTitle } = route.params
  const theme = useTheme()
  const confirmAlert = useDestructiveActionSheet()
  const accountNumRef = useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const [invalidRoutingNumberError, setIsInvalidRoutingNumberError] = useState(false)
  const { mutate: updateBankInfo, isSuccess: bankInfoUpdated, isPending: saving } = useUpdateBankInfo()
  const { gutter, contentMarginBottom, standardMarginBetween, condensedMarginBetween } = theme.dimensions

  const [routingNumber, setRoutingNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountType, setAccountType] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)

  useBeforeNavBackListener(navigation, (e) => {
    if (noPageChanges() || bankInfoUpdated) {
      return
    }
    e.preventDefault()
    confirmAlert({
      title: t('directDeposit.deleteChanges'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
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

  //returns true when no edits have been made.
  const noPageChanges = (): boolean => {
    if (routingNumber || accountNumber || accountType || confirmed === true) {
      return false
    } else {
      return true
    }
  }

  const accountOptions: Array<PickerItem> = AccountOptions.map((option) => {
    // translate key
    return {
      value: option.value,
      label: getTranslation(option.label, tc),
    }
  })

  const goBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  useEffect(() => {
    if (bankInfoUpdated) {
      goBack()
    }
  }, [bankInfoUpdated, goBack])

  const onSave = (): void => {
    const updateBankData: PaymentAccountData = {
      accountNumber: accountNumber,
      accountType: accountType as AccountTypes,
      financialInstitutionName: 'Bank',
      financialInstitutionRoutingNumber: routingNumber,
    }
    const mutateOptions = {
      onSuccess: () => snackbar.show(t('directDeposit.saved')),
      onError: (error: unknown) => {
        if (isErrorObject(error)) {
          const routingNumberError = checkIfRoutingNumberIsInvalid(error)
          setIsInvalidRoutingNumberError(routingNumberError)
          if (!routingNumberError) {
            snackbar.show(t('directDeposit.saved.error'), {
              isError: true,
              offset: theme.dimensions.snackBarBottomOffset,
              onActionPressed: () => updateBankInfo(updateBankData, mutateOptions),
            })
          }
        }
      },
    }
    updateBankInfo(updateBankData, mutateOptions)
  }

  const containsNonNumbersValidation = (input: string): boolean => {
    // returns true if the input contains anything else but numbers
    return !/^\d+$/.test(input)
  }

  const invalidRoutingNumber = (input: string): boolean => {
    if (input.length !== 9) {
      return true
    }

    const digits = input.split('')
    let sum = 0
    let multiplier = 3
    digits.forEach((digit: string) => {
      sum += parseInt(digit, 10) * multiplier
      multiplier = multiplier === 3 ? 7 : multiplier === 7 ? 1 : 3
    })
    return sum % 10 !== 0
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
        testID: 'routingNumber',
      },
      fieldErrorMessage: t('editDirectDeposit.routingNumberFieldError'),
      validationList: [
        {
          validationFunction: (): boolean => containsNonNumbersValidation(routingNumber),
          validationFunctionErrorMessage: t('editDirectDeposit.routingNumberFieldError'),
        },
        {
          validationFunction: (): boolean => invalidRoutingNumber(routingNumber),
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
        testID: 'accountNumber',
      },
      fieldErrorMessage: t('editDirectDeposit.accountNumberFieldError'),
      validationList: [
        {
          validationFunction: (): boolean => containsNonNumbersValidation(accountNumber),
          validationFunctionErrorMessage: t('editDirectDeposit.accountNumberFieldError'),
        },
      ],
    },
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'editDirectDeposit.accountType',
        selectedValue: accountType,
        onSelectionChange: setAccountType,
        pickerOptions: accountOptions,
        includeBlankPlaceholder: true,
        isRequiredField: true,
        testID: 'accountType',
        confirmTestID: 'accountTypeConfirmID',
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
        testID: 'checkBox',
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
        rightButtonText={saving ? '' : t('save')}
        onRightButtonPress={() => setOnSaveClicked(true)}
        title={saving ? '' : displayTitle}
        leftButtonTestID="directDepositBackID"
        rightButtonTestID="directDepositSaveID">
        {saving ? (
          <LoadingComponent text={t('directDeposit.savingInformation')} />
        ) : (
          <Box mb={contentMarginBottom}>
            {formContainsError && (
              <Box mb={standardMarginBetween}>
                <AlertWithHaptics
                  variant="error"
                  description={t('editDirectDeposit.pleaseCheckDDInfo')}
                  focusOnError={onSaveClicked}
                  scrollViewRef={scrollViewRef}
                />
              </Box>
            )}
            {invalidRoutingNumberError && (
              <Box mb={standardMarginBetween}>
                <AlertWithHaptics
                  variant="error"
                  header={t('editDirectDeposit.error')}
                  description={t('editDirectDeposit.errorInvalidRoutingNumber')}
                  focusOnError={onSaveClicked}
                  scrollViewRef={scrollViewRef}
                />
              </Box>
            )}
            <Box mx={gutter} accessible={true}>
              <TextView variant="MobileBody">{t('editDirectDeposit.bankInfoTitle')}</TextView>
            </Box>
            <Box mt={condensedMarginBetween}>
              <CollapsibleView text={t('editDirectDeposit.findTheseNumbers')} testID="directDepositFindTheseNumbersID">
                <VAImage name={'PaperCheck'} a11yLabel={t('editDirectDeposit.checkingExample')} marginX={gutter} />
              </CollapsibleView>
            </Box>
            <Box mt={standardMarginBetween} mx={gutter}>
              <FormWrapper
                fieldsList={formFieldsList}
                onSave={onSave}
                setFormContainsError={setFormContainsError}
                onSaveClicked={onSaveClicked}
                setOnSaveClicked={setOnSaveClicked}
              />
            </Box>
          </Box>
        )}
      </FullScreenSubtask>
    </>
  )
}

export default EditDirectDepositScreen

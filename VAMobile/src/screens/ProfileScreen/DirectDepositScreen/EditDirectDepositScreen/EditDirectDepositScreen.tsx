import { KeyboardAvoidingView, TextInput } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useRef, useState } from 'react'

import { AccountOptions } from 'constants/accounts'
import { AccountTypes } from 'store/api/types'
import { AlertBox, Box, CollapsibleView, ErrorComponent, FieldType, FormFieldType, FormWrapper, LoadingComponent, TextView, VAImage, VAScrollView } from 'components'
import { DirectDepositState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { RootNavStackParamList } from 'App'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { finishEditBankInfo, updateBankInfo } from 'store/actions'
import { focusTextInputRef } from 'utils/common'
import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'

const MAX_ROUTING_DIGITS = 9
const MAX_ACCOUNT_DIGITS = 17

type EditDirectDepositProps = StackScreenProps<RootNavStackParamList, 'EditDirectDeposit'>

/**
 * Screen for displaying editing direct deposit information
 */
const EditDirectDepositScreen: FC<EditDirectDepositProps> = ({ navigation }) => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const tc = useTranslation()
  const theme = useTheme()
  const accountNumRef = useRef<TextInput>(null)
  const { bankInfoUpdated, saving, invalidRoutingNumberError } = useSelector<StoreState, DirectDepositState>((state) => state.directDeposit)

  const { gutter, contentMarginTop, contentMarginBottom, standardMarginBetween, condensedMarginBetween } = theme.dimensions

  const [routingNumber, setRoutingNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountType, setAccountType] = useState('')
  const [accountOptions] = useState(
    AccountOptions.map((option) => {
      // translate key
      return {
        ...option,
        label: tc(option.label),
      }
    }),
  )
  const [confirmed, setConfirmed] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)

  useEffect(() => {
    if (bankInfoUpdated) {
      goBack()
    }
  })

  if (useError(ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID)) {
    return <ErrorComponent />
  }

  if (saving) {
    return <LoadingComponent text={t('directDeposit.savingInformation')} />
  }

  const onSave = (): void => {
    dispatch(updateBankInfo(accountNumber, routingNumber, accountType as AccountTypes, ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID))
  }

  const goBack = (): void => {
    navigation.goBack()
    dispatch(finishEditBankInfo())
  }

  const behavior = isIOS() ? 'position' : undefined

  const formFieldsList: Array<FormFieldType> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        labelKey: 'profile:editDirectDeposit.routingNumber',
        inputType: 'phone',
        onChange: setRoutingNumber,
        maxLength: MAX_ROUTING_DIGITS,
        placeholderKey: 'profile:editDirectDeposit.routingNumberPlaceHolder',
        value: routingNumber,
        isRequiredField: true,
        helperTextKey: 'profile:editDirectDeposit.routingNumberHelperText',
      },
      fieldErrorMessage: t('editDirectDeposit.routingNumberFieldError'),
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        labelKey: 'profile:editDirectDeposit.accountNumber',
        inputType: 'phone',
        onChange: setAccountNumber,
        maxLength: MAX_ACCOUNT_DIGITS,
        placeholderKey: 'profile:editDirectDeposit.accountNumberPlaceHolder',
        value: accountNumber,
        inputRef: accountNumRef,
        isRequiredField: true,
        helperTextKey: 'profile:editDirectDeposit.accountNumberHelperText',
      },
      fieldErrorMessage: t('editDirectDeposit.accountNumberFieldError'),
    },
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'profile:editDirectDeposit.accountType',
        selectedValue: accountType,
        onSelectionChange: setAccountType,
        pickerOptions: accountOptions,
        placeholderKey: 'profile:editDirectDeposit.accountTypePlaceHolder',
        onUpArrow: (): void => focusTextInputRef(accountNumRef),
        isRequiredField: true,
      },
      fieldErrorMessage: t('editDirectDeposit.accountTypeFieldError'),
    },
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'profile:editDirectDeposit.confirm',
        selected: confirmed,
        onSelectionChange: setConfirmed,
        a11yHint: t('editDirectDeposit.confirmHint'),
        isRequiredField: true,
      },
      fieldErrorMessage: t('editDirectDeposit.checkBoxFieldError'),
    },
  ]

  return (
    <VAScrollView {...testIdProps('Direct-deposit: Edit-direct-deposit-page')}>
      <KeyboardAvoidingView behavior={behavior} keyboardVerticalOffset={25}>
        <Box mt={contentMarginTop} mb={contentMarginBottom}>
          {formContainsError && (
            <Box mx={gutter} mb={standardMarginBetween}>
              <AlertBox title={t('editDirectDeposit.pleaseCheckDDInfo')} border="error" background="noCardBackground" />
            </Box>
          )}
          {invalidRoutingNumberError && (
            <Box mx={gutter} mb={standardMarginBetween}>
              <AlertBox title={t('editDirectDeposit.error')} text={t('editDirectDeposit.errorInvalidRoutingNumber')} border="error" background="noCardBackground" />
            </Box>
          )}
          <Box mx={gutter}>
            <TextView variant="MobileBody">{t('editDirectDeposit.bankInfoTitle')}</TextView>
          </Box>
          <Box mt={condensedMarginBetween}>
            <CollapsibleView text={t('editDirectDeposit.findTheseNumbers')}>
              <VAImage name={'PaperCheck'} a11yLabel={t('editDirectDeposit.checkingExample')} marginX={gutter} />
            </CollapsibleView>
          </Box>
          <Box mt={standardMarginBetween} mx={gutter}>
            <FormWrapper fieldsList={formFieldsList} onSave={onSave} goBack={goBack} setFormContainsError={setFormContainsError} />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </VAScrollView>
  )
}

export default EditDirectDepositScreen

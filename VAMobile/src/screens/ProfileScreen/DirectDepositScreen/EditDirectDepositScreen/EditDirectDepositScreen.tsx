import { KeyboardAvoidingView, ScrollView, TextInput } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useRef, useState } from 'react'

import { AccountOptions } from 'constants/accounts'
import { AccountTypes } from 'store/api/types'
import { AlertBox, Box, CollapsibleView, ErrorComponent, FieldType, FormFieldType, FormWrapper, LoadingComponent, TextView, VAImage } from 'components'
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
  const [confirmedDisabled, setConfirmedDisabled] = useState(true)
  const [saveDisabled, setSaveDisabled] = useState(true)

  useEffect(() => {
    if (bankInfoUpdated) {
      goBack()
    }
  })

  useEffect(() => {
    const validAccountNumber = accountNumber.length > 0 && accountNumber.length <= MAX_ACCOUNT_DIGITS
    const isValidContent = routingNumber.length === MAX_ROUTING_DIGITS && validAccountNumber && !!accountType

    // disable should be false if information is valid
    setConfirmedDisabled(!isValidContent)

    if (confirmed && !isValidContent) {
      setConfirmed(false)
    }

    setSaveDisabled(!(isValidContent && confirmed))
  }, [routingNumber, accountNumber, accountType, confirmed, saveDisabled])

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
    },
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'profile:editDirectDeposit.confirm',
        selected: confirmed,
        onSelectionChange: setConfirmed,
        disabled: confirmedDisabled,
        a11yHint: t('editDirectDeposit.confirmHint'),
        isRequiredField: true,
      },
    },
  ]

  return (
    <ScrollView {...testIdProps('Direct-deposit: Edit-direct-deposit-page')}>
      <KeyboardAvoidingView behavior={behavior} keyboardVerticalOffset={25}>
        <Box mt={contentMarginTop} mb={contentMarginBottom}>
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
            <FormWrapper fieldsList={formFieldsList} onSave={onSave} saveDisabled={saveDisabled} goBack={goBack} />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default EditDirectDepositScreen

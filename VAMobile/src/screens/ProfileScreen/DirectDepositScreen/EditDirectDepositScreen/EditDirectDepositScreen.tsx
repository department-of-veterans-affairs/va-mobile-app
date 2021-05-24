import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { AccountOptions } from 'constants/accounts'
import { AccountTypes } from 'store/api/types'
import {
  AlertBox,
  BackButton,
  Box,
  CollapsibleView,
  ErrorComponent,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  PickerItem,
  SaveButton,
  TextView,
  VAImage,
  VAScrollView,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DirectDepositState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { RootNavStackParamList } from 'App'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { finishEditBankInfo, updateBankInfo } from 'store/actions'
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
  const [confirmed, setConfirmed] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)

  const accountOptions: Array<PickerItem> = AccountOptions.map((option) => {
    // translate key
    return {
      value: option.value,
      label: tc(option.label),
    }
  })

  const goBack = useCallback(() => {
    dispatch(finishEditBankInfo(ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID))
    navigation.goBack()
  }, [dispatch, navigation])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={goBack} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={() => setOnSaveClicked(true)} disabled={false} />,
    })
  }, [navigation, goBack])

  useEffect(() => {
    if (bankInfoUpdated) {
      goBack()
    }
  })

  if (useError(ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID} />
  }

  if (saving) {
    return <LoadingComponent text={t('directDeposit.savingInformation')} />
  }

  const onSave = (): void => {
    dispatch(updateBankInfo(accountNumber, routingNumber, accountType as AccountTypes, ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID))
  }

  const containsNonNumbersValidation = (input: string): boolean => {
    // returns true if the input contains anything else but numbers
    return !/^\d+$/.test(input)
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        labelKey: 'profile:editDirectDeposit.routingNumber',
        inputType: 'phone',
        onChange: setRoutingNumber,
        maxLength: MAX_ROUTING_DIGITS,
        value: routingNumber,
        isRequiredField: true,
        helperTextKey: 'profile:editDirectDeposit.routingNumberHelperText',
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
        labelKey: 'profile:editDirectDeposit.accountNumber',
        inputType: 'phone',
        onChange: setAccountNumber,
        maxLength: MAX_ACCOUNT_DIGITS,
        value: accountNumber,
        inputRef: accountNumRef,
        isRequiredField: true,
        helperTextKey: 'profile:editDirectDeposit.accountNumberHelperText',
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
        labelKey: 'profile:editDirectDeposit.accountType',
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
          <FormWrapper fieldsList={formFieldsList} onSave={onSave} setFormContainsError={setFormContainsError} onSaveClicked={onSaveClicked} setOnSaveClicked={setOnSaveClicked} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default EditDirectDepositScreen

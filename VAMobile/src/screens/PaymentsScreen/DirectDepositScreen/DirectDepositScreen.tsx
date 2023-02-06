import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, DefaultList, DefaultListItemObj, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextLine, TextView } from 'components'
import { DirectDepositState, getBankData } from 'store/slices/directDepositSlice'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from '../PaymentsStackScreens'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { StackScreenProps } from '@react-navigation/stack'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDowntime, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'

type DirectDepositScreenProps = StackScreenProps<PaymentsStackParamList, 'DirectDeposit'>

/**
 * Screen for displaying direct deposit information and help numbers
 */
const DirectDepositScreen: FC<DirectDepositScreenProps> = ({ navigation }) => {
  const { paymentAccount: bankData, loading } = useSelector<RootState, DirectDepositState>((state) => state.directDeposit)
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const ddNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.directDepositBenefits)

  const { gutter, contentMarginTop, contentMarginBottom, condensedMarginBetween } = theme.dimensions

  useFocusEffect(
    useCallback(() => {
      if (ddNotInDowntime) {
        dispatch(getBankData(ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID))
      }
    }, [dispatch, ddNotInDowntime]),
  )

  const getButtonTextList = (): Array<DefaultListItemObj> => {
    const textLines: Array<TextLine> = [{ text: t('directDeposit.account'), variant: 'MobileBodyBold' }]
    if (bankData) {
      if (bankData.financialInstitutionName) {
        textLines.push({ text: t('directDeposit.dynamicField', { field: bankData.financialInstitutionName }) })
      }

      if (bankData.accountNumber) {
        textLines.push({ text: t('directDeposit.dynamicField', { field: `${bankData.accountNumber}` }) })
      }

      if (bankData.accountType) {
        textLines.push({ text: t('directDeposit.accountType', { accountType: bankData.accountType }) })
      }

      if ([bankData.financialInstitutionName, bankData.accountNumber, bankData.accountType].filter(Boolean).length === 0) {
        textLines.push({ text: t('directDeposit.addBankAccountInformation') })
      }
    } else {
      textLines.push({ text: t('directDeposit.addBankAccountInformation') })
    }

    return [
      {
        textLines: textLines,
        a11yHintText: t('directDeposit.addBankAccountInformationHint'),
        onPress: navigateTo('EditDirectDeposit', { displayTitle: bankData ? t('directDeposit.edit.title') : t('directDeposit.add.title') }),
        decoratorProps: { accessibilityRole: 'button' },
      },
    ]
  }

  if (useError(ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate backLabel={t('payments.title')} backLabelOnPress={navigation.goBack} title={t('directDeposit.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loading) {
    return (
      <React.Fragment>
        <LoadingComponent text={t('directDeposit.loading')} />
      </React.Fragment>
    )
  }

  return (
    <FeatureLandingTemplate backLabel={t('payments.title')} backLabelOnPress={navigation.goBack} title={t('directDeposit.title')}>
      <Box>
        <Box mx={gutter} mt={contentMarginTop}>
          <TextView variant="MobileBody" {...testIdProps(t('directDeposit.viewAndEditTextA11yLabel'))}>
            {t('directDeposit.viewAndEditText')}
          </TextView>
        </Box>
      </Box>
      <DefaultList items={getButtonTextList()} title={t('directDeposit.information')} />
      <Box>
        <Box mx={gutter} mt={condensedMarginBetween}>
          <TextView>
            <TextView variant="MobileBodyBold">{t('directDeposit.bankFraudNote') + ' '}</TextView>
            <TextView variant="MobileBody">{t('directDeposit.bankFraudText')}</TextView>
          </TextView>
        </Box>
      </Box>
      <Box mx={gutter} mb={contentMarginBottom}>
        <ClickToCallPhoneNumber phone={t('8008271000.displayText')} />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default DirectDepositScreen

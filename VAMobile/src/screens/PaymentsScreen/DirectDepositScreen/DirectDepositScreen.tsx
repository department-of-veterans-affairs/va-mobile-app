import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { useBankData } from 'api/directDeposit'
import {
  Box,
  ClickToCallPhoneNumber,
  DefaultList,
  DefaultListItemObj,
  ErrorComponent,
  FeatureLandingTemplate,
  LoadingComponent,
  TextLine,
  TextView,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import { PaymentsStackParamList } from '../PaymentsStackScreens'

type DirectDepositScreenProps = StackScreenProps<PaymentsStackParamList, 'DirectDeposit'>

/**
 * Screen for displaying direct deposit information and help numbers
 */
function DirectDepositScreen({ navigation }: DirectDepositScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const ddNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.directDepositBenefits)
  const {
    data: directDepositData,
    isFetching: loading,
    error: useBankDataError,
    refetch: refetchBankData,
  } = useBankData({ enabled: screenContentAllowed('WG_DirectDeposit') && ddNotInDowntime })
  const [bankData, setBankData] = useState(directDepositData?.data.attributes?.paymentAccount)
  const { gutter, contentMarginBottom } = theme.dimensions

  useFocusEffect(
    React.useCallback(() => {
      setBankData(directDepositData?.data.attributes?.paymentAccount)
    }, [directDepositData]),
  )

  const getButtonTextList = (): Array<DefaultListItemObj> => {
    const textLines: Array<TextLine> = [{ text: t('directDeposit.account'), variant: 'MobileBodyBold' }]
    if (bankData) {
      if (bankData.financialInstitutionName) {
        textLines.push({ text: t('dynamicField', { field: bankData.financialInstitutionName }) })
      }

      if (bankData.accountNumber) {
        textLines.push({ text: t('dynamicField', { field: `${bankData.accountNumber}` }) })
      }

      if (bankData.accountType) {
        textLines.push({ text: t('directDeposit.accountType', { accountType: bankData.accountType }) })
      }

      if (
        [bankData.financialInstitutionName, bankData.accountNumber, bankData.accountType].filter(Boolean).length === 0
      ) {
        textLines.push({ text: t('directDeposit.addBankAccountInformation') })
      }
    } else {
      textLines.push({ text: t('directDeposit.addBankAccountInformation') })
    }

    return [
      {
        textLines: textLines,
        a11yHintText: t('directDeposit.addBankAccountInformationHint'),
        onPress: () => {
          navigateTo('EditDirectDeposit', {
            displayTitle: bankData ? t('directDeposit.edit.title') : t('directDeposit.add.title'),
          })
        },
        decoratorProps: { accessibilityRole: 'button' },
      },
    ]
  }

  const hasError = useBankDataError || !ddNotInDowntime

  return (
    <FeatureLandingTemplate
      backLabel={t('payments.title')}
      backLabelOnPress={navigation.goBack}
      title={t('directDeposit.title')}
      testID="DirectDepositEditAccount"
      backLabelTestID="directDepositPageBackID">
      {loading ? (
        <LoadingComponent text={t('directDeposit.loading')} />
      ) : hasError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID}
          error={useBankDataError}
          onTryAgain={refetchBankData}
        />
      ) : (
        <>
          <Box mx={gutter}>
            <TextView
              variant="MobileBody"
              mb={theme.dimensions.standardMarginBetween}
              accessibilityLabel={a11yLabelVA(t('directDeposit.viewAndEditText.a11yLabel'))}>
              {t('directDeposit.viewAndEditText')}
            </TextView>
          </Box>
          <DefaultList items={getButtonTextList()} title={t('directDeposit.information')} />
          <Box mx={gutter} my={theme.paragraphSpacing.spacing20FontSize} accessible={true} accessibilityRole={'text'}>
            <TextView>
              <TextView variant="MobileBodyBold">{t('directDeposit.bankFraudNote') + ' '}</TextView>
              <TextView variant="MobileBody">{t('directDeposit.bankFraudText')}</TextView>
            </TextView>
          </Box>
          <Box mx={gutter} mb={contentMarginBottom}>
            <ClickToCallPhoneNumber phone={displayedTextPhoneNumber(t('8008271000'))} />
          </Box>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default DirectDepositScreen

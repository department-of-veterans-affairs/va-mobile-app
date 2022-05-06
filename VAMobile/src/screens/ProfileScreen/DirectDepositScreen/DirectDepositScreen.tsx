import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, DefaultList, DefaultListItemObj, ErrorComponent, LoadingComponent, TextLine, TextView, VAScrollView } from 'components'
import { DirectDepositState, getBankData } from 'store/slices/directDepositSlice'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDowntime, useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import ProfileBanner from '../ProfileBanner'

/**
 * Screen for displaying direct deposit information and help numbers
 */
const DirectDepositScreen: FC = () => {
  const { paymentAccount: bankData, loading } = useSelector<RootState, DirectDepositState>((state) => state.directDeposit)
  const dispatch = useAppDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
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
        onPress: navigateTo('EditDirectDeposit'),
        decoratorProps: { accessibilityRole: 'button' },
      },
    ]
  }

  if (useError(ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID} />
  }

  if (loading) {
    return (
      <React.Fragment>
        <ProfileBanner />
        <LoadingComponent text={t('directDeposit.loading')} />
      </React.Fragment>
    )
  }

  return (
    <VAScrollView {...testIdProps('Direct-deposit-page')} importantForAccessibility={'no'}>
      <Box accessible={true}>
        <ProfileBanner />
      </Box>
      <Box accessible={true}>
        <Box mx={gutter} mt={contentMarginTop}>
          <TextView variant="MobileBody" {...testIdProps(t('directDeposit.viewAndEditTextA11yLabel'))}>
            {t('directDeposit.viewAndEditText')}
          </TextView>
        </Box>
      </Box>
      <DefaultList items={getButtonTextList()} title={t('directDeposit.information')} />
      <Box accessible={true}>
        <Box mx={gutter} mt={condensedMarginBetween}>
          <TextView>
            <TextView variant="MobileBodyBold">{t('directDeposit.bankFraudNote') + ' '}</TextView>
            <TextView variant="MobileBody">{t('directDeposit.bankFraudText')}</TextView>
          </TextView>
        </Box>
      </Box>
      <Box mx={gutter} mb={contentMarginBottom}>
        <ClickToCallPhoneNumber phone={t('common:8008271000.displayText')} />
      </Box>
    </VAScrollView>
  )
}

export default DirectDepositScreen

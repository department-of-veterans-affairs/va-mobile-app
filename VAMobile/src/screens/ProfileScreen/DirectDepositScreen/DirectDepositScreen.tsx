import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, ClickToCallPhoneNumber, ErrorComponent, List, ListItemObj, LoadingComponent, TextLine, TextView, VAScrollView } from 'components'
import { DirectDepositState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { generateTestID } from 'utils/common'
import { getBankData } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ProfileBanner from '../ProfileBanner'

/**
 * Screen for displaying direct deposit information and help numbers
 */
const DirectDepositScreen: FC = () => {
  const { paymentAccount: bankData, loading } = useSelector<StoreState, DirectDepositState>((state) => state.directDeposit)
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  const { standardMarginBetween, gutter, contentMarginTop, contentMarginBottom, condensedMarginBetween } = theme.dimensions

  useEffect(() => {
    dispatch(getBankData(ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID))
  }, [dispatch])

  const getButtonTextList = (): Array<ListItemObj> => {
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
    return <ErrorComponent />
  }

  if (loading) {
    return (
      <React.Fragment>
        <ProfileBanner />
        <LoadingComponent />
      </React.Fragment>
    )
  }

  return (
    <VAScrollView {...testIdProps('Direct-deposit-page')}>
      <ProfileBanner />
      <Box mx={gutter} mb={standardMarginBetween} mt={contentMarginTop}>
        <TextView variant="MobileBody" {...testIdProps(t('directDeposit.viewAndEditTextA11yLabel'))}>
          {t('directDeposit.viewAndEditText')}
        </TextView>
      </Box>
      <Box ml={gutter}>
        <TextView variant="TableHeaderBold" {...testIdProps(generateTestID(t('directDeposit.information'), ''))}>
          {t('directDeposit.information')}
        </TextView>
      </Box>
      <Box mt={condensedMarginBetween}>
        <List items={getButtonTextList()} />
      </Box>
      <Box mx={gutter} mt={condensedMarginBetween}>
        <TextView variant="MobileBody">{t('directDeposit.bankFraudNote')}</TextView>
      </Box>
      <Box ml={gutter} mt={condensedMarginBetween} mb={contentMarginBottom}>
        <ClickToCallPhoneNumber phone={t('directDeposit.bankFraudHelpNumberDisplayed')} />
      </Box>
    </VAScrollView>
  )
}

export default DirectDepositScreen

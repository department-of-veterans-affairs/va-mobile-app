import { ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, ClickForActionLink, ErrorComponent, LinkTypeOptionsConstants, List, ListItemObj, LoadingComponent, TextLine, TextView } from 'components'
import { DirectDepositState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { getBankData } from 'store/actions'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ProfileBanner from '../ProfileBanner'

export const DIRECT_DEPOSIT_SCREEN_ID = 'DIRECT_DEPOSIT_SCREEN'

/**
 * Screen for displaying direct deposit information and help numbers
 */
const DirectDepositScreen: FC = () => {
  const { paymentAccount: bankData, loading } = useSelector<StoreState, DirectDepositState>((state) => state.directDeposit)
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  const marginBetween = theme.dimensions.marginBetween
  const gutter = theme.dimensions.gutter
  const contentMarginTop = theme.dimensions.contentMarginTop
  const contentMarginBottom = theme.dimensions.contentMarginBottom

  useEffect(() => {
    // TODO: update this call to get real bank data once service is integrated, remove this function and the action/reducer for this if need be
    dispatch(getBankData(DIRECT_DEPOSIT_SCREEN_ID))
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
        textLines.push({ text: t('directDeposit.dynamicField', { field: bankData.accountType }) })
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

  if (useError(DIRECT_DEPOSIT_SCREEN_ID)) {
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
    <ScrollView {...testIdProps('Direct-deposit-screen')}>
      <ProfileBanner />
      <Box mx={gutter} mb={marginBetween} mt={contentMarginTop}>
        <TextView variant="MobileBody" {...testIdProps(t('directDeposit.viewAndEditTextA11yLabel'))}>
          {t('directDeposit.viewAndEditText')}
        </TextView>
      </Box>
      <Box ml={gutter}>
        <TextView variant="TableHeaderBold" {...testIdProps(generateTestID(t('directDeposit.information'), ''))}>
          {t('directDeposit.information')}
        </TextView>
      </Box>
      <Box mt={theme.dimensions.titleHeaderAndElementMargin}>
        <List items={getButtonTextList()} />
      </Box>
      <Box mx={gutter} mt={theme.dimensions.titleHeaderAndElementMargin}>
        <TextView variant="TableFooterLabel">{t('directDeposit.bankFraudNote')}</TextView>
      </Box>
      <Box ml={gutter} mt={marginBetween}>
        <ClickForActionLink
          displayedText={t('directDeposit.bankFraudHelpNumberDisplayed')}
          numberOrUrlLink={t('directDeposit.bankFraudHelpNumber')}
          linkType={LinkTypeOptionsConstants.call}
          {...a11yHintProp(t('directDeposit.clickToCallA11yHint'))}
        />
      </Box>
      <Box ml={gutter} mt={marginBetween}>
        <TextView variant="MobileBody">{t('directDeposit.hearingLoss')}</TextView>
      </Box>
      <Box ml={gutter} mt={marginBetween} mb={contentMarginBottom}>
        <ClickForActionLink
          displayedText={t('directDeposit.hearingLossNumber')}
          numberOrUrlLink={t('directDeposit.hearingLossNumber')}
          linkType={LinkTypeOptionsConstants.call}
          {...a11yHintProp(t('directDeposit.clickToCallA11yHint'))}
        />
      </Box>
    </ScrollView>
  )
}

export default DirectDepositScreen

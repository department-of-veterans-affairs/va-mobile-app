import { ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, ButtonList, ButtonListItemObj, ClickForActionLink, LinkTypeOptionsConstants, TextView, textIDObj } from 'components'
import { DirectDepositState, PersonalInformationState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { getBankData } from 'store/actions'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ProfileBanner from '../ProfileBanner'

/**
 * Screen for displaying direct deposit information and help numbers
 */
const DirectDepositScreen: FC = () => {
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const { paymentAccount: bankData } = useSelector<StoreState, DirectDepositState>((state) => state.directDeposit)
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  const marginBetween = theme.dimensions.marginBetween
  const gutter = theme.dimensions.gutter

  useEffect(() => {
    // TODO: update this call to get real bank data once service is integrated, remove this function and the action/reducer for this if need be
    dispatch(getBankData())
  }, [dispatch])

  const getButtonTextList = (): Array<ButtonListItemObj> => {
    const textIDs: Array<textIDObj> = [{ textID: 'directDeposit.account' }]
    if (bankData) {
      if (bankData.financialInstitutionName) {
        textIDs.push({ textID: 'directDeposit.dynamicField', fieldObj: { field: bankData.financialInstitutionName } })
      }

      if (bankData.accountNumber) {
        textIDs.push({ textID: 'directDeposit.dynamicField', fieldObj: { field: `${bankData.accountNumber}` } })
      }

      if (bankData.accountType) {
        textIDs.push({ textID: 'directDeposit.dynamicField', fieldObj: { field: bankData.accountType } })
      }

      if ([bankData.financialInstitutionName, bankData.accountNumber, bankData.accountType].filter(Boolean).length === 0) {
        textIDs.push({ textID: 'directDeposit.addBankAccountInformation' })
      }
    } else {
      textIDs.push({ textID: 'directDeposit.addBankAccountInformation' })
    }

    return [{ textIDs, a11yHintText: t('directDeposit.addBankAccountInformationHint'), onPress: navigateTo('EditDirectDeposit'), decoratorProps: { accessibilityRole: 'button' } }]
  }

  return (
    <ScrollView {...testIdProps('Direct-deposit-screen')}>
      <ProfileBanner name={profile ? profile.full_name : ''} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
      <Box mx={gutter} my={marginBetween}>
        <TextView variant="MobileBody">{t('directDeposit.viewAndEditText')}</TextView>
      </Box>
      <Box ml={gutter} mt={2}>
        <TextView variant="TableHeaderBold" {...testIdProps(generateTestID(t('directDeposit.information'), ''))}>
          {t('directDeposit.information')}
        </TextView>
      </Box>
      <Box mt={4}>
        <ButtonList items={getButtonTextList()} translationNameSpace="profile" />
      </Box>
      <Box mx={gutter} mt={9}>
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
      <Box ml={gutter} mt={8}>
        <TextView variant="MobileBody">{t('directDeposit.hearingLoss')}</TextView>
      </Box>
      <Box ml={gutter} mt={marginBetween}>
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

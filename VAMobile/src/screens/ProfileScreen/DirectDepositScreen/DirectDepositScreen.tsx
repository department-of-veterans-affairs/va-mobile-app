import { ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { AuthState, DirectDepositState, StoreState } from 'store/reducers'
import { Box, ButtonList, ButtonListItemObj, PhoneLink, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getBankData } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import ProfileBanner from '../ProfileBanner'

/**
 * Screen for displaying direct deposit information and help numbers
 */
const DirectDepositScreen: FC = () => {
	const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)
	const { bankData } = useSelector<StoreState, DirectDepositState>((state) => state.directDeposit)
	const dispatch = useDispatch()
	const { t } = useTranslation(NAMESPACE.PROFILE)

	useEffect(() => {
		// TODO: update this call to get real bank data once service is integrated, remove this function and the action/reducer for this if need be
		dispatch(getBankData())
	}, [])

	const onBankAccountInformation = (): void => {}

	const getButtonTextList = (): Array<ButtonListItemObj> => {
		const textIDs = [t('directDeposit.account')]
		if (bankData) {
			if (bankData.bank_name) {
				textIDs.push(bankData.bank_name)
			}

			if (bankData.bank_account_number) {
				textIDs.push(`******${bankData.bank_account_number}`)
			}

			if (bankData.bank_account_type) {
				textIDs.push(bankData.bank_account_type)
			}

			if ([bankData.bank_name, bankData.bank_account_number, bankData.bank_account_type].filter(Boolean).length === 0) {
				textIDs.push(t('directDeposit.addBankAccountInformation'))
			}
		} else {
			textIDs.push(t('directDeposit.addBankAccountInformation'))
		}

		return [{ textIDs, a11yHintID: t('directDeposit.addBankAccountInformationHint'), onPress: onBankAccountInformation, decoratorProps: { accessibilityRole: 'button' } }]
	}

	return (
		<ScrollView {...testIdProps('Direct-deposit-screen')}>
			<ProfileBanner name={profile ? profile.full_name : ''} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
			<Box m={20}>
				<TextView variant="MobileBody">{t('directDeposit.viewAndEditText')}</TextView>
			</Box>
			<Box ml={20} mt={2}>
				<TextView variant="TableHeaderBold">{t('directDeposit.information')}</TextView>
			</Box>
			<Box mt={4}>
				<ButtonList items={getButtonTextList()} />
			</Box>
			<Box mx={20} mt={9}>
				<TextView>{t('directDeposit.bankFraudNote')}</TextView>
			</Box>
			<Box ml={20} mt={15}>
				<PhoneLink text={t('directDeposit.bankFraudHelpNumber')} accessibilityHint={t('directDeposit.clickToCallA11yHint')} />
			</Box>
			<Box ml={20} mt={8}>
				<TextView variant="MobileBody">{t('directDeposit.hearingLoss')}</TextView>
			</Box>
			<Box ml={20} mt={6}>
				<PhoneLink text={t('directDeposit.hearingLossNumber')} accessibilityHint={t('directDeposit.clickToCallA11yHint')} />
			</Box>
		</ScrollView>
	)
}

export default DirectDepositScreen

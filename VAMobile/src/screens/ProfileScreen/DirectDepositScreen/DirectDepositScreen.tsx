import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { Box, ButtonList, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import ProfileBanner from '../ProfileBanner'

const DirectDepositScreen: FC = () => {
	const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)
	const { t } = useTranslation(NAMESPACE.PROFILE)

	const onBankAccountInformation = (): void => {}

	const getButtonTextList = () => {
		const textIDs = [t('directDeposit.account')]
		if (profile) {
			const { bank_data } = profile

			if (bank_data) {
				if (bank_data.bank_name) {
					textIDs.push(bank_data.bank_name)
				}

				if (bank_data.bank_account_number) {
					textIDs.push(`******${bank_data.bank_account_number}`)
				}

				if (bank_data.bank_account_type) {
					textIDs.push(bank_data.bank_account_type)
				}

				if ([bank_data.bank_name, bank_data.bank_account_number, bank_data.bank_account_type].filter(Boolean).length === 0) {
					textIDs.push(t('directDeposit.addBankAccountInformation'))
				}
			} else {
				textIDs.push(t('directDeposit.addBankAccountInformation'))
			}
		}

		return [{ textIDs, a11yHintID: t('directDeposit.addBackAccountInformationHint'), onPress: onBankAccountInformation }]
	}

	return (
		<ScrollView {...testIdProps('Direct-deposit-screen')}>
			<ProfileBanner name={profile ? profile.full_name : ''} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
			<Box m={20}>
				<TextView variant="MobileBody">{t('directDeposit.viewAndEditText')}</TextView>
			</Box>
			<Box ml={20} mt={2}>
				<TextView variant="MobileHeaderBold">{t('directDeposit.information')}</TextView>
			</Box>
			<Box mt={4}>
				<ButtonList items={getButtonTextList()} />
			</Box>
			<Box mx={20} mt={9}>
				<TextView>{t('directDeposit.bankFraudNote')}</TextView>
			</Box>
			<Box ml={20} mt={25}>
				<TextView variant="MobileBody">{t('directDeposit.hearingLoss')}</TextView>
			</Box>
		</ScrollView>
	)
}

export default DirectDepositScreen

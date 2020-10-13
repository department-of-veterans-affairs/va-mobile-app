import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { Box, ButtonListStyle, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { WideButton } from 'components'
import { testIdProps } from 'utils/accessibility'
import ProfileBanner from '../ProfileBanner'

const DirectDepositScreen: FC = () => {
	const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)
	const { t } = useTranslation(NAMESPACE.PROFILE)

	const onBankAccountInformation = () => {}

	const buttonText = [t('directDeposit.account')]
	if (profile) {
		if (profile.bank_name) {
			buttonText.push(profile.bank_name)
		}

		if (profile.bank_account_number) {
			buttonText.push(profile.bank_account_number)
		}

		if (profile.bank_account_type) {
			buttonText.push(profile.bank_account_type)
		}
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
				<WideButton listOfText={buttonText} a11yHint={''} onPress={onBankAccountInformation} isFirst={true} buttonStyle={ButtonListStyle.BoldHeader} />
			</Box>
			<Box mx={20} mt={9}>
				<TextView>{t('directDeposit.bankFraudNote')}</TextView>
			</Box>

			<TextView variant="MobileBody">{t('directDeposit.hearingLoss')}</TextView>
		</ScrollView>
	)
}

export default DirectDepositScreen

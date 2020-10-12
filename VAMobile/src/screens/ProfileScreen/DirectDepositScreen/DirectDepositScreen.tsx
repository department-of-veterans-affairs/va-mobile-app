import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { Box, ButtonList, ButtonListItemObj, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import ProfileBanner from '../ProfileBanner'

const DirectDepositScreen: FC = () => {
	const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)
	const { t } = useTranslation(NAMESPACE.PROFILE)

	const onBankAccountInformation = () => {}

	const buttonDataList: Array<ButtonListItemObj> = [
		{ textID: 'directDeposit.account', a11yHintID: 'directDeposit.addBackAccountInformationHint', onPress: onBankAccountInformation },
	]

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
				<ButtonList items={buttonDataList} translationNameSpace={NAMESPACE.PROFILE} />
			</Box>
			<Box mx={20}>
				<TextView>{t('directDeposit.bankFraudNote')}</TextView>
			</Box>
		</ScrollView>
	)
}

export default DirectDepositScreen

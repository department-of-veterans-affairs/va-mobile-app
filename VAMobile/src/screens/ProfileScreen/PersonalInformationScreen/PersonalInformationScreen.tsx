import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { TextView } from 'components'
import { useTranslation } from 'utils/hooks'
import ProfileBanner from '../ProfileBanner'

const PersonalInformationScreen: FC = () => {
	const t = useTranslation('profile')
	const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)

	return (
		<ScrollView>
			<ProfileBanner name={profile ? profile.full_name : ''} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
			<TextView variant="MobileBody">{t('personalInformationScreen.editNote')}</TextView>
			<TextView variant="TableHeaderBold">{t('personalInformationScreen.title')}</TextView>
			<TextView variant="TableHeaderBold">{t('personalInformationScreen.addresses')}</TextView>
			<TextView variant="TableHeaderBold">{t('personalInformationScreen.phoneNumbers')}</TextView>
			<TextView variant="TableHeaderBold">{t('personalInformationScreen.contactEmailAddress')}</TextView>
			<TextView variant="TableHeaderLabel">{t('personalInformationScreen.thisIsEmailWeUseToContactNote')}</TextView>
		</ScrollView>
	)
}

export default PersonalInformationScreen

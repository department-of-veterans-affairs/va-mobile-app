import { ScrollView } from 'react-native'
import React, { FC } from 'react'

import { PhoneLink, TextArea, TextView } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'

/**
 * View for Veterans Crisis Line screen
 *
 * Returns VeteransCrisisLineScreen component
 */
const VeteransCrisisLineScreen: FC = () => {
	const t = useTranslation('home')

	return (
		<ScrollView {...testIdProps('Veterans-Crisis-Line-screen')}>
			<TextArea>
				<TextView variant="MobileBodyBold">{t('veteransCrisisLine.weAreHereForYou')}</TextView>
				<TextView variant="MobileBody">{t('veteransCrisisLine.connectWithResponders')}</TextView>
				<PhoneLink text={t('veteransCrisisLine.crisisCallNumber')} />
				<TextView variant="MobileBody">{t('veteransCrisisLine.callTTY')}</TextView>
				<PhoneLink text={t('veteransCrisisLine.hearingLossNumber')} />
				<TextView variant="MobileBodyBold">{t('veteransCrisisLine.getMoreResources')}</TextView>
			</TextArea>
		</ScrollView>
	)
}

export default VeteransCrisisLineScreen

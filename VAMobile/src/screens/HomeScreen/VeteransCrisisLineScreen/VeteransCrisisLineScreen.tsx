import { Linking, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { ClickForActionLink, TextArea, TextView } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'

/**
 * View for Veterans Crisis Line screen
 *
 * Returns VeteransCrisisLineScreen component
 */
const VeteransCrisisLineScreen: FC = () => {
	const t = useTranslation('home')

	const redirectToVeteransCrisisLineLink = () => {
		Linking.openURL(t('veteransCrisisLine.urlLink'))
	}

	return (
		<ScrollView {...testIdProps('Veterans-Crisis-Line-screen')}>
			<TextArea>
				<TextView variant="MobileBodyBold">{t('veteransCrisisLine.weAreHereForYou')}</TextView>
				<TextView variant="MobileBody">{t('veteransCrisisLine.connectWithResponders')}</TextView>
				<ClickForActionLink text={t('veteransCrisisLine.crisisCallNumber')} linkType="call" />
				<ClickForActionLink text={t('veteransCrisisLine.textNumber')} linkType="text" />
				<ClickForActionLink text={t('veteransCrisisLine.startConfidentialChat')} urlLink={'veteransCrisisLine.startConfidentialChatUrl'} linkType="url" />
				<TextView variant="MobileBody">{t('veteransCrisisLine.callTTY')}</TextView>
				<ClickForActionLink text={t('veteransCrisisLine.hearingLossNumber')} linkType="call" />
				<TextView variant="MobileBodyBold">{t('veteransCrisisLine.getMoreResources')}</TextView>
				<TouchableWithoutFeedback onPress={redirectToVeteransCrisisLineLink}>
					<TextView variant="MobileBody" color="link">
						{t('veteransCrisisLine.urlDisplayed')}
					</TextView>
				</TouchableWithoutFeedback>
			</TextArea>
		</ScrollView>
	)
}

export default VeteransCrisisLineScreen

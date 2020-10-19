import { Linking, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { Box, ClickForActionLink, TextArea, TextView } from 'components'
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
				<Box mt={2}>
					<TextView variant="MobileBody">{t('veteransCrisisLine.connectWithResponders')}</TextView>
				</Box>
				<Box mt={2}>
					<ClickForActionLink displayedText={t('veteransCrisisLine.crisisCallNumberDisplayed')} numberOrUrlLink={t('veteransCrisisLine.crisisCallNumber')} linkType="call" />
				</Box>
				<Box mt={14}>
					<ClickForActionLink displayedText={t('veteransCrisisLine.textNumberDisplayed')} numberOrUrlLink={t('veteransCrisisLine.textNumber')} linkType="text" />
				</Box>
				<Box mt={14}>
					<ClickForActionLink displayedText={t('veteransCrisisLine.startConfidentialChat')} numberOrUrlLink={t('veteransCrisisLine.startConfidentialChatUrl')} linkType="url" />
				</Box>
				<Box mt={20}>
					<TextView variant="MobileBody">{t('veteransCrisisLine.callTTY')}</TextView>
				</Box>
				<Box mt={10}>
					<ClickForActionLink displayedText={t('veteransCrisisLine.hearingLossNumberDisplayed')} numberOrUrlLink={t('veteransCrisisLine.hearingLossNumber')} linkType="call" />
				</Box>
				<Box mt={20}>
					<TextView variant="MobileBodyBold">{t('veteransCrisisLine.getMoreResources')}</TextView>
				</Box>
				<Box mt={12}>
					<TouchableWithoutFeedback onPress={redirectToVeteransCrisisLineLink}>
						<TextView variant="MobileBody" color="link">
							{t('veteransCrisisLine.urlDisplayed')}
						</TextView>
					</TouchableWithoutFeedback>
				</Box>
			</TextArea>
		</ScrollView>
	)
}

export default VeteransCrisisLineScreen

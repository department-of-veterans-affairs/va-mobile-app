import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickForActionLink, TextArea, TextView } from 'components'
import { HomeStackParamList } from '../HomeScreen'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import CrisisLineCta from '../CrisisLineCta'

type ContactVAScreenProps = StackScreenProps<HomeStackParamList, 'ContactVA'>

/**
 * View for Contact VA screen
 *
 * Returns ContactVAScreen component
 */
const ContactVAScreen: FC<ContactVAScreenProps> = ({ navigation }) => {
	const { t } = useTranslation(NAMESPACE.HOME)

	const onCrisisLine = (): void => {
		navigation.navigate('VeteransCrisisLine')
	}

	return (
		<Box {...testIdProps('ContactVA-screen')} flex={1}>
			<CrisisLineCta onPress={onCrisisLine} />
			<ScrollView>
				<TextArea>
					<TextView color="primary" variant="MobileBodyBold">
						{t('contactVA.va311')}
					</TextView>
					<TextView color="primary" variant="MobileBody" mt={8} mb={8}>
						{t('contactVA.va311.body')}
					</TextView>
					<ClickForActionLink
						displayedText={t('contactVA.va311.numberDisplayed')}
						numberOrUrlLink={t('contactVA.va311.number')}
						linkType="call"
						{...a11yHintProp(t('contactVA.va311.number.a11yHint'))}
					/>
					<TextView color="primary" variant="MobileBody" mt={8} mb={8}>
						{t('contactVA.tty.body')}
					</TextView>
					<ClickForActionLink
						displayedText={t('contactVA.tty.number')}
						numberOrUrlLink={t('contactVA.tty.number')}
						linkType="call"
						{...a11yHintProp(t('contactVA.tty.number.a11yHint'))}
					/>
				</TextArea>
			</ScrollView>
		</Box>
	)
}

export default ContactVAScreen

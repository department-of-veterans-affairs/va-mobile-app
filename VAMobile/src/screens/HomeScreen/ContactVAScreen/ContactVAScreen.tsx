import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, PhoneLink, TextArea, TextView } from 'components'
import { HomeStackParamList } from '../HomeScreen'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
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
			<ScrollView alwaysBounceHorizontal={false} alwaysBounceVertical={false}>
				<TextArea>
					<TextView color="primary" variant="MobileBodyBold">
						{t('contactVA.va311')}
					</TextView>
					<TextView color="primary" variant="MobileBody" mt={8} mb={8}>
						{t('contactVA.va311.body')}
					</TextView>
					<PhoneLink text={t('contactVA.va311.number')} accessibilityHint={t('contactVA.va311.number.a11yHint')} />
					<TextView color="primary" variant="MobileBody" mt={8} mb={8}>
						{t('contactVA.tty.body')}
					</TextView>
					<PhoneLink text={t('contactVA.tty.number')} accessibilityHint={t('contactVA.tty.number.a11yHint')} />
				</TextArea>
			</ScrollView>
		</Box>
	)
}

export default ContactVAScreen

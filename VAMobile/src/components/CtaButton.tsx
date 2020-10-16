import React, { FC } from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole, TouchableWithoutFeedback } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useTranslation } from 'react-i18next'
import Box from './Box'
import VAIcon from './VAIcon'

const StyledTextContainer = styled.Text`
	color: ${themeFn((theme) => theme.colors.ctaButton.text)};
	${themeFn((theme) => theme.typography.MobileBody)};
	display: flex;
	flex-direction: row;
	margin-right: 4px;
`

const StyledBox = styled(Box)`
	background-color: ${themeFn((theme) => theme.colors.ctaButton.background)};
`

/**
 * CtaButton that shows up on the HomeScreen' and 'Contact VA' option on HomeScreen
 *
 * @returns CtaButton component
 */
const CtaButton: FC = (props) => {
	const { t } = useTranslation()
	const wrapperProps = { ...props }
	delete wrapperProps.children

	type TouchableProps = {
		accessibilityRole: AccessibilityRole
		accessible: boolean
		accessibilityHint: string
	}

	const touchableProps: TouchableProps = {
		accessibilityRole: 'button',
		accessible: true,
		accessibilityHint: t('home:component.crisisLine.hint'),
	}

	return (
		<TouchableWithoutFeedback {...wrapperProps} {...touchableProps} {...testIdProps('crisis-line-button')}>
			<StyledBox flexDirection="row" justifyContent="center" alignItems="center" width="100%" minHeight={44} mb={20} paddingVertical={12} paddingHorizontal={10}>
				<StyledTextContainer>{props.children}</StyledTextContainer>
				<VAIcon name="ArrowRight" fill="#FFF" width={10} height={15} />
			</StyledBox>
		</TouchableWithoutFeedback>
	)
}

export default CtaButton

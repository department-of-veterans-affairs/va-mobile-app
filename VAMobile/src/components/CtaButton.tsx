import React, { FC } from 'react'
import styled from 'styled-components/native'

import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useTranslation } from 'react-i18next'
import VAIcon from './VAIcon'

const StyledTextContainer = styled.Text`
	color: ${themeFn((theme) => theme.colors.ctaButton.text)};
	${themeFn((theme) => theme.typography.MobileBody)};
	display: flex;
	flex-direction: row;
	margin-right: 4px;
`

const StyledView = styled.View`
	width: 100%;
	min-height: 44px;
	padding-vertical: 12px;
	padding-horizontal: 10px;
	background-color: ${themeFn((theme) => theme.colors.ctaButton.background)};
	margin-bottom: 20px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
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
	return (
		<StyledView {...wrapperProps} {...testIdProps('crisis-line-button')} accessibilityRole={'button'} accessible={true} accessibilityHint={t('home:component.crisisLine.hint')}>
			<StyledTextContainer>{props.children}</StyledTextContainer>
			<VAIcon name="ArrowRight" fill="#FFF" width={10} height={15} />
		</StyledView>
	)
}

export default CtaButton

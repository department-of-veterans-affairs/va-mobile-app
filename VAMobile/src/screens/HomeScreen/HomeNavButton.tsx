import React, { FC } from 'react'
import styled from 'styled-components/native'

import { ViewFlexRowSpaceBetween } from 'styles/common'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import VAIcon from 'components/VAIcon'

const Title = styled.Text`
	${themeFn((theme) => theme.typography.h3)}
	color: ${themeFn((theme) => theme.text.titleBar)};
	margin-bottom: 10px;
`

const SubText = styled.Text`
	${themeFn((theme) => theme.fontFace.regular)}
	color: ${themeFn((theme) => theme.text.titleBar)};
`

const StyledView = styled(ViewFlexRowSpaceBetween)`
	width: 100%;
	min-height: 81px;
	border-radius: 6px;
	padding-top: 12px;
	padding-bottom: 15px;
	padding-left: 10px;
	padding-right: 14px;
	margin-bottom: 15px;
	background-color: ${themeFn((theme) => theme.white)};
`

const ContentView = styled.View`
	flex: 1;
`

interface HomeNavButtonProps {
	title: string
	subText: string
	a11yHint: string
	onPress: () => void
}

/**
 * Reusable menu item for the HomeScreen
 *
 * @param title - string for header and used to create testID for accessibility
 * @param subText - string secondary text that seats on the second row
 * @param onPress - function to be called when press occurs
 * @param a11yHint - string for accessibility hint
 *
 * @returns HomeNavButton component
 */
const HomeNavButton: FC<HomeNavButtonProps> = ({ title, subText, a11yHint, onPress }: HomeNavButtonProps) => {
	const _onPress = (): void => {
		onPress()
	}

	const testId = generateTestID(title, 'home-nav-button')

	return (
		<StyledView onPress={_onPress} {...testIdProps(testId)} accessible={true} accessibilityRole={'menuitem'} accessibilityHint={a11yHint}>
			<ContentView>
				<Title {...testIdProps(testId + '-title')}>{title}</Title>
				<SubText {...testIdProps(testId + '-subtext')}>{subText}</SubText>
			</ContentView>
			<VAIcon name="ArrowRight" fill="#0071BC" width={10} height={15} />
		</StyledView>
	)
}

export default HomeNavButton

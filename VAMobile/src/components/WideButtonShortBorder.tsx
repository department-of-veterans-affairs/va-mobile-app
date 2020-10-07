import React, { FC } from 'react'
import styled from 'styled-components/native'

import GreyArrow from 'images/right-arrow_grey.svg'

import { StyledSourceRegularText, ViewFlexRowSpaceBetween } from 'styles/common'
import { ThemeType } from 'styles/theme'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'

const StyledText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.textColor};
	font-size: 17px;
	line-height: 26px;
	width: 100%;
`

type StyledViewProps = {
    isFirst: boolean
}

const StyledView = styled(ViewFlexRowSpaceBetween)<StyledViewProps>`
	width: 100%;
	min-height: 44px;
	padding-vertical: 10px;
	padding-horizontal: 20px;
	background-color: ${(props: ThemeType): string => props.theme.white};
	border-color: ${(props: ThemeType): string => props.theme.gray};
	border-style: solid;
	border-top-width: ${(props: StyledViewProps): string => (props.isFirst ? '1px' : '0px')};
	position: relative;
	margin: 0;
`

const StyledBorder = styled.View`
    position: absolute;
    border-bottom-width: 1px;
    border-color: ${(props: ThemeType): string => props.theme.gray};
    border-style: solid;
    bottom: 0;
    right: 0;
    width: 105%;
    text-align: left;
`

export type WideButtonShortBorderProps =  {
    title: string
    a11yHint: string
    onPress: () => void
    isFirst?: boolean
}

export const WideButtonShortBorder: FC<WideButtonShortBorderProps> = ({ title, onPress, a11yHint, isFirst = false }: WideButtonShortBorderProps) => {
    const _onPress = (): void => {
        onPress()
    }

    const testId = generateTestID(title, 'wide-button-short-border')

    return (
        <StyledView onPress={_onPress} {...testIdProps(testId)} accessible={true} accessibilityRole={'menuitem'} accessibilityHint={a11yHint} isFirst={isFirst}>
            <StyledBorder/>
            <StyledText>{title}</StyledText>
            <GreyArrow width={11} height={16} />
        </StyledView>
    )
}

export default WideButtonShortBorder

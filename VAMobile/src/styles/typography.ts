import styled from 'styled-components/native'
import theme from './theme'
/**
 *
 * This file contains the base text components that should be used inside the application. These styles should map to
 * the style of text called for in the design prototype. If one of these needs to be altered you can override the base
 * style in the component needing the altered style in this way https://styled-components.com/docs/basics#extending-styles
 */

export const BitterBoldHeading = styled.Text`
	font-family: 'Bitter-Bold';
	font-size: 20px;
	line-height: 26px;
	color: ${theme.primaryBlack};
`

export const MobileBody = styled.Text`
	font-family: 'SourceSansPro-Regular';
	font-size: 17px;
	line-height: 26px;
	color: ${theme.primaryBlack};
`

export const MobileBodyBold = styled.Text`
	font-family: 'SourceSansPro-Bold';
	font-size: 17px;
	line-height: 26px;
	color: ${theme.primaryBlack};
`

export const MobileBodyLink = styled.Text`
	font-family: 'SourceSansPro-Bold';
	font-size: 17px;
	line-height: 26px;
	color: ${theme.primaryBlack};
	style: underline;
`

export const TableHeaderLabel = styled.Text`
    font: Source Sans Pro Bold
    font-size: 14px
    line-height: 18px
    color: ${theme.primaryBlack}
`

export const TableFooterLabel = styled.Text`
    font: Source Sans Pro Regular
    font-size: 14px
    line-height: 18px
    color: ${theme.primaryBlack}
`

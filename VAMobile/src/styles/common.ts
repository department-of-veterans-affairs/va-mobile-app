import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'
import styled from 'styled-components/native'

import theme from 'styles/theme'

export const ViewFlexRowSpaceBetween = styled.TouchableOpacity`
	justify-content: space-between;
	flex-direction: row;
	align-items: center;
`

export const StyledBitterBoldText = styled.Text`
	font-family: 'Bitter-Bold';
`

export const StyledSourceRegularText = styled.Text`
	font-family: 'SourceSansPro-Regular';
`

export const StyledSourceBoldText = styled.Text`
	font-family: 'SourceSansPro-Bold';
`

export const headerStyles: StackNavigationOptions = {
	headerStyle: {
		backgroundColor: theme.activeBlue,
	},
	headerTintColor: theme.white,
	headerTitleStyle: {
		alignSelf: 'center',
		fontSize: 15,
		lineHeight: 20,
		letterSpacing: -0.2,
	},
	headerTitleAllowFontScaling: false,
	headerBackAllowFontScaling: false,
}

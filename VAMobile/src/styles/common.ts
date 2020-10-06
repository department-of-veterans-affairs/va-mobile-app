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
		height: 64,
	},
	headerTintColor: theme.white,
	headerTitleStyle: {
		fontSize: 20,
		letterSpacing: -0.2,
		flex: 1,
		textAlignVertical: 'center',
	},
	headerTitleAllowFontScaling: false,
	headerBackAllowFontScaling: false,
	headerBackTitleVisible: true,
	headerTitleAlign: 'center',
	headerTitleContainerStyle: {
		height: 64,
	},
}

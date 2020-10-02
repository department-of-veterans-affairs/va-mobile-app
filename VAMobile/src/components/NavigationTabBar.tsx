import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import { SafeAreaView, TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import Appointments_Selected from 'images/navIcon/appointments_selected.svg'
import Appointments_Unselected from 'images/navIcon/appointments_unselected.svg'
import Claims_Selected from 'images/navIcon/claims_selected.svg'
import Claims_Unselected from 'images/navIcon/claims_unselected.svg'
import Home_Selected from 'images/navIcon/home_selected.svg'
import Home_Unselected from 'images/navIcon/home_unselected.svg'
import Profile_Selected from 'images/navIcon/profile_selected.svg'
import Profile_Unselected from 'images/navIcon/profile_unselected.svg'
import styled from 'styled-components/native'
import theme from 'styles/theme'

const StyledOuterView = styled.View`
     flex-direction: row
     height: 50px
     border-top-color: ${theme.gray}
     border-top-width: 1px
`

const StyledButtonView = styled.View`
    flex: 1
    display: flex
    flexDirection: column
    margin-top: 7px
`

const StyledIcon = styled.View`
	align-self: center
	position: absolute
`

type StyledLabelProps = {
	isFocused: boolean
}

const StyledLabel = styled.Text`
	color: ${(props: StyledLabelProps): string => (props.isFocused ? theme.activeBlue : theme.inactiveBlue)}
	align-self: center
	margin-top: 23px
`

type TabBarRoute = {
	key: string
	name: string
}

type TabBarProps = {
	state: TabNavigationState
	navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>
	tabBarVisible: boolean
}

const NavigationTabBar: FC<TabBarProps> = ({ state, navigation, tabBarVisible }: TabBarProps) => {
	if (!tabBarVisible) {
		return null
	}

	const onPress = (route: TabBarRoute, isFocused: boolean): void => {
		const event = navigation.emit({
			type: 'tabPress',
			target: route.key,
			canPreventDefault: true,
		})

		if (!isFocused && !event.defaultPrevented) {
			navigation.navigate(route.name)
		}
	}

	const onLongPress = (route: TabBarRoute): void => {
		navigation.emit({
			type: 'tabLongPress',
			target: route.key,
		})
	}

	const tabBarIcon = (route: TabBarRoute, focused: boolean): React.ReactNode => {
		switch (route.name) {
			case 'Appointments':
				return focused ? <Appointments_Selected /> : <Appointments_Unselected />
			case 'Claims':
				return focused ? <Claims_Selected /> : <Claims_Unselected />
			case 'Profile':
				return focused ? <Profile_Selected /> : <Profile_Unselected />
			case 'Home':
				return focused ? <Home_Selected /> : <Home_Unselected />
			default:
				return ''
		}
	}

	return (
		<SafeAreaView>
			<StyledOuterView accessibilityRole="toolbar" accessible={true}>
				{state.routes.map((route, index) => {
					const isFocused = state.index === index

					return (
						<TouchableWithoutFeedback key={route.name} onPress={(): void => onPress(route as TabBarRoute, isFocused)} onLongPress={(): void => onLongPress(route as TabBarRoute)}>
							<StyledButtonView
								accessibilityRole="imagebutton"
								accessibilityState={isFocused ? { selected: true } : { selected: false }}
								accessibilityLabel={route.name}
								testID={route.name}
								accessible={true}>
								<StyledIcon>{tabBarIcon(route as TabBarRoute, isFocused)}</StyledIcon>
								<StyledLabel isFocused={isFocused}>{route.name}</StyledLabel>
							</StyledButtonView>
						</TouchableWithoutFeedback>
					)
				})}
			</StyledOuterView>
		</SafeAreaView>
	)
}

export default NavigationTabBar

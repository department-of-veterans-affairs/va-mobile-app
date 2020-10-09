import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TFunction } from 'i18next'
import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { testIdProps } from 'utils/accessibility'
import VAIcon, { VA_ICON_TYPES } from './VAIcon'
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
	margin-top: 30px
	font-size: 10px
	line-height: 12px
	letter-spacing: -0.2px
`

type TabBarRoute = {
	key: string
	name: string
}

/**
 *  Signifies the props that need to be passed in to {@link NavigationTabBar}
 *  state - the tab navigators current state
 *  navigation - the tab navigators navigation helpers
 *  tabBarVisible - a boolean indicating if the tab bar should be shown or hidden
 *  translation - useTranslations t function to translate the labels
 */
export type TabBarProps = {
	state: TabNavigationState
	navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>
	tabBarVisible: boolean
	translation: TFunction
}

const NavigationTabBar: FC<TabBarProps> = ({ state, navigation, tabBarVisible, translation }) => {
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
				return focused ? (
					<VAIcon name={VA_ICON_TYPES.AppointmentsActive} id={'appointmentsSelected'} />
				) : (
					<VAIcon name={VA_ICON_TYPES.AppointmentsInactive} id={'appointmentsUnselected'} />
				)
			case 'Claims':
				return focused ? <VAIcon name={VA_ICON_TYPES.ClaimsActive} id={'claimsSelected'} /> : <VAIcon name={VA_ICON_TYPES.ClaimsInactive} id={'claimsUnselected'} />
			case 'Profile':
				return focused ? <VAIcon name={VA_ICON_TYPES.ProfileActive} id={'profileSelected'} /> : <VAIcon name={VA_ICON_TYPES.ProfileActive} id={'profileUnselected'} />
			case 'Home':
				return focused ? <VAIcon name={VA_ICON_TYPES.HomeActive} id={'homeSelected'} /> : <VAIcon name={VA_ICON_TYPES.HomeInactive} id={'homeUnselected'} />
			default:
				return ''
		}
	}

	return (
		<SafeAreaView edges={['bottom']}>
			<StyledOuterView accessibilityRole="toolbar" accessible={true}>
				{state.routes.map((route, index) => {
					const isFocused = state.index === index
					const translatedName = translation(`${route.name.toLowerCase()}:title`)

					return (
						<TouchableWithoutFeedback key={route.name} onPress={(): void => onPress(route as TabBarRoute, isFocused)} onLongPress={(): void => onLongPress(route as TabBarRoute)}>
							<StyledButtonView
								accessibilityRole="imagebutton"
								accessibilityState={isFocused ? { selected: true } : { selected: false }}
								{...testIdProps(translatedName)}
								accessible={true}>
								<StyledIcon>{tabBarIcon(route as TabBarRoute, isFocused)}</StyledIcon>
								<StyledLabel allowFontScaling={false} isFocused={isFocused}>
									{translatedName}
								</StyledLabel>
							</StyledButtonView>
						</TouchableWithoutFeedback>
					)
				})}
			</StyledOuterView>
		</SafeAreaView>
	)
}

export default NavigationTabBar

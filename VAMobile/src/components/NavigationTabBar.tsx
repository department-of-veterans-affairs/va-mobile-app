import { AccessibilityRole, AccessibilityState, TouchableWithoutFeedback } from 'react-native'
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TFunction } from 'i18next'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import VAIcon from './VAIcon'

const StyledOuterView = styled.View`
     flex-direction: row
     height: 50px
     border-top-color: ${themeFn((theme) => theme.colors.border)}
     border-top-width: ${themeFn((theme) => theme.dimensions.borderWidth)};
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
	color: ${themeFn<StyledLabelProps>((theme, props) => (props.isFocused ? theme.colors.icon.active : theme.colors.icon.inactive))}
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
		const transparent = 'none'
		switch (route.name) {
			case 'Appointments':
			case 'Claims':
			case 'Profile':
			case 'Home':
				const iconProps = {
					id: `${route.name.toLowerCase()}${focused ? 'Selected' : 'Unselected'}`,
					name: route.name,
					stroke: focused ? transparent : 'inactive',
					fill: focused ? 'active' : transparent,
				}
				return <VAIcon {...iconProps} />
			default:
				return ''
		}
	}

	return (
		<SafeAreaView edges={['bottom']}>
			<StyledOuterView accessibilityRole="toolbar">
				{state.routes.map((route, index) => {
					const isFocused = state.index === index
					const translatedName = translation(`${route.name.toLowerCase()}:title`)

					type TouchableProps = {
						key: string
						onPress: () => void
						onLongPress: () => void
						accessibilityRole: AccessibilityRole
						accessibilityState: AccessibilityState
						accessible: boolean
					}

					const props: TouchableProps = {
						key: route.name,
						onPress: (): void => onPress(route as TabBarRoute, isFocused),
						onLongPress: (): void => onLongPress(route as TabBarRoute),
						accessibilityRole: 'imagebutton',
						accessibilityState: isFocused ? { selected: true } : { selected: false },
						accessible: true,
					}

					return (
						<TouchableWithoutFeedback {...testIdProps(translatedName + '-nav-option')} {...props}>
							<StyledButtonView>
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

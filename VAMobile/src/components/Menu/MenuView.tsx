import { Dimensions, Pressable, StyleProp, View, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { FC, useEffect, useRef } from 'react'

import { Menu, Position } from './Menu'
import { MenuDivider } from './MenuDivider'
import { MenuItem } from './MenuItem'
import { VAIconColors, VATextColors } from 'styles/theme'
import { isIOS } from 'utils/platform'
import TextView from 'components/TextView'
import VAIcon, { VA_ICON_MAP } from 'components/VAIcon'

interface ElementToStickProps {
  /** styles the element which the popup anchor to */
  style?: StyleProp<ViewStyle>
}
const ElementToStick = React.forwardRef<View, ElementToStickProps>(({ style }, ref) => {
  return <View ref={ref} style={style} collapsable={false} />
})

// the actions type.
export type MenuItemActionsType = {
  /** text for the action */
  actionText: string
  /** adds a divider after the action*/
  addDivider: boolean
  /** name of the icon to show */
  iconName?: keyof typeof VA_ICON_MAP
  /** method to  */
  onPress?: () => void
  iconColor?: keyof VAIconColors
  textColor?: keyof VATextColors
}

export type MenuViewActionsType = Array<MenuItemActionsType>

export type MenuViewProps = {
  /** actions to show in the popup menu */
  actions: MenuViewActionsType
}

/**
 * Common popup menu component. This component will allow a user to see multiple actions inside a menu
 */
const MenuView: FC<MenuViewProps> = ({ actions }) => {
  const elementRef = useRef<View>(null)
  let menuRef: Menu | null = null
  const setMenuRef: (instance: Menu | null) => void = (ref) => (menuRef = ref)

  const hideMenu = () => menuRef?.hide()

  const showMenu = () => {
    menuRef?.show(elementRef.current, Position.BOTTOM_LEFT, { left: -55, top: isIOS() ? -10 : -5 })
  }

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => {
      hideMenu()
    })

    return () => {
      sub.remove()
    }
  })

  const elementToStickStyle: StyleProp<ViewStyle> = {
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
  }

  const launchBtnStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    height: 47,
    width: 47,
    alignItems: 'center',
    justifyContent: 'center',
  }

  const mainContainerStyle: StyleProp<ViewStyle> = {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 10,
    flex: 1,
  }

  const menuStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
  }

  // gets the action passed down to the menu and creates the menu actions
  const getActionsForMenu = () => {
    return actions.map((item, index) => {
      const onPressMenu = () => {
        hideMenu()
        if (item.onPress) {
          item.onPress()
        }
      }
      return (
        <View key={index}>
          <View accessibilityLabel={item.actionText} accessibilityRole={'button'}>
            <MenuItem onPress={onPressMenu} viewStyle={menuStyle}>
              {item.iconName && <VAIcon name={item.iconName} fill={item.iconColor ? item.iconColor : 'dark'} height={24} width={24} />}
              <TextView ml={10} color={item.textColor ? item.textColor : undefined}>
                {item.actionText}
              </TextView>
            </MenuItem>
          </View>
          {item.addDivider && <MenuDivider />}
        </View>
      )
    })
  }

  return (
    <>
      <SafeAreaView edges={['bottom', 'left', 'right', 'top']} style={mainContainerStyle}>
        <ElementToStick ref={elementRef} style={elementToStickStyle} />
        <Pressable onPress={showMenu} style={launchBtnStyle} accessibilityLabel={'menu'} accessibilityRole={'button'}>
          <VAIcon name="EllipsisSolid" fill={'white'} height={18} width={18} />
        </Pressable>

        <Menu ref={setMenuRef}>{getActionsForMenu()}</Menu>
      </SafeAreaView>
    </>
  )
}

export default MenuView

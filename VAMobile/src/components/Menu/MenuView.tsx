import { Dimensions, Pressable, StyleProp, View, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useRef } from 'react'

import { Menu, Position } from './Menu'
import { MenuDivider } from './MenuDivider'
import { MenuItem } from './MenuItem'
import { NAMESPACE } from 'constants/namespaces'
import { VAIconColors, VATextColors } from 'styles/theme'
import { isIOS } from 'utils/platform'
import { useTheme } from 'utils/hooks'
import TextView from 'components/TextView'
import VAIcon, { VA_ICON_MAP } from 'components/VAIcon'
import VAIconWithText from 'components/VAIconWithText'

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
  /** color for the menu icon */
  iconColor?: keyof VAIconColors
  /** color for the menu text */
  textColor?: keyof VATextColors
  /** action accessibility label */
  accessibilityLabel?: string
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
  const { t } = useTranslation(NAMESPACE.COMMON)
  const elementRef = useRef<View>(null)
  let menuRef: Menu | null = null
  const setMenuRef: (instance: Menu | null) => void = (ref) => (menuRef = ref)

  const currentTheme = useTheme()

  const hideMenu = () => menuRef?.hide()

  const showMenu = () => {
    // negative values are to position the menu from the right edge and move the it up a little. The two different values for platform is that android shows higher than IOS
    menuRef?.show(elementRef.current, Position.BOTTOM_LEFT, { left: -55, top: isIOS() ? -10 : -5 })
  }

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => {
      hideMenu()
    })

    return () => {
      sub?.remove()
    }
  })

  const elementToStickStyle: StyleProp<ViewStyle> = {
    padding: currentTheme.dimensions.buttonPadding,
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

  const menuStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
  }

  // gets the action passed down to the menu and creates the menu actions
  const getActionsForMenu = () => {
    return actions.map((item, index) => {
      const { iconName, actionText, accessibilityLabel, iconColor, textColor } = item
      const onPressMenu = () => {
        hideMenu()

        //Timeout needs to be added so that the actionsheet does not close when the popup menu does.
        const timeoutInMS = isIOS() ? 350 : 0
        setTimeout(() => {
          if (item.onPress) {
            item.onPress()
          }
        }, timeoutInMS)
      }

      return (
        <View key={index}>
          <View>
            <MenuItem onPress={onPressMenu} viewStyle={menuStyle} underlayColor={currentTheme.colors.buttonBackground.overFlowMenuButton} accessibilityLabel={accessibilityLabel}>
              {iconName && <VAIcon name={iconName} fill={iconColor ? iconColor : 'defaultMenuItem'} height={24} width={24} />}
              <TextView variant={'MobileBody'} ml={10} color={textColor ? textColor : undefined} accessible={false}>
                {actionText}
              </TextView>
            </MenuItem>
          </View>
          {item.addDivider && <MenuDivider color={currentTheme.colors.border.menuDivider} />}
        </View>
      )
    })
  }

  return (
    <>
      <ElementToStick ref={elementRef} style={elementToStickStyle} />
      <Pressable onPress={showMenu} style={launchBtnStyle} accessibilityLabel={'menu'} accessibilityRole={'button'}>
        <VAIconWithText name="Ellipsis" label={t('more')} />
      </Pressable>

      <Menu ref={setMenuRef} style={{ backgroundColor: currentTheme.colors.background.menu }}>
        {getActionsForMenu()}
      </Menu>
    </>
  )
}

export default MenuView

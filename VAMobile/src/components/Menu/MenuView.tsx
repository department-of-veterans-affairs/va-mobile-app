import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native'
import React, { FC, useRef } from 'react'

import { MenuDivider } from './MenuDivider'
import { MenuItemView } from './MenuItem'
import Menu, { Position, ShowBtnType } from './Menu'
import VAIcon, { VA_ICON_MAP } from 'components/VAIcon'

interface ElementToStickProps {
  style?: StyleProp<ViewStyle>
}

// element where the popup will anchor to
const ElementToStick = React.forwardRef<View, ElementToStickProps>(({ style }, ref) => {
  return <View ref={ref} style={style} collapsable={false} />
})

// the actions type.
export type MenuItemActionsType = {
  actionText: string
  addDivider: boolean
  iconName?: keyof typeof VA_ICON_MAP
  onPress?: () => void
}

// array of menu items actions type
export type MenuViewActionsType = Array<MenuItemActionsType>

export type MenuViewProps = {
  actions: MenuViewActionsType
}

const MenuView: FC<MenuViewProps> = ({ actions }) => {
  const elementRef = useRef<View>(null)
  const showButtonRef = useRef<ShowBtnType>()
  const hideButtonRef = useRef<() => void>()

  const mainContainerStyle: StyleProp<ViewStyle> = {
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 10,
    flex: 1,
  }

  const elementToStickStyle: StyleProp<ViewStyle> = {
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
  }

  const launchBtnStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
  }

  const menuStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  }

  const hideMenu = () => {
    if (hideButtonRef.current) {
      hideButtonRef.current()
    }
  }

  const showMenu = () => {
    if (showButtonRef.current) {
      showButtonRef.current(elementRef.current, Position.TOP_CENTER)
    }
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
          <MenuItemView onPress={onPressMenu} viewStyle={menuStyle} focusOnButton={index === 0 ? true : false}>
            <Text>{item.actionText}</Text>
            {item.iconName && <VAIcon name={item.iconName} fill={'black'} height={16} width={16} />}
          </MenuItemView>
          {item.addDivider && <MenuDivider />}
        </View>
      )
    })
  }

  return (
    <View style={mainContainerStyle}>
      <ElementToStick ref={elementRef} style={elementToStickStyle} />
      <Pressable onPress={showMenu} style={launchBtnStyle} accessibilityLabel={'open context menu'}>
        <VAIcon name="EllipsisSolid" fill={'white'} height={35} width={35} />
      </Pressable>

      <Menu show={showButtonRef} hide={hideButtonRef}>
        {getActionsForMenu()}
      </Menu>
    </View>
  )
}

export default MenuView

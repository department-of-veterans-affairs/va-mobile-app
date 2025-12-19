import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, PressableProps, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Box, BoxProps, DefaultList, DefaultListItemObj, TextView, TextViewProps, VAScrollView } from 'components'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

type HeaderButtonProps = {
  text: string
  onPress: () => void
  a11yLabel?: string
  testID?: string
}

type VAModalListProps = {
  showModal: boolean
  setShowModal: (val: boolean) => void
  listItems: Array<DefaultListItemObj>
  title?: string
  leftButton?: HeaderButtonProps
  rightButton?: HeaderButtonProps
}

/**A common component to display a picker for the device with an optional label*/
const VAModalList: FC<VAModalListProps> = ({ showModal, setShowModal, listItems, title, leftButton, rightButton }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  const actionsBarBoxProps: BoxProps = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'pickerControls',
    minHeight: theme.dimensions.touchableMinHeight,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
    ml: insets.left,
    mr: insets.right,
  }

  const topPadding = insets.top + 60
  const cancelLabel = t('cancel')

  const cancelButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: cancelLabel,
    ...a11yHintProp(t('cancel.picker.a11yHint')),
  }

  const commonButtonProps: TextViewProps = {
    variant: 'MobileBody',
    color: 'link',
    allowFontScaling: false,
    py: 3,
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={showModal}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setShowModal(!showModal)
        }}>
        <Box flex={1} flexDirection="column" accessibilityViewIsModal={true}>
          <Box flexGrow={1} backgroundColor="modalOverlay" opacity={0.8} pt={topPadding} />
          <Box backgroundColor="list" pb={insets.bottom} flexShrink={1}>
            <Box {...actionsBarBoxProps}>
              <Box flex={1} alignItems="flex-start">
                {leftButton && (
                  <Pressable onPress={leftButton.onPress} {...cancelButtonProps}>
                    <TextView {...commonButtonProps}>{leftButton.text}</TextView>
                  </Pressable>
                )}
              </Box>
              <Box flex={1} alignItems={'center'}>
                <TextView variant="MobileBodyBold" textAlign={'center'} allowFontScaling={false}>
                  {title}
                </TextView>
              </Box>
              <Box flex={1} alignItems={'flex-end'}>
                {rightButton && (
                  <Pressable onPress={rightButton.onPress} {...cancelButtonProps}>
                    <TextView {...commonButtonProps}>{rightButton.text}</TextView>
                  </Pressable>
                )}
              </Box>
            </Box>
            <VAScrollView bounces={false}>
              <DefaultList items={listItems} />
            </VAScrollView>
          </Box>
        </Box>
      </Modal>
    </View>
  )
}

export default VAModalList

import React, { FC, useState } from 'react'

import { Alert, Modal, Pressable, PressableProps, TextInput, TextInputProps, View } from 'react-native'
import { Box, TextView } from 'components'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'utils/hooks'
import getEnv from 'utils/env'
const { DEMO_PASSWORD } = getEnv()

export type AlertPromptProps = {
  /** Boolean to show or hide the modal */
  visible: boolean
  /** Function to set modal visibility */
  setVisible: (value: boolean) => void
  /** Function to be called when user confirms input*/
  onConfirm: () => void
}

/**
 * Prompt to unlock demo mode for App. Used for Android as IOS already has `Alert.prompt`
 */
const AndroidDemoAlert: FC<AlertPromptProps> = ({ visible, setVisible, onConfirm }) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const [input, setInput] = useState('')

  const onCancel = () => {
    setVisible(false)
  }

  const onDemo = () => {
    setVisible(false)
    setInput('')
    if (input === DEMO_PASSWORD) {
      onConfirm()
    } else {
      Alert.alert('Invalid Code', 'Try Again')
    }
  }

  const cancelButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    onPress: onCancel,
  }

  const demoButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    onPress: onDemo,
  }

  const inputProps: TextInputProps = {
    value: input,
    onChangeText: setInput,
    keyboardType: 'default',
    autoFocus: true,
    style: { fontSize: 20 },
  }

  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={visible} supportedOrientations={['portrait', 'landscape']} onRequestClose={onCancel}>
        <Box flex={1} width={'100%'} flexDirection="column" accessibilityViewIsModal={true} justifyContent={'center'}>
          <Box width={'100%'} height={'100%'} backgroundColor="modalOverlay" opacity={0.8} position={'absolute'} />
          <Box backgroundColor={'cardBackground'} borderRadius={3} p={20} ml={insets.left} mr={insets.right} mx={theme.dimensions.gutter}>
            <Box alignItems={'flex-start'}>
              <TextView variant="MobileBodyBold" textAlign={'center'} allowFontScaling={false}>
                {'Enter Password'}
              </TextView>
              <TextView variant="MobileBody" textAlign={'center'} allowFontScaling={false}>
                {'Please enter the demo mode password'}
              </TextView>
            </Box>
            <Box borderBottomColor={'secondary'} borderBottomWidth={2} my={theme.dimensions.standardMarginBetween}>
              <TextInput {...inputProps} />
            </Box>
            <Box flexDirection={'row'} justifyContent={'flex-end'}>
              <Box mr={theme.dimensions.standardMarginBetween}>
                <Pressable {...cancelButtonProps}>
                  <TextView allowFontScaling={false} variant="MobileBody" textTransform="uppercase" color="buttonSecondary">
                    {'Cancel'}
                  </TextView>
                </Pressable>
              </Box>
              <Pressable {...demoButtonProps}>
                <TextView allowFontScaling={false} variant="MobileBody" textTransform="uppercase" color="buttonSecondary">
                  {'Demo'}
                </TextView>
              </Pressable>
            </Box>
          </Box>
        </Box>
      </Modal>
    </View>
  )
}

export default AndroidDemoAlert

import { Modal, Pressable, PressableProps, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { Box, BoxProps, FooterButton, RadioGroup, TextView, TextViewProps, VAScrollView, radioOption } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

export type RadioPickerGroup = {
  /** Optional title appearing over the radio grouping, used if there are multiple groups in one modal */
  title?: string
  /** Radio options to display */
  items: Array<radioOption<string>>
  /** Callback when the option is set */
  onSetOption: (toSet: string) => void
  /** Current value of the group */
  selectedValue?: string
}

export type RadioGroupModalProps = {
  /** Array of groups to display in the modal */
  groups: Array<RadioPickerGroup>
  /** Callback for when the input is confirmed */
  onConfirm: () => void
  /** Callback when the upper right button is pressed */
  onUpperRightAction: () => void
  /** Callback for cancelling the interaction */
  onCancel: () => void
  /** Header text within the modal */
  headerText: string
  /** Text to appear on the button that launches the modal */
  buttonText: string
  /** Accessibility label for the button that launches the modal */
  buttonA11yLabel?: string
  /** Accessibility hint for the button that launches the modal */
  buttonA11yHint?: string
  /** Optional TestID for the button  */
  buttonTestID?: string
  /** Text for the button in the upper right of the modal */
  topRightButtonText: string
  /** Accessibility hint for the button in the upper right */
  topRightButtonA11yHint?: string
  /** Optional TestID for the right button  */
  topRightButtonTestID?: string
  /** Function called when the modal is opened to support analytics */
  onShowAnalyticsFn?: () => void
  /** Optional TestID for scrollView */
  testID?: string
}

const RadioGroupModal: FC<RadioGroupModalProps> = ({
  groups,
  buttonText,
  headerText,
  onConfirm,
  onUpperRightAction,
  onCancel,
  buttonA11yLabel,
  buttonA11yHint,
  buttonTestID,
  topRightButtonText,
  topRightButtonA11yHint,
  topRightButtonTestID,
  onShowAnalyticsFn,
  testID,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const insets = useSafeAreaInsets()

  const showModal = (): void => {
    setModalVisible(true)
    if (onShowAnalyticsFn) {
      onShowAnalyticsFn()
    }
  }

  const onCancelPressed = (): void => {
    setModalVisible(false)
    onCancel()
  }

  const onApply = (): void => {
    setModalVisible(false)
    onConfirm()
  }

  const onUpperRightActionPressed = (): void => {
    onUpperRightAction()
  }

  const getGroups = () =>
    groups.map((group, idx) => {
      let mt = 0
      if (group.title) {
        // When title is present, <List> component adds mt: standardMarginBetween. We want less margin
        // on the first group, and more on subsequent groups to differentiate them
        mt = idx === 0 ? -theme.dimensions.condensedMarginBetween : theme.dimensions.condensedMarginBetween
      }

      return (
        <Box key={idx} mt={mt}>
          <RadioGroup options={group.items} onChange={group.onSetOption} isRadioList={true} radioListTitle={group.title} value={group.selectedValue} />
        </Box>
      )
    })

  const actionsBarBoxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'list',
    minHeight: theme.dimensions.touchableMinHeight,
    borderBottomColor: 'menuDivider',
    borderBottomWidth: 1,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
    ml: insets.left,
    mr: insets.right,
  }

  const commonButtonProps: TextViewProps = {
    variant: 'HelperText',
    color: 'showAll',
    allowFontScaling: false,
    py: 3,
  }

  const cancelButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityHint: t('cancel.picker.a11yHint'),
  }

  const resetButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityHint: topRightButtonA11yHint,
  }

  const pressableProps: PressableProps = {
    onPress: showModal,
    accessibilityRole: 'button',
    accessible: true,
    accessibilityLabel: buttonA11yLabel,
    accessibilityHint: buttonA11yHint,
  }

  const buttonDisplayProps: BoxProps = {
    backgroundColor: 'modalButton',
    borderWidth: 1,
    borderColor: 'modalButton',
    borderRadius: 20,
    py: 10,
    px: 15,
    alignSelf: 'flex-start',
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}>
        <Box flex={1} flexDirection="column" accessibilityViewIsModal={true}>
          <Box pt={insets.top} />
          <Box backgroundColor="list" pb={insets.bottom} flex={1}>
            <Box {...actionsBarBoxProps}>
              <Pressable onPress={onCancelPressed} {...cancelButtonProps}>
                <TextView {...commonButtonProps}>{t('cancel')}</TextView>
              </Pressable>
              <Box flex={4}>
                <TextView variant="MobileBodyBold" accessibilityRole={'header'} textAlign={'center'} allowFontScaling={false}>
                  {headerText}
                </TextView>
              </Box>
              <Pressable onPress={onUpperRightActionPressed} {...resetButtonProps}>
                <TextView testID={topRightButtonTestID} {...commonButtonProps}>
                  {topRightButtonText}
                </TextView>
              </Pressable>
            </Box>
            <VAScrollView testID={testID} bounces={false}>
              {getGroups()}
            </VAScrollView>
            <FooterButton text={t('apply')} backGroundColor="buttonPrimary" textColor={'navBar'} onPress={onApply} />
          </Box>
        </Box>
      </Modal>
      <Pressable testID={buttonTestID} {...pressableProps}>
        <Box {...buttonDisplayProps}>
          <TextView maxFontSizeMultiplier={1.5} variant={'HelperText'}>
            {buttonText}
          </TextView>
        </Box>
      </Pressable>
    </View>
  )
}

export default RadioGroupModal

import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, PressableProps, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, BoxProps, RadioGroup, TextView, TextViewProps, VAScrollView, radioOption } from 'components'
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
  /** Callback when the apply button is pressed */
  onApply: () => void
  /** Optional callback for cancelling the interaction */
  onCancel?: () => void
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
  /** Function called when the modal is opened to support analytics */
  onShowAnalyticsFn?: () => void
  /** Optional TestID for scrollView */
  testID?: string
}

const RadioGroupModal: FC<RadioGroupModalProps> = ({
  groups,
  onApply,
  onCancel,
  headerText,
  buttonText,
  buttonA11yLabel,
  buttonA11yHint,
  buttonTestID,
  onShowAnalyticsFn,
  testID,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const insets = useSafeAreaInsets()

  const showModal = () => {
    setModalVisible(true)
    onShowAnalyticsFn && onShowAnalyticsFn()
  }

  const onCancelPressed = () => {
    setModalVisible(false)
    onCancel && onCancel()
  }

  const onApplyPressed = () => {
    setModalVisible(false)
    onApply()
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
          <RadioGroup
            options={group.items}
            onChange={group.onSetOption}
            isRadioList={true}
            radioListTitle={group.title}
            value={group.selectedValue}
          />
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
    variant: 'MobileBody',
    color: 'showAll',
    allowFontScaling: false,
  }

  const cancelButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityHint: t('cancel.picker.a11yHint'),
  }

  const applyButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityHint: t('done.picker.a11yHint'),
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
          <Box backgroundColor="modalOverlay" opacity={0.8} pt={insets.top} />
          <Box backgroundColor="list" pb={insets.bottom} flex={1}>
            <Box {...actionsBarBoxProps}>
              <Pressable onPress={onCancelPressed} {...cancelButtonProps}>
                <TextView {...commonButtonProps}>{t('cancel')}</TextView>
              </Pressable>
              <Box flex={4}>
                <TextView
                  variant="MobileBodyBold"
                  accessibilityRole={'header'}
                  textAlign={'center'}
                  allowFontScaling={false}>
                  {headerText}
                </TextView>
              </Box>
              <Pressable onPress={onApplyPressed} {...applyButtonProps}>
                <TextView {...commonButtonProps}>{t('apply')}</TextView>
              </Pressable>
            </Box>
            <VAScrollView testID={testID} bounces={false}>
              {getGroups()}
            </VAScrollView>
          </Box>
        </Box>
      </Modal>

      <Button
        onPress={showModal}
        label={buttonText}
        buttonType={ButtonVariants.Secondary}
        a11yLabel={buttonA11yLabel}
        a11yHint={buttonA11yHint}
        testID={buttonTestID}
      />
    </View>
  )
}

export default RadioGroupModal

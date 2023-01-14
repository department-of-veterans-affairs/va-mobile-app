"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9325],{38909:function(e,n,t){t.d(n,{Z:function(){return u}});var o=t(67294),r=t(19055),i=t(26396),l=t(58215),a=t(82224),s=t(36005),c=function(e){var n=e.props;return n?o.createElement(o.Fragment,null,s.ZP.isEmpty(n)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(n).map((function(e){var t;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(t=n[e].type)?void 0:t.name),o.createElement("td",null,n[e].defaultValue&&n[e].defaultValue.value.toString()),o.createElement("td",null,n[e].required?"Yes":"No"),o.createElement("td",null,n[e].description))}))))):null};function u(e){var n=(0,a.N)(e.componentName)[0],t=n.description,s=n.displayName,u=n.props,p="How to use the "+s+" component",d="Full code for the "+s+" component";return o.createElement(o.Fragment,null,t,o.createElement("br",null),o.createElement("br",null),o.createElement(i.Z,null,o.createElement(l.Z,{value:"props",label:"Properties"},o.createElement(c,{props:u})),o.createElement(l.Z,{value:"example",label:"Example"},e.example&&o.createElement(r.Z,{title:p,className:"language-tsx test"},e.example)),o.createElement(l.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(r.Z,{title:d,className:"language-tsx"},e.codeString)),o.createElement(l.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},82224:function(e,n,t){t.d(n,{N:function(){return r}});var o=t(28084),r=function(e){return(0,o.default)()["docusaurus-plugin-react-docgen-typescript"].default.filter((function(n){return n.displayName===e}))}},1140:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return c},default:function(){return b},exampleString:function(){return d},frontMatter:function(){return s},metadata:function(){return u},toc:function(){return p}});var o=t(87462),r=t(63366),i=(t(67294),t(3905)),l=(t(19055),t(38909)),a=["components"],s={},c=void 0,u={unversionedId:"UX/ComponentsSection/Selection and Input/VAModalPicker",id:"UX/ComponentsSection/Selection and Input/VAModalPicker",title:"VAModalPicker",description:"export const exampleString = `<VAModalPicker",source:"@site/docs/UX/ComponentsSection/Selection and Input/VAModalPicker.mdx",sourceDirName:"UX/ComponentsSection/Selection and Input",slug:"/UX/ComponentsSection/Selection and Input/VAModalPicker",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/VAModalPicker",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"VADatePicker",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/VADatePicker"},next:{title:"VASelector",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/VASelector"}},p=[],d="<VAModalPicker \nselectedValue={selected} \nonSelectionChange={(textValue) => { setSelected(textValue) }} \npickerOptions={ [ { label: 'item', value: 'itemValue' } ] }/>",m={toc:p,exampleString:d};function b(e){var n=e.components,t=(0,r.Z)(e,a);return(0,i.kt)("wrapper",(0,o.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)(l.Z,{componentName:"VAModalPicker",example:d,codeString:"import { AccessibilityProps, Modal, Pressable, PressableProps, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, View } from 'react-native'\nimport { useSafeAreaInsets } from 'react-native-safe-area-context'\nimport { useTranslation } from 'react-i18next'\nimport React, { FC, ReactElement, useEffect, useState } from 'react'\n\nimport { Box, BoxProps, TextView, TextViewProps, VAIcon, VAScrollView, ValidationFunctionItems } from 'components'\nimport { NAMESPACE } from 'constants/namespaces'\nimport { VAIconProps } from 'components/VAIcon'\nimport { a11yHintProp, a11yValueProp, testIdProps } from 'utils/accessibility'\nimport { generateA11yValue, generateInputTestID, getInputWrapperProps, renderInputError, renderInputLabelSection, updateInputErrorMessage } from '../formFieldUtils'\nimport { getTranslation } from 'utils/formattingUtils'\nimport { useTheme } from 'utils/hooks'\nimport PickerList, { PickerListItemObj } from './PickerList'\n\n/**\n * Signifies type of each item in list of {@link pickerOptions}\n */\nexport type PickerItem = {\n  /** label is the text displayed to the user for the item */\n  label: string\n  /** value is the unique value of the item, used to update and keep track of the current label displayed */\n  value: string\n  /** icon to show */\n  icon?: VAIconProps\n}\n\nexport type VAModalPickerProps = {\n  /** Currently selected item from list of options */\n  selectedValue: string\n  /** Called when the selected value is changed */\n  onSelectionChange: (selectValue: string) => void\n  /** list of items of containing types label and value for each option in the picker */\n  pickerOptions: Array<PickerItem>\n  /** i18n key for the text label next the picker field */\n  labelKey?: string\n  /** optional boolean that disables the picker when set to true */\n  disabled?: boolean\n  /** optional testID for the overall component */\n  testID?: string\n  /** optional boolean that displays required text next to label if set to true */\n  isRequiredField?: boolean\n  /** optional key for string to display underneath label */\n  helperTextKey?: string\n  /** optional callback to update the error message if there is an error */\n  setError?: (error?: string) => void\n  /** if this exists updated picker styles to error state */\n  error?: string\n  /** optional list of validation functions to check against */\n  validationList?: Array<ValidationFunctionItems>\n  /** If true, will include a blank option at the top of the list with a blank value */\n  includeBlankPlaceholder?: boolean\n  /** renders a button instead of form field */\n  displayButton?: boolean\n  /** i18n key text for the name of the button */\n  buttonText?: string\n  /** i18n key  text for the picker confirm button */\n  confirmBtnText?: string\n}\n\n/**A common component to display a picker for the device with an optional label*/\nconst VAModalPicker: FC<VAModalPickerProps> = ({\n  selectedValue,\n  onSelectionChange,\n  pickerOptions,\n  labelKey,\n  disabled,\n  testID,\n  isRequiredField,\n  helperTextKey,\n  setError,\n  error,\n  validationList,\n  includeBlankPlaceholder,\n  displayButton = false,\n  buttonText,\n  confirmBtnText,\n}) => {\n  const [modalVisible, setModalVisible] = useState(false)\n  const theme = useTheme()\n  const { t } = useTranslation()\n  const { t: tc } = useTranslation(NAMESPACE.COMMON)\n  const insets = useSafeAreaInsets()\n\n  const [currentSelectedValue, setCurrentSelectedValue] = useState(selectedValue)\n  const [focusUpdated, setFocusUpdated] = useState(false)\n  const [isFocused, setIsFocused] = useState(false)\n\n  useEffect(() => {\n    updateInputErrorMessage(isFocused, isRequiredField, error, setError, selectedValue, focusUpdated, setFocusUpdated, validationList)\n  }, [isFocused, labelKey, selectedValue, error, setError, isRequiredField, t, focusUpdated, validationList])\n\n  const showModal = (): void => {\n    if (!disabled) {\n      setIsFocused(true)\n      setModalVisible(true)\n      snackBar?.hideAll()\n    }\n  }\n\n  const onConfirm = (): void => {\n    onSelectionChange(currentSelectedValue)\n    setModalVisible(false)\n    setIsFocused(false)\n    setFocusUpdated(true)\n  }\n\n  const onCancel = (): void => {\n    // Reset the selected picker item\n    setCurrentSelectedValue(selectedValue)\n\n    setModalVisible(false)\n    setIsFocused(false)\n    setFocusUpdated(true)\n  }\n\n  const handleSelection = (selectionVal: string): void => {\n    setCurrentSelectedValue(selectionVal)\n  }\n\n  const allPickerOptions: Array<PickerItem> = includeBlankPlaceholder\n    ? [\n        {\n          value: '',\n          label: '',\n        },\n      ].concat(pickerOptions)\n    : pickerOptions\n\n  const pickerListItems: Array<PickerListItemObj> = allPickerOptions.map((pickerOption) => {\n    return {\n      text: pickerOption.label,\n      onPress: () => {\n        handleSelection(pickerOption.value)\n      },\n      isSelected: currentSelectedValue === pickerOption.value,\n      icon: pickerOption.icon,\n    }\n  })\n\n  const currentlySelectedOption = allPickerOptions.find((el) => el.value === selectedValue)\n  const resultingTestID = generateInputTestID(testID, labelKey, isRequiredField, helperTextKey, error, t, 'common:picker')\n\n  const parentProps: AccessibilityProps = {\n    ...a11yValueProp({ text: generateA11yValue(currentlySelectedOption?.label, isFocused, t) }),\n    accessibilityRole: 'spinbutton',\n  }\n\n  const renderSelectionBox = (): ReactElement => {\n    const wrapperProps = getInputWrapperProps(theme, error, false)\n\n    const valueBox = (\n      <Box {...wrapperProps}>\n        <Box width=\"100%\" display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>\n          <TextView variant=\"MobileBody\" flex={1}>\n            {currentlySelectedOption?.label}\n          </TextView>\n          <Box mr={8} ml={16} my={16}>\n            <VAIcon name=\"DatePickerArrows\" fill=\"pickerIcon\" width={16} height={16} />\n          </Box>\n        </Box>\n      </Box>\n    )\n\n    const content = (\n      <Box>\n        {labelKey && renderInputLabelSection(error, isRequiredField, labelKey, t, helperTextKey)}\n        {!!error && renderInputError(error)}\n        {valueBox}\n      </Box>\n    )\n\n    return (\n      <Pressable onPress={showModal} accessible={true} {...testIdProps(resultingTestID)} {...parentProps}>\n        {content}\n      </Pressable>\n    )\n  }\n\n  const renderButton = () => {\n    const color = disabled ? 'actionBarDisabled' : 'actionBar'\n\n    const props: TouchableWithoutFeedbackProps = {\n      onPress: showModal,\n      disabled,\n      accessibilityRole: 'button',\n      accessible: true,\n      accessibilityState: disabled ? { disabled: true } : { disabled: false },\n    }\n\n    return (\n      <TouchableWithoutFeedback {...props} {...testIdProps(getTranslation(buttonText || '', t))} {...a11yHintProp(tc('pickerLaunchBtn.a11yHint'))}>\n        <Box pr={theme.dimensions.headerButtonSpacing} height={theme.dimensions.headerHeight} justifyContent={'center'} pl={theme.dimensions.headerLeftButtonFromTextPadding}>\n          <TextView variant=\"ActionBar\" color={color} allowFontScaling={false} accessible={false}>\n            {getTranslation(buttonText || '', t)}\n          </TextView>\n        </Box>\n      </TouchableWithoutFeedback>\n    )\n  }\n\n  const actionsBarBoxProps: BoxProps = {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    backgroundColor: 'pickerControls',\n    minHeight: theme.dimensions.touchableMinHeight,\n    py: theme.dimensions.buttonPadding,\n    px: theme.dimensions.gutter,\n    ml: insets.left,\n    mr: insets.right,\n  }\n\n  const topPadding = insets.top + 60\n\n  const cancelLabel = tc('cancel')\n  const confirmLabel = getTranslation(confirmBtnText || 'common:done', t)\n\n  const cancelButtonProps: PressableProps = {\n    accessible: true,\n    accessibilityRole: 'button',\n    ...testIdProps(cancelLabel),\n    ...a11yHintProp(tc('cancel.picker.a11yHint')),\n  }\n\n  const confirmButtonProps: PressableProps = {\n    accessible: true,\n    accessibilityRole: 'button',\n    ...testIdProps(confirmLabel),\n    ...a11yHintProp(tc('done.picker.a11yHint')),\n  }\n\n  const commonButtonProps: TextViewProps = {\n    variant: 'MobileBody',\n    allowFontScaling: false,\n    py: 3, // bump up the padding to make touch target a bit bigger #2740\n  }\n\n  return (\n    <View>\n      <Modal\n        animationType=\"slide\"\n        transparent={true}\n        visible={modalVisible}\n        supportedOrientations={['portrait', 'landscape']}\n        onRequestClose={() => {\n          setModalVisible(!modalVisible)\n        }}>\n        <Box flex={1} flexDirection=\"column\" accessibilityViewIsModal={true}>\n          <Box flexGrow={1} backgroundColor=\"modalOverlay\" opacity={0.8} pt={topPadding} />\n          <Box backgroundColor=\"list\" pb={insets.bottom} flexShrink={1}>\n            <Box {...actionsBarBoxProps}>\n              <Pressable onPress={onCancel} {...cancelButtonProps}>\n                <TextView {...commonButtonProps}>{cancelLabel}</TextView>\n              </Pressable>\n              <Box flex={4}>\n                <TextView variant=\"MobileBodyBold\" textAlign={'center'} allowFontScaling={false}>\n                  {getTranslation(labelKey || '', t)}\n                </TextView>\n              </Box>\n              <Pressable onPress={onConfirm} {...confirmButtonProps}>\n                <TextView {...commonButtonProps}>{confirmLabel}</TextView>\n              </Pressable>\n            </Box>\n            <VAScrollView bounces={false}>\n              <PickerList items={pickerListItems} />\n            </VAScrollView>\n          </Box>\n        </Box>\n      </Modal>\n      {displayButton ? renderButton() : renderSelectionBox()}\n    </View>\n  )\n}\n\nexport default VAModalPicker\n",mdxType:"ComponentTopInfo"}))}b.isMDXComponent=!0}}]);
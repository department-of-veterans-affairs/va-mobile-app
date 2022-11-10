"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[5079],{38909:function(e,n,t){t.d(n,{Z:function(){return p}});var o=t(67294),r=t(19055),a=t(26396),i=t(58215),l=t(82224),s=t(36005),u=function(e){var n=e.props;return n?o.createElement(o.Fragment,null,s.ZP.isEmpty(n)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(n).map((function(e){var t;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(t=n[e].type)?void 0:t.name),o.createElement("td",null,n[e].defaultValue&&n[e].defaultValue.value.toString()),o.createElement("td",null,n[e].required?"Yes":"No"),o.createElement("td",null,n[e].description))}))))):null};function p(e){var n=(0,l.N)(e.componentName)[0],t=n.description,s=n.displayName,p=n.props,c="How to use the "+s+" component",d="Full code for the "+s+" component";return o.createElement(o.Fragment,null,t,o.createElement("br",null),o.createElement("br",null),o.createElement(a.Z,null,o.createElement(i.Z,{value:"props",label:"Properties"},o.createElement(u,{props:p})),o.createElement(i.Z,{value:"example",label:"Example"},e.example&&o.createElement(r.Z,{title:c,className:"language-tsx test"},e.example)),o.createElement(i.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(r.Z,{title:d,className:"language-tsx"},e.codeString)),o.createElement(i.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},85603:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return u},default:function(){return x},exampleString:function(){return d},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return c}});var o=t(87462),r=t(63366),a=(t(67294),t(3905)),i=(t(19055),t(38909)),l=["components"],s={},u=void 0,p={unversionedId:"Engineering/FrontEnd/ComponentsSection/Form/VATextInput",id:"Engineering/FrontEnd/ComponentsSection/Form/VATextInput",title:"VATextInput",description:"export const exampleString = `<VATextInput",source:"@site/docs/Engineering/FrontEnd/ComponentsSection/Form/VATextInput.mdx",sourceDirName:"Engineering/FrontEnd/ComponentsSection/Form",slug:"/Engineering/FrontEnd/ComponentsSection/Form/VATextInput",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Form/VATextInput",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"VASelector",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Form/VASelector"},next:{title:"NotificationManager",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/NotificationManager"}},c=[],d="<VATextInput \ninputType={'email'} \nvalue={selected} \nonChange={(textValue) => { setSelected(textValue) }} \nisTextArea={false}/>",m={toc:c,exampleString:d};function x(e){var n=e.components,t=(0,r.Z)(e,l);return(0,a.kt)("wrapper",(0,o.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)(i.Z,{componentName:"VATextInput",example:d,codeString:"import { KeyboardTypeOptions, TextInput, TextInputProps } from 'react-native'\nimport { useTranslation } from 'react-i18next'\nimport React, { FC, ReactElement, RefObject, useEffect, useRef, useState } from 'react'\n\nimport { Box, BoxProps, ValidationFunctionItems } from '../../index'\nimport { getInputBorderColor, getInputWrapperProps, renderInputError, renderInputLabelSection, updateInputErrorMessage } from './formFieldUtils'\nimport { useTheme } from 'utils/hooks'\n\nexport type VATextInputTypes = 'none' | 'email' | 'phone'\n\nexport type VATextInputProps = {\n  /** Type of the input. Will determine the keyboard used */\n  inputType: VATextInputTypes\n  /** Initial value of the input. If blank it will show the placeholder */\n  value?: string\n  /** i18n key for the label */\n  labelKey?: string\n  /** Handle the change in input value */\n  onChange: (val: string) => void\n  /** Maximum length of the input */\n  maxLength?: number\n  /** Handle input once the user is done typing */\n  onEndEditing?: () => void\n  /** optional testID for the overall component */\n  testID?: string\n  /** optional ref value */\n  inputRef?: RefObject<TextInput>\n  /** optional boolean that displays required text next to label if set to true */\n  isRequiredField?: boolean\n  /** optional key for string to display underneath label */\n  helperTextKey?: string\n  /** optional callback to update the error message if there is an error */\n  setError?: (error?: string) => void\n  /** if this exists updates input styles to error state */\n  error?: string\n  /** optional list of validation functions to check against */\n  validationList?: Array<ValidationFunctionItems>\n  /** optional boolean that when true displays a text area rather than a single line text input */\n  isTextArea?: boolean\n  /** optional boolean to set the cursor to the beginning of a string value */\n  setInputCursorToBeginning?: boolean\n}\n\n/**\n * Text input with a label\n */\nconst VATextInput: FC<VATextInputProps> = (props: VATextInputProps) => {\n  const {\n    inputType,\n    value,\n    labelKey,\n    onChange,\n    maxLength,\n    onEndEditing,\n    inputRef,\n    isRequiredField,\n    helperTextKey,\n    setError,\n    error,\n    validationList,\n    isTextArea,\n    setInputCursorToBeginning,\n  } = props\n  const { t } = useTranslation()\n  const theme = useTheme()\n  const startTextPositon = { start: 0, end: 0 }\n  const [focusUpdated, setFocusUpdated] = useState(false)\n  const [isFocused, setIsFocused] = useState(false)\n  const [selection, setSelection] = useState<{ start: number; end?: number } | undefined>(setInputCursorToBeginning ? startTextPositon : undefined)\n  const ref = useRef<TextInput>(null)\n\n  useEffect(() => {\n    updateInputErrorMessage(isFocused, isRequiredField, error, setError, value, focusUpdated, setFocusUpdated, validationList)\n  }, [isFocused, labelKey, value, error, setError, isRequiredField, t, focusUpdated, validationList])\n\n  let textContentType: 'emailAddress' | 'telephoneNumber' | 'none' = 'none'\n  let keyboardType: KeyboardTypeOptions = 'default'\n\n  switch (inputType) {\n    case 'email': {\n      textContentType = 'emailAddress'\n      keyboardType = 'email-address'\n      break\n    }\n    case 'phone': {\n      textContentType = 'telephoneNumber'\n      // TODO #16792, 'default' to avoid Voice Control crash\n      // keyboardType = 'number-pad'\n      break\n    }\n  }\n\n  const onBlur = (): void => {\n    setIsFocused(false)\n    setFocusUpdated(true)\n  }\n\n  const onFocus = () => {\n    setIsFocused(true)\n    if (setInputCursorToBeginning) {\n      setSelection(undefined)\n    }\n  }\n\n  const inputProps: TextInputProps = {\n    value: value,\n    textContentType,\n    keyboardType,\n    maxLength,\n    disableFullscreenUI: true,\n    placeholderTextColor: theme.colors.text.placeholder,\n    onChangeText: (newVal) => {\n      onChange(newVal)\n\n      // if there was an error, remove when the user starts typing\n      if (newVal.length > 0 && setError && error !== '') {\n        setError('')\n      }\n    },\n    onEndEditing,\n    style: {\n      fontSize: theme.fontSizes.MobileBody.fontSize,\n      fontFamily: theme.fontFace.regular,\n      marginRight: 40,\n      color: isFocused ? theme.colors.text.inputFocused : theme.colors.text.input,\n      height: isTextArea ? 201 : undefined,\n    },\n    onFocus,\n    onBlur,\n    selection,\n    multiline: isTextArea ? true : false,\n  }\n\n  const textAreaWrapperProps: BoxProps = {\n    backgroundColor: 'textBox',\n    height: 201,\n    borderColor: getInputBorderColor(error, isFocused),\n    borderWidth: isFocused || !!error ? theme.dimensions.focusedInputBorderWidth : theme.dimensions.borderWidth,\n    pl: 8,\n  }\n\n  const renderTextInput = (): ReactElement => {\n    const wrapperProps = isTextArea ? textAreaWrapperProps : getInputWrapperProps(theme, error, isFocused)\n\n    const textInputBox = (\n      <Box {...wrapperProps}>\n        <Box width=\"100%\">\n          <TextInput {...inputProps} ref={inputRef || ref} />\n        </Box>\n      </Box>\n    )\n\n    const content = (\n      <Box>\n        {labelKey && renderInputLabelSection(error, isRequiredField, labelKey, t, helperTextKey)}\n        {!!error && renderInputError(error)}\n        {textInputBox}\n      </Box>\n    )\n\n    return <Box>{content}</Box>\n  }\n\n  return renderTextInput()\n}\n\nexport default VATextInput\n",mdxType:"ComponentTopInfo"}))}x.isMDXComponent=!0}}]);
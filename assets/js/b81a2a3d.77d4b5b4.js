"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[3109],{7644:(e,t,n)=>{n.d(t,{A:()=>u});var o=n(96540),r=n(54610),a=n(3384),s=n(31347),l=n(28057),i=n(84476);const p=e=>{let{props:t}=e;return t?o.createElement(o.Fragment,null,i.Ay.isEmpty(t)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(t).map((e=>o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},t[e].type?.name),o.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),o.createElement("td",null,t[e].required?"Yes":"No"),o.createElement("td",null,t[e].description))))))):null};function u(e){const t=(0,l.d)(e.componentName),{description:n,displayName:i,props:u}=t[0],d=`How to use the ${i} component`,c=`Full code for the ${i} component`;return o.createElement(o.Fragment,null,n,o.createElement("br",null),o.createElement("br",null),o.createElement(a.A,null,o.createElement(s.A,{value:"props",label:"Properties"},o.createElement(p,{props:u})),o.createElement(s.A,{value:"example",label:"Example"},e.example&&o.createElement(r.A,{title:d,className:"language-tsx test"},e.example)),o.createElement(s.A,{value:"code",label:"Source Code"},e.codeString&&o.createElement(r.A,{title:c,className:"language-tsx"},e.codeString)),o.createElement(s.A,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},28057:(e,t,n)=>{n.d(t,{d:()=>r});var o=n(2736);const r=e=>(0,o.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((t=>t.displayName===e))},82124:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>h,exampleString:()=>c,frontMatter:()=>l,metadata:()=>p,toc:()=>d});var o=n(58168),r=(n(96540),n(15680));n(41873),n(54610);const a="import React, { FC, ReactElement, RefObject, useEffect, useRef, useState } from 'react'\nimport { useTranslation } from 'react-i18next'\nimport { KeyboardTypeOptions, TextInput, TextInputProps } from 'react-native'\n\nimport { useTheme } from 'utils/hooks'\nimport { isIOS } from 'utils/platform'\n\nimport { Box, BoxProps } from '../../index'\nimport {\n  getInputBorderColor,\n  getInputBorderWidth,\n  getInputWrapperProps,\n  removeInputErrorMessage,\n  renderInputError,\n  renderInputLabelSection,\n} from './formFieldUtils'\n\nexport type VATextInputTypes = 'none' | 'email' | 'phone'\n\nexport type VATextInputProps = {\n  /** Type of the input. Will determine the keyboard used */\n  inputType: VATextInputTypes\n  /** Initial value of the input. If blank it will show the placeholder */\n  value?: string\n  /** i18n key for the label */\n  labelKey?: string\n  /** Handle the change in input value */\n  onChange: (val: string) => void\n  /** Maximum length of the input */\n  maxLength?: number\n  /** Handle input once the user is done typing */\n  onEndEditing?: () => void\n  /** optional testID for the overall component */\n  testID?: string\n  /** optional ref value */\n  inputRef?: RefObject<TextInput>\n  /** optional boolean that displays required text next to label if set to true */\n  isRequiredField?: boolean\n  /** optional key for string to display underneath label */\n  helperTextKey?: string\n  /** optional callback to update the error message if there is an error */\n  setError?: (error?: string) => void\n  /** if this exists updates input styles to error state */\n  error?: string\n  /** optional boolean that when true displays a text area rather than a single line text input */\n  isTextArea?: boolean\n  /** optional boolean to set the cursor to the beginning of a string value */\n  setInputCursorToBeginning?: boolean\n}\n\n/**\n * Text input with a label\n */\nconst VATextInput: FC<VATextInputProps> = (props: VATextInputProps) => {\n  const {\n    inputType,\n    value,\n    labelKey,\n    onChange,\n    maxLength,\n    onEndEditing,\n    testID,\n    inputRef,\n    isRequiredField,\n    helperTextKey,\n    setError,\n    error,\n    isTextArea,\n    setInputCursorToBeginning,\n  } = props\n  const { t } = useTranslation()\n  const theme = useTheme()\n  const startTextPositon = { start: 0, end: 0 }\n  const [focusUpdated, setFocusUpdated] = useState(false)\n  const [isFocused, setIsFocused] = useState(false)\n  const [selection, setSelection] = useState<{ start: number; end?: number } | undefined>(\n    setInputCursorToBeginning ? startTextPositon : undefined,\n  )\n  const ref = useRef<TextInput>(null)\n\n  useEffect(() => {\n    removeInputErrorMessage(isFocused, error, setError, focusUpdated, setFocusUpdated)\n  }, [isFocused, error, setError, focusUpdated])\n\n  let textContentType: 'emailAddress' | 'telephoneNumber' | 'none' = 'none'\n  let keyboardType: KeyboardTypeOptions = 'default'\n\n  switch (inputType) {\n    case 'email': {\n      textContentType = 'emailAddress'\n      keyboardType = 'email-address'\n      break\n    }\n    case 'phone': {\n      textContentType = 'telephoneNumber'\n      keyboardType = isIOS() ? 'number-pad' : 'numeric'\n      break\n    }\n  }\n\n  const onBlur = (): void => {\n    setIsFocused(false)\n    setFocusUpdated(true)\n  }\n\n  const onFocus = () => {\n    setIsFocused(true)\n    if (setInputCursorToBeginning) {\n      setSelection(undefined)\n    }\n  }\n\n  const inputBorderWidth = getInputBorderWidth(theme, error, isFocused)\n  const textAreaHeight = 201\n\n  const inputProps: TextInputProps = {\n    value: value,\n    textContentType,\n    keyboardType,\n    maxLength,\n    disableFullscreenUI: true,\n    placeholderTextColor: theme.colors.text.placeholder,\n    textAlignVertical: isTextArea ? 'top' : undefined,\n    onChangeText: (newVal) => {\n      if ((newVal.length > 0 && keyboardType === 'number-pad') || keyboardType === 'numeric') {\n        onChange(newVal.replace(/\\D/g, ''))\n      } else {\n        onChange(newVal)\n      }\n    },\n    onEndEditing,\n    style: {\n      fontSize: theme.fontSizes.MobileBody.fontSize,\n      fontFamily: theme.fontFace.regular,\n      marginRight: 40,\n      color: isFocused ? theme.colors.text.inputFocused : theme.colors.text.input,\n      height: isTextArea ? textAreaHeight - inputBorderWidth * 2 : undefined,\n    },\n    onFocus,\n    onBlur,\n    selection,\n    multiline: isTextArea ? true : false,\n    testID,\n  }\n\n  const textAreaWrapperProps: BoxProps = {\n    backgroundColor: 'textBox',\n    height: textAreaHeight,\n    borderColor: getInputBorderColor(error, isFocused),\n    borderWidth: inputBorderWidth,\n    pl: 8,\n  }\n\n  const renderTextInput = (): ReactElement => {\n    const wrapperProps = isTextArea ? textAreaWrapperProps : getInputWrapperProps(theme, error, isFocused)\n\n    const textInputBox = (\n      <Box {...wrapperProps}>\n        <Box width=\"100%\">\n          <TextInput testID={testID} {...inputProps} ref={inputRef || ref} />\n        </Box>\n      </Box>\n    )\n\n    const content = (\n      <Box>\n        {labelKey && renderInputLabelSection(error, isRequiredField, labelKey, t, helperTextKey)}\n        {!!error && renderInputError(error)}\n        {textInputBox}\n      </Box>\n    )\n\n    return <Box>{content}</Box>\n  }\n\n  return renderTextInput()\n}\n\nexport default VATextInput\n";var s=n(7644);const l={title:"Text input"},i=void 0,p={unversionedId:"Flagship design library/Components/Selection and Input/Form Elements/VATextInput",id:"Flagship design library/Components/Selection and Input/Form Elements/VATextInput",title:"Text input",description:"Text input allows people to enter any type of text unless otherwise restricted.",source:"@site/docs/Flagship design library/Components/Selection and Input/Form Elements/VATextInput.mdx",sourceDirName:"Flagship design library/Components/Selection and Input/Form Elements",slug:"/Flagship design library/Components/Selection and Input/Form Elements/VATextInput",permalink:"/va-mobile-app/docs/Flagship design library/Components/Selection and Input/Form Elements/VATextInput",draft:!1,tags:[],version:"current",frontMatter:{title:"Text input"},sidebar:"tutorialSidebar",previous:{title:"VASelector",permalink:"/va-mobile-app/docs/Flagship design library/Components/Selection and Input/Form Elements/VASelector"},next:{title:"Pickers",permalink:"/va-mobile-app/docs/Flagship design library/Components/Selection and Input/Pickers/"}},u={},d=[{value:"Examples",id:"examples",level:2},{value:"Default",id:"default",level:3},{value:"Examples",id:"examples-1",level:3},{value:"Usage",id:"usage",level:2},{value:"Content considerations",id:"content-considerations",level:2},{value:"Accessibility considerations",id:"accessibility-considerations",level:2},{value:"Code usage",id:"code-usage",level:2}],c="<VATextInput \ninputType={'email'} \nvalue={selected} \nonChange={(textValue) => { setSelected(textValue) }} \nisTextArea={false}/>",m={toc:d,exampleString:c},g="wrapper";function h(e){let{components:t,...n}=e;return(0,r.yg)(g,(0,o.A)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("p",null,"Text input allows people to enter any type of text unless otherwise restricted."),(0,r.yg)("h2",{id:"examples"},"Examples"),(0,r.yg)("h3",{id:"default"},"Default"),(0,r.yg)("iframe",{width:"800",height:"450",alt:"Image of master component in Figma showing light and dark mode",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/design/g15WfeOSaVFl8Eapoc6UtP/%5BNEW%5D-Text-input?node-id=4394-547&t=13B9cqqaRF3A0suB-4",allowfullscreen:!0}),(0,r.yg)("h3",{id:"examples-1"},"Examples"),(0,r.yg)("iframe",{width:"800",height:"450",alt:"Image of component examples in Figma",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/design/g15WfeOSaVFl8Eapoc6UtP/%5BNEW%5D-Text-input?node-id=4394-548&t=13B9cqqaRF3A0suB-4",allowfullscreen:!0}),(0,r.yg)("h2",{id:"usage"},"Usage"),(0,r.yg)("p",null,(0,r.yg)("a",{parentName:"p",href:"https://design.va.gov/components/form/text-input"},"Refer to the VA Design System for usage guidance")),(0,r.yg)("h2",{id:"content-considerations"},"Content considerations"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Refer to the ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/components/form/text-input"},"VA Design System for content considerations"))),(0,r.yg)("h2",{id:"accessibility-considerations"},"Accessibility considerations"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Refer to the ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/components/form/text-input#accessibility-considerations"},"VA Design System for accessibility considerations"))),(0,r.yg)("h2",{id:"code-usage"},"Code usage"),(0,r.yg)("p",null,"Link to Storybook coming soon"),(0,r.yg)(s.A,{componentName:"VATextInput",example:c,codeString:a,mdxType:"ComponentTopInfo"}))}h.isMDXComponent=!0}}]);
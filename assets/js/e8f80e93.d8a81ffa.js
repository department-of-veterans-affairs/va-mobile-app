"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[357],{38909:function(e,t,n){n.d(t,{Z:function(){return p}});var o=n(67294),r=n(19055),l=n(26396),c=n(58215),a=n(82224),s=n(36005),i=function(e){var t=e.props;return t?o.createElement(o.Fragment,null,s.ZP.isEmpty(t)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(t).map((function(e){var n;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(n=t[e].type)?void 0:n.name),o.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),o.createElement("td",null,t[e].required?"Yes":"No"),o.createElement("td",null,t[e].description))}))))):null};function p(e){var t=(0,a.N)(e.componentName)[0],n=t.description,s=t.displayName,p=t.props,d="How to use the "+s+" component",m="Full code for the "+s+" component";return o.createElement(o.Fragment,null,n,o.createElement("br",null),o.createElement("br",null),o.createElement(l.Z,null,o.createElement(c.Z,{value:"props",label:"Properties"},o.createElement(i,{props:p})),o.createElement(c.Z,{value:"example",label:"Example"},e.example&&o.createElement(r.Z,{title:d,className:"language-tsx test"},e.example)),o.createElement(c.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(r.Z,{title:m,className:"language-tsx"},e.codeString)),o.createElement(c.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},82224:function(e,t,n){n.d(t,{N:function(){return r}});var o=n(28084),r=function(e){return(0,o.default)()["docusaurus-plugin-react-docgen-typescript"].default.filter((function(t){return t.displayName===e}))}},71986:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return i},default:function(){return b},exampleString:function(){return m},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return d}});var o=n(87462),r=n(63366),l=(n(67294),n(3905)),c=(n(19055),n(38909)),a=["components"],s={},i=void 0,p={unversionedId:"UX/ComponentsSection/Selection and Input/Form Elements/VASelector",id:"UX/ComponentsSection/Selection and Input/Form Elements/VASelector",title:"VASelector",description:"",source:"@site/docs/UX/ComponentsSection/Selection and Input/Form Elements/VASelector.mdx",sourceDirName:"UX/ComponentsSection/Selection and Input/Form Elements",slug:"/UX/ComponentsSection/Selection and Input/Form Elements/VASelector",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/Form Elements/VASelector",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Switch",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/Form Elements/Switch"},next:{title:"VATextInput",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/Form Elements/VATextInput"}},d=[],m="<VASelector text={'Text to display'} selected={selected} setSelected={setSelected}/>",u={toc:d,exampleString:m};function b(e){var t=e.components,n=(0,r.Z)(e,a);return(0,l.kt)("wrapper",(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)(c.Z,{componentName:"VASelector",example:m,codeString:"import { TouchableWithoutFeedback } from 'react-native'\nimport { useTranslation } from 'react-i18next'\nimport React, { FC } from 'react'\n\nimport { Box, BoxProps, TextView, VAIcon, VAIconProps } from '../../index'\nimport { VAIconColors, VATextColors } from 'styles/theme'\nimport { a11yHintProp, testIdProps } from 'utils/accessibility'\nimport { getTranslation } from 'utils/formattingUtils'\nimport { renderInputError } from './formFieldUtils'\nimport { useTheme } from 'utils/hooks'\n\nexport enum SelectorType {\n  Checkbox = 'Checkbox',\n  Radio = 'Radio',\n}\n\n/**\n * Signifies props for the component {@link VASelector}\n */\nexport type VASelectorProps = {\n  /** render checkbox or radio button */\n  selectorType?: SelectorType\n  /** when true displays the filled checkbox/radio , when false displays the empty checkbox/radio */\n  selected: boolean\n  /** sets the value of selected on click of the checkbox/radio */\n  onSelectionChange: (selected: boolean) => void\n  /** translated labelKey displayed next to the checkbox/radio */\n  labelKey: string\n  /** optional arguments to pass in with the labelKey during translation */\n  labelArgs?: { [key: string]: string }\n  /** optional boolean that disables the VASelector/radio when set to true */\n  disabled?: boolean\n  /** optional accessibilityLabel */\n  a11yLabel?: string\n  /** optional accessibilityHint */\n  a11yHint?: string\n  /** optional error to display for the checkbox */\n  error?: string\n  /** optional callback to set the error message */\n  setError?: (value?: string) => void\n  /** optional boolean that marks the component as required */\n  isRequiredField?: boolean\n}\n\n/**A common component to display a checkbox with text*/\nconst VASelector: FC<VASelectorProps> = ({\n  selectorType = SelectorType.Checkbox,\n  selected,\n  onSelectionChange,\n  labelKey,\n  labelArgs,\n  disabled,\n  a11yLabel,\n  a11yHint,\n  error,\n  setError,\n  isRequiredField,\n}) => {\n  const theme = useTheme()\n  const { t } = useTranslation()\n  const iconWidth = 22\n\n  const selectorOnPress = (): void => {\n    if (!disabled) {\n      setError && setError('')\n\n      // if its a required checkbox and its being unchecked, display the error\n      if (isRequiredField && selected && setError && selectorType === SelectorType.Checkbox) {\n        setError()\n      }\n\n      onSelectionChange(!selected)\n    }\n  }\n\n  const getIconsProps = (name: string, stroke?: keyof VAIconColors | string, fill?: keyof VAIconColors | keyof VATextColors | string): VAIconProps => {\n    return {\n      name,\n      stroke,\n      width: iconWidth,\n      height: 22,\n      fill,\n    } as VAIconProps\n  }\n\n  const errorBoxProps: BoxProps = {\n    ml: 10 + iconWidth,\n  }\n\n  const selectorBoxProps: BoxProps = {\n    ml: 10,\n    flex: 1,\n  }\n\n  const getCheckBoxIcon = (): React.ReactNode => {\n    if (disabled && selectorType === SelectorType.Radio) {\n      return <VAIcon {...getIconsProps('DisabledRadio')} {...testIdProps('DisabledRadio')} />\n    }\n\n    if (!!error && selectorType === SelectorType.Checkbox) {\n      return <VAIcon {...getIconsProps('ErrorCheckBox', theme.colors.icon.error)} {...testIdProps('ErrorCheckBox')} />\n    }\n\n    const filledName = selectorType === SelectorType.Checkbox ? 'FilledCheckBox' : 'FilledRadio'\n    const emptyName = selectorType === SelectorType.Checkbox ? 'EmptyCheckBox' : 'EmptyRadio'\n\n    const name = selected ? filledName : emptyName\n    const fill = selected ? 'checkboxEnabledPrimary' : 'checkboxDisabledContrast'\n    const stroke = selected ? 'checkboxEnabledPrimary' : 'checkboxDisabled'\n\n    return <VAIcon {...getIconsProps(name, stroke, fill)} {...testIdProps(name)} />\n  }\n\n  const hintProp = a11yHint ? a11yHintProp(a11yHint) : {}\n  const a11yRole = selectorType === SelectorType.Checkbox ? 'checkbox' : 'radio'\n  const a11yState = selectorType === SelectorType.Checkbox ? { checked: selected } : { selected }\n  const labelToUse = `${a11yLabel || getTranslation(labelKey, t, labelArgs)} ${error ? t('error', { error }) : ''}`\n\n  return (\n    <TouchableWithoutFeedback onPress={selectorOnPress} accessibilityState={a11yState} accessibilityRole={a11yRole} accessibilityLabel={labelToUse} {...hintProp}>\n      <Box>\n        {!!error && <Box {...errorBoxProps}>{renderInputError(error)}</Box>}\n        <Box flexDirection=\"row\">\n          <Box {...testIdProps('checkbox-with-label')}>{getCheckBoxIcon()}</Box>\n          <Box {...selectorBoxProps}>\n            <TextView variant=\"VASelector\" color={disabled ? 'checkboxDisabled' : 'bodyText'}>\n              {getTranslation(labelKey, t, labelArgs)}\n            </TextView>\n          </Box>\n        </Box>\n      </Box>\n    </TouchableWithoutFeedback>\n  )\n}\n\nexport default VASelector\n",mdxType:"ComponentTopInfo"}))}b.isMDXComponent=!0}}]);
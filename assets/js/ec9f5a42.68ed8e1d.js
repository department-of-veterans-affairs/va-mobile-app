"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[1104],{38909:function(e,n,t){t.d(n,{Z:function(){return p}});var o=t(67294),r=t(19055),l=t(26396),i=t(58215),a=t(82224),s=t(36005),c=function(e){var n=e.props;return n?o.createElement(o.Fragment,null,s.ZP.isEmpty(n)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(n).map((function(e){var t;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(t=n[e].type)?void 0:t.name),o.createElement("td",null,n[e].defaultValue&&n[e].defaultValue.value.toString()),o.createElement("td",null,n[e].required?"Yes":"No"),o.createElement("td",null,n[e].description))}))))):null};function p(e){var n=(0,a.N)(e.componentName)[0],t=n.description,s=n.displayName,p=n.props,d="How to use the "+s+" component",m="Full code for the "+s+" component";return o.createElement(o.Fragment,null,t,o.createElement("br",null),o.createElement("br",null),o.createElement(l.Z,null,o.createElement(i.Z,{value:"props",label:"Properties"},o.createElement(c,{props:p})),o.createElement(i.Z,{value:"example",label:"Example"},e.example&&o.createElement(r.Z,{title:d,className:"language-tsx test"},e.example)),o.createElement(i.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(r.Z,{title:m,className:"language-tsx"},e.codeString)),o.createElement(i.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},24476:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return c},default:function(){return x},exampleString:function(){return m},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return d}});var o=t(87462),r=t(63366),l=(t(67294),t(3905)),i=(t(19055),t(38909)),a=["components"],s={},c=void 0,p={unversionedId:"Engineering/FrontEnd/ComponentsSection/Uncategorized/CollapsibleView",id:"Engineering/FrontEnd/ComponentsSection/Uncategorized/CollapsibleView",title:"CollapsibleView",description:"expanded content revealed on click",source:"@site/docs/Engineering/FrontEnd/ComponentsSection/Uncategorized/CollapsibleView.mdx",sourceDirName:"Engineering/FrontEnd/ComponentsSection/Uncategorized",slug:"/Engineering/FrontEnd/ComponentsSection/Uncategorized/CollapsibleView",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Uncategorized/CollapsibleView",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"AppVersionAndBuild",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Uncategorized/AppVersionAndBuild"},next:{title:"NotificationManager",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Uncategorized/NotificationManager"}},d=[],m="<CollapsibleView text={'title of dropdown'}> \n    <TextView>expanded content revealed on click</TextView> \n</CollapsibleView>",u={toc:d,exampleString:m};function x(e){var n=e.components,t=(0,r.Z)(e,a);return(0,l.kt)("wrapper",(0,o.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,l.kt)(i.Z,{componentName:"CollapsibleView",example:m,codeString:"import React, { FC, useState } from 'react'\n\nimport { ColorVariant, TextArea } from './index'\nimport { Pressable, PressableProps, ViewStyle } from 'react-native'\nimport { a11yHintProp, testIdProps } from 'utils/accessibility'\nimport { useTheme } from 'utils/hooks'\nimport Box, { BoxProps } from './Box'\nimport TextView from './TextView'\nimport VAIcon, { VAIconProps } from './VAIcon'\n\n/**\n * Signifies props passed into {@link CollapsibleView}\n */\nexport type CollapsibleViewProps = {\n  /** text displayed on the touchable */\n  text: string\n  /** optional color for the touchable text */\n  textColor?: ColorVariant\n  /** optional param that renders the child content outside text area when set to false (defaults to true) */\n  contentInTextArea?: boolean\n  /** optional a11y hint */\n  a11yHint?: string\n  /** Whether to display any of the collapsible view in a text area. If false, contentInTextArea will have no effect. **/\n  showInTextArea?: boolean\n}\n\n/**\n * CollapsibleView that on click reveals content, which is hidden again on another click\n *\n * @returns CollapsibleView component\n */\nconst CollapsibleView: FC<CollapsibleViewProps> = ({ text, contentInTextArea = true, showInTextArea = true, a11yHint, textColor, children }) => {\n  const theme = useTheme()\n  const [expanded, setExpanded] = useState(false)\n\n  const onPress = (): void => {\n    setExpanded(!expanded)\n  }\n\n  const boxStyles: BoxProps = {\n    // flexShrink is necessary to keep textView from expanding too far and causing a gap between text contents and arrow icon\n    // also keeps textView from pushing arrow beyond right margin when large text is enabled\n    flexShrink: 1,\n    mr: 7,\n    borderBottomWidth: 2,\n    borderBottomColor: 'photoAdd', // todo rename photoAdd border color to be more abstract (talk to design)\n  }\n\n  const getArrowIcon = (): React.ReactNode => {\n    const iconProps: VAIconProps = {\n      fill: theme.colors.icon.chevronCollapsible,\n      name: expanded ? 'ArrowUp' : 'ArrowDown',\n      width: 9,\n      height: 7,\n    }\n    return <VAIcon {...iconProps} />\n  }\n\n  const pressableProps: PressableProps = {\n    onPress,\n    accessibilityState: { expanded },\n    accessibilityRole: 'spinbutton',\n  }\n\n  const pressableStyles: ViewStyle = {\n    flexDirection: 'row',\n    alignItems: 'center',\n    minHeight: theme.dimensions.touchableMinHeight,\n  }\n\n  const childrenDisplayed = expanded && <Box>{children}</Box>\n\n  const touchableRow = (\n    <Box minHeight={theme.dimensions.touchableMinHeight}>\n      <Pressable {...testIdProps(text)} {...a11yHintProp(a11yHint || '')} style={pressableStyles} {...pressableProps}>\n        <Box {...boxStyles}>\n          <TextView color={textColor} variant={'MobileBody'}>\n            {text}\n          </TextView>\n        </Box>\n        {getArrowIcon()}\n      </Pressable>\n    </Box>\n  )\n\n  // If none of the content is shown in a text area\n  if (!showInTextArea) {\n    return (\n      <Box>\n        {touchableRow}\n        {childrenDisplayed}\n      </Box>\n    )\n  }\n\n  // If the pressable row and/or content is in a text area\n  return (\n    <Box>\n      <TextArea>\n        {touchableRow}\n        {contentInTextArea && childrenDisplayed}\n      </TextArea>\n      {!contentInTextArea && childrenDisplayed}\n    </Box>\n  )\n}\n\nexport default CollapsibleView\n",mdxType:"ComponentTopInfo"}))}x.isMDXComponent=!0}}]);
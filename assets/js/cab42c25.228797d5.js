"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[6544],{3868:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return c},default:function(){return h},exampleString:function(){return m},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return d}});var o=t(7462),i=t(3366),r=(t(7294),t(3905)),s=(t(9055),t(8909)),a=["components"],l={},c=void 0,p={unversionedId:"FrontEnd/ComponentsSection/CollapsibleView",id:"FrontEnd/ComponentsSection/CollapsibleView",isDocsHomePage:!1,title:"CollapsibleView",description:"expanded content revealed on click",source:"@site/docs/FrontEnd/ComponentsSection/CollapsibleView.mdx",sourceDirName:"FrontEnd/ComponentsSection",slug:"/FrontEnd/ComponentsSection/CollapsibleView",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/CollapsibleView",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"ClickToCallPhoneNumber",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/ClickToCallPhoneNumber"},next:{title:"ConfirmationAlert",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/ConfirmationAlert"}},d=[],m="<CollapsibleView text={'title of dropdown'}> \n    <TextView>expanded content revealed on click</TextView> \n</CollapsibleView>",x={toc:d,exampleString:m};function h(e){var n=e.components,t=(0,i.Z)(e,a);return(0,r.kt)("wrapper",(0,o.Z)({},x,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)(s.Z,{componentName:"CollapsibleView",example:m,codeString:"import React, { FC, useState } from 'react'\n\nimport { Pressable, PressableProps, ViewStyle } from 'react-native'\nimport { TextArea } from './index'\nimport { a11yHintProp, testIdProps } from 'utils/accessibility'\nimport { generateTestID } from 'utils/common'\nimport { useTheme } from 'utils/hooks'\nimport Box, { BoxProps } from './Box'\nimport TextView from './TextView'\nimport VAIcon, { VAIconProps } from './VAIcon'\n\n/**\n * Signifies props passed into {@link CollapsibleView}\n */\nexport type CollapsibleViewProps = {\n  /** text displayed on the touchable */\n  text: string\n  /** optional param that renders the child content outside text area when set to false (defaults to true) */\n  contentInTextArea?: boolean\n  /** optional a11y hint */\n  a11yHint?: string\n  /** Whether to display any of the collapsible view in a text area. If false, contentInTextArea will have no effect. **/\n  showInTextArea?: boolean\n}\n\n/**\n * CollapsibleView that on click reveals content, which is hidden again on another click\n *\n * @returns CollapsibleView component\n */\nconst CollapsibleView: FC<CollapsibleViewProps> = ({ text, contentInTextArea = true, showInTextArea = true, a11yHint, children }) => {\n  const theme = useTheme()\n  const [expanded, setExpanded] = useState(false)\n\n  const onPress = (): void => {\n    setExpanded(!expanded)\n  }\n\n  const boxStyles: BoxProps = {\n    // flexShrink is necessary to keep textView from expanding too far and causing a gap between text contents and arrow icon\n    // also keeps textView from pushing arrow beyond right margin when large text is enabled\n    flexShrink: 1,\n    mr: theme.dimensions.collapsibleIconMargin,\n    borderBottomWidth: 2,\n    borderBottomColor: 'secondary',\n  }\n\n  const getArrowIcon = (): React.ReactNode => {\n    const iconProps: VAIconProps = {\n      fill: theme.colors.icon.chevronCollapsible,\n      name: expanded ? 'ArrowUp' : 'ArrowDown',\n      width: 9,\n      height: 7,\n    }\n    return <VAIcon {...iconProps} />\n  }\n\n  const pressableProps: PressableProps = {\n    onPress,\n    accessibilityState: { expanded },\n    accessibilityRole: 'spinbutton',\n  }\n\n  const pressableStyles: ViewStyle = {\n    flexDirection: 'row',\n    alignItems: 'center',\n    minHeight: theme.dimensions.touchableMinHeight,\n  }\n\n  const childrenDisplayed = expanded && <Box>{children}</Box>\n\n  const touchableRow = (\n    <Box minHeight={theme.dimensions.touchableMinHeight}>\n      <Pressable {...testIdProps(generateTestID(text, ''))} {...a11yHintProp(a11yHint || '')} style={pressableStyles} {...pressableProps}>\n        <Box {...boxStyles}>\n          <TextView variant={'MobileBody'}>{text}</TextView>\n        </Box>\n        {getArrowIcon()}\n      </Pressable>\n    </Box>\n  )\n\n  // If none of the content is shown in a text area\n  if (!showInTextArea) {\n    return (\n      <Box>\n        {touchableRow}\n        {childrenDisplayed}\n      </Box>\n    )\n  }\n\n  // If the pressable row and/or content is in a text area\n  return (\n    <Box>\n      <TextArea>\n        {touchableRow}\n        {contentInTextArea && childrenDisplayed}\n      </TextArea>\n      {!contentInTextArea && childrenDisplayed}\n    </Box>\n  )\n}\n\nexport default CollapsibleView\n",mdxType:"ComponentTopInfo"}))}h.isMDXComponent=!0}}]);
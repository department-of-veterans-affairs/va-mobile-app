"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[8371],{6832:function(t,o,e){e.r(o),e.d(o,{contentTitle:function(){return d},default:function(){return f},exampleString:function(){return m},frontMatter:function(){return c},metadata:function(){return p},toc:function(){return l}});var n=e(7462),r=e(3366),s=(e(7294),e(3905)),i=(e(9055),e(8909)),a=["components"],c={},d=void 0,p={unversionedId:"FrontEnd/ComponentsSection/FooterButton",id:"FrontEnd/ComponentsSection/FooterButton",isDocsHomePage:!1,title:"FooterButton",description:"export const exampleString = `<FooterButton",source:"@site/docs/FrontEnd/ComponentsSection/FooterButton.mdx",sourceDirName:"FrontEnd/ComponentsSection",slug:"/FrontEnd/ComponentsSection/FooterButton",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/FooterButton",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"FocusedNavHeaderText",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/FocusedNavHeaderText"},next:{title:"HeaderTitle",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/HeaderTitle"}},l=[],m="<FooterButton \ntext='test' \niconProps={{ name: 'Compose' }} \nbackgroundColor='main' \ntestID='test-id' />",u={toc:l,exampleString:m};function f(t){var o=t.components,e=(0,r.Z)(t,a);return(0,s.kt)("wrapper",(0,n.Z)({},u,e,{components:o,mdxType:"MDXLayout"}),(0,s.kt)(i.Z,{componentName:"FooterButton",example:m,codeString:"import React, { FC, useState } from 'react'\n\nimport { Pressable, PressableProps } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\nimport { VAButtonTextColors, VATextColors } from '../styles/theme'\nimport { a11yHintProp, testIdProps } from 'utils/accessibility'\nimport { themeFn } from 'utils/theme'\nimport { useTheme } from 'utils/hooks'\nimport Box, { BackgroundVariant, BoxProps } from './Box'\nimport TextView from './TextView'\nimport VAIcon, { VAIconProps } from './VAIcon'\nimport styled from 'styled-components'\n\nexport type FooterButtonProps = {\n  /** text that will display on the button */\n  text: string\n  /** text color */\n  textColor?: keyof VATextColors | keyof VAButtonTextColors\n  /** props for icon */\n  iconProps?: VAIconProps\n  /** function called when pressed */\n  onPress?: () => void\n  /** background color */\n  backGroundColor?: BackgroundVariant\n  /** test id */\n  testID?: string\n  /** optional accessibility hint */\n  a11yHint?: string\n}\n\nconst StyledSafeAreaView = styled(SafeAreaView)`\n  background-color: ${themeFn((theme) => theme.colors.background.navButton)};\n`\n/**A common component to show a button at the bottom of the screen that takes the full width of the display. Optional Icon can be passed in to render next to text */\nconst FooterButton: FC<FooterButtonProps> = ({ text, iconProps, onPress, textColor, backGroundColor, testID, a11yHint }) => {\n  const theme = useTheme()\n\n  const [isPressed, setIsPressed] = useState(false)\n\n  const getTextColor = (): keyof VATextColors | keyof VAButtonTextColors => {\n    if (textColor) {\n      return textColor\n    }\n\n    return isPressed ? 'footerButtonActive' : 'footerButton'\n  }\n\n  const pressableProps: PressableProps = {\n    onPress,\n    onPressIn: (): void => setIsPressed(true),\n    onPressOut: (): void => setIsPressed(false),\n    accessibilityRole: 'button',\n    accessible: true,\n  }\n\n  const boxProps: BoxProps = {\n    flexDirection: 'row',\n    justifyContent: 'center',\n    alignItems: 'center',\n    width: '100%',\n    backgroundColor: backGroundColor || isPressed ? 'footerButtonActive' : 'navButton',\n    borderTopColor: 'primary',\n    borderTopWidth: 'default',\n    minHeight: theme.dimensions.navBarHeight,\n    py: theme.dimensions.buttonPadding,\n    px: theme.dimensions.cardPadding,\n  }\n\n  return (\n    <StyledSafeAreaView edges={['bottom']}>\n      <Pressable {...pressableProps} {...testIdProps(testID || text)} {...a11yHintProp(a11yHint || '')}>\n        <Box {...boxProps}>\n          {iconProps && (\n            <Box mr={theme.dimensions.condensedMarginBetween}>\n              <VAIcon fill={isPressed ? 'footerButtonActive' : 'footerButton'} width={22} height={22} preventScaling={true} {...iconProps} />\n            </Box>\n          )}\n          <TextView variant=\"MobileBodyBold\" allowFontScaling={false} color={getTextColor()} mr={theme.dimensions.textIconMargin}>\n            {text}\n          </TextView>\n        </Box>\n      </Pressable>\n    </StyledSafeAreaView>\n  )\n}\n\nexport default FooterButton\n",mdxType:"ComponentTopInfo"}))}f.isMDXComponent=!0}}]);
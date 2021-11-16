"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[3828],{4923:function(n,o,e){e.r(o),e.d(o,{contentTitle:function(){return c},default:function(){return C},exampleString:function(){return m},frontMatter:function(){return d},metadata:function(){return l},toc:function(){return u}});var t=e(7462),r=e(3366),s=(e(7294),e(3905)),i=(e(9055),e(8909)),a=["components"],d={},c=void 0,l={unversionedId:"FrontEnd/ComponentsSection/LargeNavButton",id:"FrontEnd/ComponentsSection/LargeNavButton",isDocsHomePage:!1,title:"LargeNavButton",description:"export const exampleString = ` <LargeNavButton",source:"@site/docs/FrontEnd/ComponentsSection/LargeNavButton.mdx",sourceDirName:"FrontEnd/ComponentsSection",slug:"/FrontEnd/ComponentsSection/LargeNavButton",permalink:"/docs/FrontEnd/ComponentsSection/LargeNavButton",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"HeaderTitle",permalink:"/docs/FrontEnd/ComponentsSection/HeaderTitle"},next:{title:"List",permalink:"/docs/FrontEnd/ComponentsSection/List"}},u=[],m=" <LargeNavButton\n title={'appointments.title'}\n subText={'appointments.subText'}\n a11yHint={'appointments.a11yHint'}\n onPress={() => {}}\n borderWidth={theme.dimensions.buttonBorderWidth}\n borderColor={'secondary'}\n borderColorActive={'primaryDarkest'}\n borderStyle={'solid'}\n/>",g={toc:u,exampleString:m};function C(n){var o=n.components,e=(0,r.Z)(n,a);return(0,s.kt)("wrapper",(0,t.Z)({},g,e,{components:o,mdxType:"MDXLayout"}),(0,s.kt)(i.Z,{componentName:"LargeNavButton",example:m,codeString:"import { Pressable, ViewStyle } from 'react-native'\nimport React, { FC, useState } from 'react'\n\nimport { BackgroundVariant, BorderColorVariant, BorderStyles, BorderWidths, Box, BoxProps, TextView, VAIcon } from 'components'\nimport { VAIconColors, VATextColors } from 'styles/theme'\nimport { a11yHintProp, testIdProps } from 'utils/accessibility'\nimport { useTheme } from 'utils/hooks'\nimport MessagesCountTag from './MessagesCountTag'\n\ninterface HomeNavButtonProps {\n  /**string for header and used to create testID for accessibility*/\n  title: string\n  /**string secondary text that seats on the second row */\n  subText: string\n  /**string for accessibility hint */\n  a11yHint: string\n  /**function to be called when press occurs */\n  onPress: () => void\n  /**BackgroundVariant color for background */\n  backgroundColor?: BackgroundVariant\n  /**BackgroundVariant color for active state */\n  backgroundColorActive?: BackgroundVariant\n  /**VATextColors color for text */\n  textColor?: keyof VATextColors\n  /** VAIconColors icon color*/\n  iconColor?: keyof VAIconColors\n  /**BorderWidths possible widths for HomeNavButton*/\n  borderWidth?: BorderWidths\n  /**BorderColorVariant color for the borders*/\n  borderColor?: BorderColorVariant\n  /**BorderColorVariant color for active state for the borders*/\n  borderColorActive?: BorderColorVariant\n  /**BorderStyles denotes the styling of the borders*/\n  borderStyle?: BorderStyles\n  /**number for the tag */\n  tagCount?: number\n  /**a11y for the tag */\n  tagCountA11y?: string\n}\n\n/**\n * Reusable large navigation button\n * @returns LargeNavButton component\n */\nconst LargeNavButton: FC<HomeNavButtonProps> = ({\n  title,\n  subText,\n  a11yHint,\n  onPress,\n  backgroundColor,\n  backgroundColorActive,\n  textColor,\n  iconColor,\n  borderWidth,\n  borderColor,\n  borderColorActive,\n  borderStyle,\n  tagCount,\n  tagCountA11y,\n}: HomeNavButtonProps) => {\n  const theme = useTheme()\n  const [isPressed, setIsPressed] = useState(false)\n\n  const _onPressIn = (): void => {\n    setIsPressed(true)\n  }\n\n  const _onPressOut = (): void => {\n    setIsPressed(false)\n  }\n\n  const _onPress = (): void => {\n    onPress()\n  }\n\n  const getBorderColor = (): BorderColorVariant | undefined => {\n    // animate borderColor\n    if (isPressed && borderColorActive) {\n      return borderColorActive\n    }\n    return borderColor\n  }\n\n  const getBackgroundColor = (): BackgroundVariant => {\n    // animate backgroundColor\n    if (isPressed && backgroundColorActive) {\n      return backgroundColorActive\n    }\n\n    return backgroundColor ? backgroundColor : 'textBox'\n  }\n\n  const boxProps: BoxProps = {\n    minHeight: 81,\n    borderRadius: 6,\n    p: theme.dimensions.cardPadding,\n    mb: theme.dimensions.condensedMarginBetween,\n    backgroundColor: getBackgroundColor(),\n    borderWidth,\n    borderColor: getBorderColor(),\n    borderStyle,\n  }\n\n  const pressableStyles: ViewStyle = {\n    width: '100%',\n    justifyContent: 'space-between',\n    flexDirection: 'row',\n    alignItems: 'center',\n  }\n  const testId = `${title} ${tagCountA11y || ''}`.trim()\n\n  return (\n    <Box {...boxProps}>\n      <Pressable\n        style={pressableStyles}\n        onPress={_onPress}\n        onPressIn={_onPressIn}\n        onPressOut={_onPressOut}\n        accessible={true}\n        accessibilityRole={'menuitem'}\n        {...a11yHintProp(a11yHint)}\n        {...testIdProps(testId)}>\n        <Box flex={1}>\n          <Box flexDirection={'row'} flexWrap={'wrap'} mb={theme.dimensions.condensedMarginBetween}>\n            <TextView mr={theme.dimensions.condensedMarginBetween} variant=\"BitterBoldHeading\" color={textColor}>\n              {title}\n            </TextView>\n            {!!tagCount && <MessagesCountTag unread={tagCount} />}\n          </Box>\n          <TextView color={textColor}>{subText}</TextView>\n        </Box>\n        <VAIcon name=\"ArrowRight\" fill={`${iconColor ? iconColor : 'inactive'}`} width={10} height={15} ml={theme.dimensions.listItemDecoratorMarginLeft} />\n      </Pressable>\n    </Box>\n  )\n}\n\nexport default LargeNavButton\n",mdxType:"ComponentTopInfo"}))}C.isMDXComponent=!0}}]);
"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[1513],{32666:(e,n,t)=>{t.d(n,{Z:()=>u});var a=t(67294),r=t(97405),o=t(22808),s=t(30433),l=t(41284),i=t(36005);const c=e=>{let{props:n}=e;return n?a.createElement(a.Fragment,null,i.ZP.isEmpty(n)?a.createElement("pre",{className:"preText"},"This component does not have props defined"):a.createElement("table",null,a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"Name"),a.createElement("th",null,"Type"),a.createElement("th",null,"Default Value"),a.createElement("th",null,"Required"),a.createElement("th",null,"Description"))),a.createElement("tbody",null,Object.keys(n).map((e=>a.createElement("tr",{key:e},a.createElement("td",null,a.createElement("code",null,e)),a.createElement("td",{style:{minWidth:200}},n[e].type?.name),a.createElement("td",null,n[e].defaultValue&&n[e].defaultValue.value.toString()),a.createElement("td",null,n[e].required?"Yes":"No"),a.createElement("td",null,n[e].description))))))):null};function u(e){const n=(0,l.N)(e.componentName),{description:t,displayName:i,props:u}=n[0],d=`How to use the ${i} component`,m=`Full code for the ${i} component`;return a.createElement(a.Fragment,null,t,a.createElement("br",null),a.createElement("br",null),a.createElement(o.Z,null,a.createElement(s.Z,{value:"props",label:"Properties"},a.createElement(c,{props:u})),a.createElement(s.Z,{value:"example",label:"Example"},e.example&&a.createElement(r.Z,{title:d,className:"language-tsx test"},e.example)),a.createElement(s.Z,{value:"code",label:"Source Code"},e.codeString&&a.createElement(r.Z,{title:m,className:"language-tsx"},e.codeString)),a.createElement(s.Z,{value:"accessibility",label:"Accessibility"},a.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},41284:(e,n,t)=>{t.d(n,{N:()=>r});var a=t(52426);const r=e=>(0,a.ZP)()["docusaurus-plugin-react-docgen-typescript"].default.filter((n=>n.displayName===e))},52610:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>i,default:()=>g,exampleString:()=>m,frontMatter:()=>l,metadata:()=>c,toc:()=>d});var a=t(87462),r=(t(67294),t(3905));t(8209),t(97405);const o="import React, { ReactElement, useState } from 'react'\nimport { Pressable } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\n\nimport { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'\nimport { NavigationHelpers, ParamListBase } from '@react-navigation/native'\n\nimport { TFunction } from 'i18next'\nimport styled from 'styled-components'\nimport _ from 'underscore'\n\nimport { a11yHintProp, testIdProps } from 'utils/accessibility'\nimport { useRouteNavigation, useTheme } from 'utils/hooks'\nimport { themeFn } from 'utils/theme'\n\nimport { Box, BoxProps, TextView } from '../index'\nimport { CarouselScreen } from './Carousel'\n\nconst StyledSafeAreaView = styled(SafeAreaView)`\n  background-color: ${themeFn((theme) => theme.colors.background.carousel)};\n`\n\nconst StyledPressable = styled(Pressable)`\n  min-height: ${themeFn((theme) => theme.dimensions.touchableMinHeight)}px;\n  justify-content: center;\n`\n\ntype CarouselTabBarProps = {\n  /** the tab navigators navigation helpers */\n  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>\n\n  /** called when the skip button is clicked or the user has gone through all the carousel components */\n  onCarouselEnd: () => void\n\n  /** useTranslations t function to translate the labels */\n  translation: TFunction\n\n  /** list of screens with the screen name and the component in each item */\n  screenList: Array<CarouselScreen>\n}\n\n/**A common component with the carousel tab bar content. Displays skip button, continue button, and a progress bar*/\nfunction CarouselTabBar({ onCarouselEnd, screenList, translation }: CarouselTabBarProps) {\n  const theme = useTheme()\n  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)\n  const a11yHints = screenList[currentScreenIndex].a11yHints\n  const navigateTo = useRouteNavigation()\n\n  const onContinue = (): void => {\n    const updatedIndex = currentScreenIndex + 1\n\n    if (updatedIndex === screenList.length) {\n      onCarouselEnd()\n      return\n    }\n\n    setCurrentScreenIndex(updatedIndex)\n    navigateTo(screenList[updatedIndex].name)\n  }\n\n  const goBack = (): void => {\n    const updatedIndex = currentScreenIndex - 1\n    setCurrentScreenIndex(updatedIndex)\n    navigateTo(screenList[updatedIndex].name)\n  }\n\n  const getProgressBar = (): ReactElement[] => {\n    return _.map(screenList, (screen, index) => {\n      const boxProps: BoxProps = {\n        width: 12,\n        height: 12,\n        borderRadius: 6,\n        opacity: index === currentScreenIndex ? 1 : 0.5,\n        m: 6,\n        backgroundColor: 'carouselTab',\n      }\n\n      return <Box {...boxProps} key={index} />\n    })\n  }\n\n  const goBackOrSkipBtn = () => {\n    let onPressCallback: () => void\n    let buttonText: string\n    let allyHint: string | undefined\n\n    if (currentScreenIndex === 0) {\n      onPressCallback = onCarouselEnd\n      buttonText = 'skip'\n      allyHint = a11yHints?.skipHint\n    } else {\n      onPressCallback = goBack\n      buttonText = 'back'\n      allyHint = a11yHints?.backHint\n    }\n\n    return (\n      <StyledPressable\n        onPress={onPressCallback}\n        accessibilityRole=\"button\"\n        {...testIdProps(translation(buttonText))}\n        {...a11yHintProp(allyHint || '')}>\n        <TextView variant=\"MobileBody\" color=\"primaryContrast\" allowFontScaling={false} mr=\"auto\" selectable={false}>\n          {translation(buttonText)}\n        </TextView>\n      </StyledPressable>\n    )\n  }\n\n  const nextOrDoneBtn = () => {\n    let buttonText: string\n    let allyHint: string | undefined\n\n    if (currentScreenIndex === screenList.length - 1) {\n      buttonText = 'done'\n      allyHint = a11yHints?.doneHint\n    } else {\n      buttonText = 'next'\n      allyHint = a11yHints?.continueHint\n    }\n\n    return (\n      <StyledPressable\n        onPress={onContinue}\n        accessibilityRole=\"button\"\n        {...testIdProps(translation(buttonText))}\n        {...a11yHintProp(allyHint || '')}>\n        <TextView\n          variant=\"MobileBodyBold\"\n          color=\"primaryContrast\"\n          allowFontScaling={false}\n          ml=\"auto\"\n          selectable={false}>\n          {translation(buttonText)}\n        </TextView>\n      </StyledPressable>\n    )\n  }\n\n  const progressBarContainerProps: BoxProps = {\n    flex: 1,\n    display: 'flex',\n    alignItems: 'center',\n    justifyContent: 'center',\n    flexDirection: 'row',\n    accessibilityRole: 'progressbar',\n    accessible: true,\n    minHeight: theme.dimensions.touchableMinHeight,\n  }\n\n  return (\n    <StyledSafeAreaView edges={['bottom']}>\n      <Box\n        display=\"flex\"\n        flexDirection=\"row\"\n        height={70}\n        backgroundColor=\"carousel\"\n        alignItems=\"center\"\n        mx={theme.dimensions.gutter}>\n        <Box flex={1} display=\"flex\" justifyContent=\"center\">\n          {goBackOrSkipBtn()}\n        </Box>\n        <Box\n          {...testIdProps(translation('carouselIndicators'))}\n          {...a11yHintProp(a11yHints?.carouselIndicatorsHint || '')}\n          {...progressBarContainerProps}>\n          {getProgressBar()}\n        </Box>\n        <Box flex={1} display=\"flex\" justifyContent=\"center\">\n          {nextOrDoneBtn()}\n        </Box>\n      </Box>\n    </StyledSafeAreaView>\n  )\n}\n\nexport default CarouselTabBar\n";var s=t(32666);const l={},i=void 0,c={unversionedId:"Flagship design library/Components/Navigation/Secondary/CarouselTabBar",id:"Flagship design library/Components/Navigation/Secondary/CarouselTabBar",title:"CarouselTabBar",description:"",source:"@site/docs/Flagship design library/Components/Navigation/Secondary/CarouselTabBar.mdx",sourceDirName:"Flagship design library/Components/Navigation/Secondary",slug:"/Flagship design library/Components/Navigation/Secondary/CarouselTabBar",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Secondary/CarouselTabBar",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Carousel",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Secondary/Carousel"},next:{title:"Pagination",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Secondary/Pagination"}},u={},d=[],m='<CarouselTabNav.Navigator \ntabBar={(props): \nReact.ReactNode => <CarouselTabBar {...props} \nonCarouselEnd={onCarouselEnd} \ntranslation={translation} \nscreenList={screenList} />}>\n    <CarouselTabNav.Screen \n    name="Main" \n    children={(): ReactElement => <CarouselStackComponent screenList={screenList} />} \n    options={{ headerShown: false }} />\n</CarouselTabNav.Navigator>',p={toc:d,exampleString:m},b="wrapper";function g(e){let{components:n,...t}=e;return(0,r.kt)(b,(0,a.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)(s.Z,{componentName:"CarouselTabBar",example:m,codeString:o,mdxType:"ComponentTopInfo"}))}g.isMDXComponent=!0}}]);
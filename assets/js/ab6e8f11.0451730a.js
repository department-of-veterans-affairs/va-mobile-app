"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9701],{7644:(e,t,n)=>{n.d(t,{A:()=>m});var a=n(96540),o=n(54610),i=n(3384),r=n(31347),s=n(28057),l=n(84476);const c=e=>{let{props:t}=e;return t?a.createElement(a.Fragment,null,l.Ay.isEmpty(t)?a.createElement("pre",{className:"preText"},"This component does not have props defined"):a.createElement("table",null,a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"Name"),a.createElement("th",null,"Type"),a.createElement("th",null,"Default Value"),a.createElement("th",null,"Required"),a.createElement("th",null,"Description"))),a.createElement("tbody",null,Object.keys(t).map((e=>a.createElement("tr",{key:e},a.createElement("td",null,a.createElement("code",null,e)),a.createElement("td",{style:{minWidth:200}},t[e].type?.name),a.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),a.createElement("td",null,t[e].required?"Yes":"No"),a.createElement("td",null,t[e].description))))))):null};function m(e){const t=(0,s.d)(e.componentName),{description:n,displayName:l,props:m}=t[0],u=`How to use the ${l} component`,p=`Full code for the ${l} component`;return a.createElement(a.Fragment,null,n,a.createElement("br",null),a.createElement("br",null),a.createElement(i.A,null,a.createElement(r.A,{value:"props",label:"Properties"},a.createElement(c,{props:m})),a.createElement(r.A,{value:"example",label:"Example"},e.example&&a.createElement(o.A,{title:u,className:"language-tsx test"},e.example)),a.createElement(r.A,{value:"code",label:"Source Code"},e.codeString&&a.createElement(o.A,{title:p,className:"language-tsx"},e.codeString)),a.createElement(r.A,{value:"accessibility",label:"Accessibility"},a.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},28057:(e,t,n)=>{n.d(t,{d:()=>o});var a=n(2736);const o=e=>(0,a.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((t=>t.displayName===e))},41715:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>l,default:()=>g,exampleString:()=>p,frontMatter:()=>s,metadata:()=>c,toc:()=>u});var a=n(58168),o=(n(96540),n(15680));n(41873),n(54610);const i="import React, { FC, useEffect } from 'react'\nimport { useTranslation } from 'react-i18next'\nimport { AccessibilityRole, AccessibilityState, TouchableWithoutFeedback } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\n\nimport { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'\nimport { NavigationHelpers, ParamListBase, TabNavigationState, useIsFocused } from '@react-navigation/native'\n\nimport { TFunction } from 'i18next'\nimport styled from 'styled-components'\n\nimport { NAMESPACE } from 'constants/namespaces'\nimport { a11yValueProp } from 'utils/accessibility'\nimport { useRouteNavigation, useTheme } from 'utils/hooks'\nimport { changeNavigationBarColor } from 'utils/rnNativeUIUtilities'\nimport { themeFn } from 'utils/theme'\n\nimport Box from './Box'\nimport IconWithText, { IconWithTextProps } from './IconWithText'\n\ntype TabBarRoute = {\n  key: string\n  name: string\n}\n\n/**\n *  Signifies the props that need to be passed in to {@link NavigationTabBar}\n */\nexport type NavigationTabBarProps = {\n  /** the tab navigators current state */\n  state: TabNavigationState<ParamListBase>\n\n  /** the tab navigators navigation helpers */\n  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>\n\n  /** useTranslations t function to translate the labels */\n  translation: TFunction\n}\n\nconst StyledSafeAreaView = styled(SafeAreaView)`\n  background-color: ${themeFn((theme) => theme.colors.background.navButton)};\n`\n/**Component for the bottom tab navigation*/\nconst NavigationTabBar: FC<NavigationTabBarProps> = ({ state, navigation, translation }) => {\n  const theme = useTheme()\n  const { t } = useTranslation(NAMESPACE.COMMON)\n  const navigateTo = useRouteNavigation()\n  const isNavBarFocused = useIsFocused()\n\n  useEffect(() => {\n    const navBarColor = isNavBarFocused ? theme.colors.background.navButton : theme.colors.background.main\n    const isLightTheme = theme.mode === 'light'\n    changeNavigationBarColor(navBarColor, isLightTheme, false)\n  }, [isNavBarFocused, theme])\n\n  const onPress = (route: TabBarRoute, isFocused: boolean): void => {\n    const event = navigation.emit({\n      type: 'tabPress',\n      target: route.key,\n      canPreventDefault: true,\n    })\n\n    if (!isFocused && !event.defaultPrevented) {\n      navigateTo(route.name)\n    }\n  }\n\n  const onLongPress = (route: TabBarRoute): void => {\n    navigation.emit({\n      type: 'tabLongPress',\n      target: route.key,\n    })\n  }\n\n  return (\n    <StyledSafeAreaView edges={['bottom']}>\n      <Box\n        flexDirection=\"row\"\n        backgroundColor={'navButton'}\n        height={theme.dimensions.navBarHeight}\n        borderTopColor=\"primary\"\n        borderTopWidth={theme.dimensions.borderWidth}\n        accessibilityRole=\"toolbar\">\n        {state.routes.map((route: TabBarRoute, index: number) => {\n          const isFocused = state.index === index\n          const routeName = route.name.replace('Tab', '')\n          const lowerCaseRoute = routeName.toLowerCase()\n          const translatedName = translation(`${lowerCaseRoute}.title`)\n\n          type TouchableProps = {\n            key: string\n            onPress: () => void\n            onLongPress: () => void\n            accessibilityRole: AccessibilityRole\n            accessibilityState: AccessibilityState\n            accessible: boolean\n          }\n\n          const props: TouchableProps = {\n            key: route.name,\n            onPress: (): void => onPress(route as TabBarRoute, isFocused),\n            onLongPress: (): void => onLongPress(route as TabBarRoute),\n            accessibilityRole: 'link',\n            accessibilityState: isFocused ? { selected: true } : { selected: false },\n            accessible: true,\n          }\n\n          const iconProps: IconWithTextProps = {\n            name: 'Home',\n            fill: isFocused ? theme.colors.icon.active : theme.colors.icon.inactive,\n            label: routeName,\n            labelColor: isFocused ? 'textWithIconButton' : 'textWithIconButtonInactive',\n            height: 24,\n            width: 24,\n          }\n          switch (routeName) {\n            case 'Home':\n              iconProps.height = 28\n              iconProps.width = 28\n              iconProps.mt = -1\n              iconProps.name = isFocused ? 'Home' : 'HomeOutlined'\n              break\n            case 'Health':\n              iconProps.name = isFocused ? 'MedicalServices' : 'MedicalServicesOutlined'\n              break\n            case 'Benefits':\n              iconProps.name = isFocused ? 'Description' : 'DescriptionOutlined'\n              break\n            case 'Payments':\n              iconProps.name = isFocused ? 'RequestQuote' : 'RequestQuoteOutlined'\n              break\n            default:\n              iconProps.name = 'Home'\n          }\n\n          return (\n            <TouchableWithoutFeedback\n              accessibilityLabel={translatedName}\n              testID={translatedName}\n              {...props}\n              {...a11yValueProp({ text: t('listPosition', { position: index + 1, total: state.routes.length }) })}>\n              <Box flex={1} display=\"flex\" flexDirection=\"column\" mt={7}>\n                <Box alignSelf=\"center\" position=\"absolute\" mt={theme.dimensions.buttonBorderWidth}>\n                  <IconWithText {...iconProps} />\n                </Box>\n              </Box>\n            </TouchableWithoutFeedback>\n          )\n        })}\n      </Box>\n    </StyledSafeAreaView>\n  )\n}\n\nexport default NavigationTabBar\n";var r=n(7644);const s={},l=void 0,c={unversionedId:"Flagship design library/Components/Navigation/Primary/NavigationTabBar",id:"Flagship design library/Components/Navigation/Primary/NavigationTabBar",title:"NavigationTabBar",description:"",source:"@site/docs/Flagship design library/Components/Navigation/Primary/NavigationTabBar.mdx",sourceDirName:"Flagship design library/Components/Navigation/Primary",slug:"/Flagship design library/Components/Navigation/Primary/NavigationTabBar",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Primary/NavigationTabBar",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"HeaderTitle",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Primary/HeaderTitle"},next:{title:"Secondary navigation",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Secondary/"}},m={},u=[],p='<>\n  <TabNav.Navigator \n  tabBar={(props): \n  React.ReactNode => <NavigationTabBar {...props} translation={t} />} \n  initialRouteName="HomeTab" \n  screenOptions={{ headerShown: false }}>\n        <TabNav.Screen name="HomeTab" component={HomeScreen} options={{ title: t(\'home:title\') }} />\n        <TabNav.Screen name="BenefitsTab" component={ClaimsScreen} options={{ title: t(\'common:benefits.title\') }} />\n        <TabNav.Screen name="HealthTab" component={HealthScreen} options={{ title: t(\'health:title\') }} />\n        <TabNav.Screen name="ProfileTab" component={ProfileScreen} options={{ title: t(\'profile:title\') }} />\n  </TabNav.Navigator>\n</>',d={toc:u,exampleString:p},b="wrapper";function g(e){let{components:t,...n}=e;return(0,o.yg)(b,(0,a.A)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.yg)(r.A,{componentName:"NavigationTabBar",example:p,codeString:i,mdxType:"ComponentTopInfo"}))}g.isMDXComponent=!0}}]);